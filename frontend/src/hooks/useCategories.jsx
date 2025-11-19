import { useEffect, useCallback } from 'react';
import { categoriesAPI } from '../services/api';
import useCacheStore from '../store/cacheStore';

export const useCategories = (forceRefresh = false) => {
  const {
    categories,
    categoriesLoading,
    categoriesError,
    categoriesLastFetch,
    setCategories,
    setCategoriesLoading,
    setCategoriesError,
    isCacheValid,
  } = useCacheStore();

  // Fonction pour recharger les catégories
  const fetchCategories = useCallback(async () => {
    if (!forceRefresh && isCacheValid(categoriesLastFetch)) {
      return;
    }

    setCategoriesLoading(true);
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data.categories);
    } catch (error) {
      setCategoriesError(error.message);
    } finally {
      setCategoriesLoading(false);
    }
  }, [forceRefresh, isCacheValid, categoriesLastFetch, setCategories, setCategoriesLoading, setCategoriesError]);

  // Déclencher le chargement au montage ou si forceRefresh change
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fonction pour forcer le rafraîchissement
  const refetch = useCallback(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  return {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch,
  };
};
