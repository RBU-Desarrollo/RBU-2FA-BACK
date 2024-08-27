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
