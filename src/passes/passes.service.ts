import { Injectable } from '@nestjs/common';
import { getCertificates } from '../utils/certificates';
// import path from 'path';
import * as path from 'path';
import { promises as fs } from 'node:fs';
import { PKPass } from 'passkit-generator';
import * as Utils from 'passkit-generator/lib/utils';
import {
  PassQueryParams,
  PassTypeEnum,
} from "./passes.types";
import {getTransportPass} from "./passModels/models/transportPass";
import GenericPass from "./android/GenericPass";

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  return { ...target, ...source };
}

// ******************************************** //
// *** CODE FROM GET MODEL FOLDER INTERNALS *** //
// ******************************************** //

async function readFileOrDirectory(filePath: string) {
  if ((await fs.lstat(filePath)).isDirectory()) {
    return Promise.all(await readDirectory(filePath));
  } else {
    return fs
      .readFile(filePath)
      .then((content) => getObjectFromModelFile(filePath, content, 1));
  }
}

/**
 * Returns an object containing the parsed fileName
 * from a path along with its content.
 *
 * @param filePath
 * @param content
 * @param depthFromEnd - used to preserve localization lproj content
 * @returns
 */

function getObjectFromModelFile(
  filePath: string,
  content: Buffer,
  depthFromEnd: number,
) {
  const fileComponents = filePath.split(path.sep);
  const fileName = fileComponents
    .slice(fileComponents.length - depthFromEnd)
    .join('/');

  return { [fileName]: content };
}

/**
 * Reads a directory and returns all the files in it
 * as an Array<Promise>
 *
 * @param filePath
 * @returns
 */

async function readDirectory(filePath: string) {
  const dirContent = await fs.readdir(filePath).then(Utils.removeHidden);

  return dirContent.map(async (fileName) => {
    const content = await fs.readFile(path.resolve(filePath, fileName));
    return getObjectFromModelFile(path.resolve(filePath, fileName), content, 2);
  });
}

// *************************** //
// *** EXAMPLE FROM NOW ON *** //
// *************************** //

const passTemplate = (mergePassObj?: object) => new Promise<PKPass>(async (resolve) => {
  const modelPath = path.resolve(
    __dirname,
    `../../src/passes/passModels/subscriptionPass.pass`,
  );
  const [modelFilesList, certificates] = await Promise.all([
    fs.readdir(modelPath),
    getCertificates(),
  ]);

  const modelRecords = (
    await Promise.all(
      /**
       * Obtaining flattened array of buffer records
       * containing file name and the buffer itself.
       *
       * This goes also to read every nested l10n
       * subfolder.
       */

      modelFilesList.map((fileOrDirectoryPath) => {
        const fullPath = path.resolve(modelPath, fileOrDirectoryPath);

        return readFileOrDirectory(fullPath);
      }),
    )
  )
    .flat(1)
    .reduce((acc, current) => ({ ...acc, ...current }), {});


  // Merge object
  if (mergePassObj) {
    const parsedPass = JSON.parse(modelRecords['pass.json'].toString('utf-8'));

    const newPass = deepMerge(parsedPass, mergePassObj);

    modelRecords['pass.json'] = Buffer.from(JSON.stringify(newPass), 'utf-8');
  }

  /** Creating a PKPass Template */

  return resolve(
    new PKPass(modelRecords, {
      wwdr: certificates.wwdr,
      signerCert: certificates.signerCert,
      signerKey: certificates.signerKey,
      signerKeyPassphrase: certificates.signerKeyPassphrase,
    }),
  );
});

const passesFns = {
  [PassTypeEnum.TRANSPORT_SUBSCRIPTION]: getTransportPass,
  [PassTypeEnum.TRANSPORT_TICKET]: getTransportPass,
};


@Injectable()
export class PassesService {

  genericPass: GenericPass;

  constructor() {
    this.genericPass = new GenericPass();
  }

  async getAndroidPass(params: PassQueryParams) {
    const issuer_id = '3388000000022825706';
    const class_suffix = (process.env.WALLET_CLASS_SUFFIX || 'class_' + params.type);
    const object_suffix = (process.env.WALLET_OBJECT_SUFFIX || 'object_' + params.type) + Date.now();

    // await this.genericPass.createClass(issuerId, classSuffix);
    // await this.genericPass.createObject(issuerId, classSuffix, objectSuffix);
    return this.genericPass.createJwtNewObjects(issuer_id, class_suffix, object_suffix, params)
  }

  async createPass(params: PassQueryParams): Promise<PKPass | null> {
    console.log('data:', params)

    if (!PassTypeEnum[params.type]) {
      throw new Error(`This type is not available`);
    }

    try {
      const mergePassObj = passesFns[params.type](params);
      console.log('mergePassObj:', mergePassObj);
      const templatePass = await passTemplate(mergePassObj);

      const pass = await PKPass.from(
        templatePass,
        {
          serialNumber: params.id,
        }
      );

      if (pass.type === 'boardingPass' && !pass.transitType) {
        // Just to not make crash the creation if we use a boardingPass
        pass.transitType = 'PKTransitTypeAir';
      }

      pass.setBarcodes({
        message: params.id,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1',
      });

      return pass;
    } catch (error) {
      throw new Error(`Failed to create pass: ${error.message}`);
    }
  }
}
