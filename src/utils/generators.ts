export const generateVerificationCode = () => {
  const min = 100001;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
