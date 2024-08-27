export const removeDuplicateObjects = <T>(array: T[]): T[] => {
  const uniqueSet = new Set<string>();
  return array.filter((item) => {
    const key = JSON.stringify(item);
    if (!uniqueSet.has(key)) {
      uniqueSet.add(key);
      return true;
    }
    return false;
  });
};
