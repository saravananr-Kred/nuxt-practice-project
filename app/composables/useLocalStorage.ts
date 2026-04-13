export const useLocalStorage = (key: string, defaultValue: any) => {
  const value = useState(key, () => {
    if (import.meta.client) {
      return JSON.parse(
        localStorage.getItem(key) || JSON.stringify(defaultValue),
      );
    }
    return defaultValue;
  });

  watch(value, (newValue) => {
    if (import.meta.client) {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  });

  return value;
};
