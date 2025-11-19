// frontend/src/hooks/useLazyJSON.js
import { useState, useCallback } from 'react';

export const useLazyJSON = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadJSON = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to load JSON');
      }
      const jsonData = await response.json();
      setData(jsonData);
      return jsonData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, loadJSON };
};