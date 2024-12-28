import { useState, useEffect } from "react";

// Custom hook to manage persistent storage (localStorage)
export const usePersistentStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    // Try to get the stored value from localStorage or fallback to initialValue
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value)); // Persist to localStorage
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  };

  return [storedValue, setValue];
};
