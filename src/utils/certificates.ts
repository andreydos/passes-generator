import * as fs from 'fs';
import * as path from 'path';

interface Cache {
  certificates:
    | {
        signerCert: Buffer | string;
        signerKey: Buffer | string;
        wwdr: Buffer | string;
        signerKeyPassphrase: string;
      }
    | undefined;
}

const cache: Cache = {
  certificates: undefined,
};

export async function getCertificates(): Promise<
  Exclude<Cache['certificates'], undefined>
> {
  if (cache.certificates) {
    return cache.certificates;
  }

  const [signerCert, signerKey, wwdr, signerKeyPassphrase] = await Promise.all([
    fs.promises.readFile(
      path.resolve(__dirname, '../../src/certificates/signer-cert.pem'),
    ),
    fs.promises.readFile(
      path.resolve(__dirname, '../../src/certificates/signer-key.key'),
    ),
    fs.promises.readFile(path.resolve(__dirname, '../../src/certificates/wwdr.pem')),
    Promise.resolve('123456'),
  ]);

  cache.certificates = {
    signerCert,
    signerKey,
    wwdr,
    signerKeyPassphrase,
  };

  return cache.certificates;
}
