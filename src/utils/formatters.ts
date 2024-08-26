export const formatObjectToCamelCase = (obj: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newObj[newKey] = obj[key];
  });
  return newObj;
};
