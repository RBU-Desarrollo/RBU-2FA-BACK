import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const algorithm = process.env.CRYPTO_ALGORITHM as string;
const secretKey = Buffer.from(
  process.env.CRYPTO_SECRET_KEY as string,
  'base64'
);

const generateInitialVector = (): Buffer => randomBytes(16);

const convertVectorToBuffer = (iv?: string): Buffer =>
  Buffer.from(iv ?? (process.env.CRYPTO_IV as string), 'hex');

const convertVectorToString = (iv?: Buffer): string =>
  iv?.toString('hex') ?? (process.env.CRYPTO_IV as string);

const encryptValue = ({
  value,
  iv
}: {
  value: string;
  iv: Buffer;
}): { iv: string; content: string } => {
  const cipher = createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

const decryptValue = (hash: { iv: string; content: string }): string => {
  const decipher = createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, 'hex')
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final()
  ]);

  return decrypted.toString();
};

export {
  generateInitialVector,
  convertVectorToBuffer,
  convertVectorToString,
  encryptValue,
  decryptValue
};
