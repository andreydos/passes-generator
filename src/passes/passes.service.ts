import { Injectable } from '@nestjs/common';
import { getCertificates } from '../utils/certificates';
// import path from 'path';
import * as path from 'path';
import { promises as fs } from 'node:fs';
import { PKPass } from 'passkit-generator';
import * as Utils from 'passkit-generator/lib/utils';
import {CreatePassBody, SubscriptionPassCreateData} from "./passes.types";
import {format} from "date-fns/format";

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

@Injectable()
export class PassesService {
  async createTransportSubscriptionPass(data: SubscriptionPassCreateData): Promise<PKPass> {
    console.log('data', data)
    try {
      const templatePass = await passTemplate({
        generic: {
        headerFields: [{
          "key": "subscriptionType",
          "label": "Тип",
          "value": "Test",
        }],
        primaryFields: [
          {
            "key": "endDate",
            "label": "Дійсний до",
            "value": format(data.endDate, 'dd-M-y'),
          }
        ],
        "secondaryFields": [
          {
            "key": "number",
            "label": "Номер",
            "value": data.number,
          },
          {
            "key": "startDate",
            "label": "Дата придбання",
            "value": format(data.startDate, 'dd-M-y'),
            "textAlignment": "PKTextAlignmentRight"
          }
        ],
        "auxiliaryFields": [
          {
            "key": "price",
            "label": "Вартість",
            "value": `${data.price} UAH`
          },
          {
            "key": "organization",
            "label": "Організація",
            "value": "КП Дніпровський ЕДМР",
            "textAlignment": "PKTextAlignmentRight"
          }
        ]
      }
    });

      const pass = await PKPass.from(
        templatePass,
        {
          serialNumber: data.id,
        }
      );

      pass.setRelevantDate(new Date(data.endDate));

      if (pass.type === 'boardingPass' && !pass.transitType) {
        // Just to not make crash the creation if we use a boardingPass
        pass.transitType = 'PKTransitTypeAir';
      }

      pass.setBarcodes({
        message: data.id,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1',
      });

      return pass;
    } catch (error) {
      throw new Error(`Failed to create pass: ${error.message}`);
    }
  }
  async createPass(request): Promise<PKPass> {
    try {
      const templatePass = await passTemplate();

      const pass = await PKPass.from(
        templatePass,
        request.body || request.params || request.query,
      );

      if (pass.type === 'boardingPass' && !pass.transitType) {
        // Just to not make crash the creation if we use a boardingPass
        pass.transitType = 'PKTransitTypeAir';
      }

      if (request?.query?.plate) {
        // auto plate number from params
        pass.auxiliaryFields[0].value = request?.query?.plate.toString();
        pass.props.serialNumber = request?.query?.plate.toString();
        pass.setBarcodes({
          message: request?.query?.plate.toString(),
          format: 'PKBarcodeFormatQR',
          messageEncoding: 'iso-8859-1',
        });
      }

      // auto plate number
      // pass.auxiliaryFields[1].value = 'квартал';

      return pass;
    } catch (error) {
      throw new Error(`Failed to create pass: ${error.message}`);
    }
  }
}
