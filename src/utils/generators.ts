import { base64UrlEncode } from './formatters';

export const generateVerificationCode = () => {
  const min = 100001;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateRecoveryToken = () => {
  const min = 100000001;
  const max = 999999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// This function does NOT generate a valid JWT token, only it's structure
export const generateActiveToken = ({
  sub,
  name
}: {
  sub: string;
  name: string;
}) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    sub,
    name,
    iat: Math.floor(Date.now() / 1000)
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = base64UrlEncode(Math.random().toString(36).substring(2));

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};
