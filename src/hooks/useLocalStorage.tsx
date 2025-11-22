import { secureGetItem, secureSetItem } from "@/lib/utils";
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // const item = window.localStorage.getItem(key);
      const item = secureGetItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      secureSetItem(key, valueToStore);
      // window.localStorage.setItem(key, JSON.stringify(valueToStore));

      // Dispatch custom event for cross-component updates
      window.dispatchEvent(
        new CustomEvent("localStorageChange", {
          detail: { key, value: valueToStore },
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener(
      "localStorageChange",
      handleStorageChange as EventListener
    );
    return () =>
      window.removeEventListener(
        "localStorageChange",
        handleStorageChange as EventListener
      );
  }, [key]);

  return [storedValue, setValue] as const;
}
