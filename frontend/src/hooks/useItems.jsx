// frontend/src/hooks/useItems.js
import { useEffect, useCallback } from 'react';
import { itemsAPI } from '../services/api';
import useCacheStore from '../store/cacheStore';

export const useItems = (categoryId = null, forceRefresh = false) => {
  const {
    items,
    itemsLoading,
    itemsError,
    itemsLastFetch,
    setItems,
    setItemsLoading,
    setItemsError,
    isCacheValid,
  } = useCacheStore();

  // Fonction pour récupérer les items
  const fetchItems = useCallback(async () => {
    if (!forceRefresh && isCacheValid(itemsLastFetch)) {
      return;
    }

    setItemsLoading(true);
    try {
      const data = await itemsAPI.getAll(categoryId);
      setItems(data.items || data); // Gestion des cas où la réponse est directement un tableau
    } catch (error) {
      setItemsError(error.message);
    } finally {
      setItemsLoading(false);
    }
  }, [
    forceRefresh,
    isCacheValid,
    itemsLastFetch,
    setItems,
    setItemsLoading,
    setItemsError,
    categoryId,
  ]);

  // Déclencher le chargement au montage ou si les dépendances changent
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Filtrer les items par catégorie si nécessaire
  const filteredItems = useCallback(
    () => (categoryId ? items.filter((item) => item.categoryId === categoryId) : items),
    [items, categoryId]
  );

  // Fonction pour forcer le rafraîchissement
  const refetch = useCallback(() => {
    fetchItems(true);
  }, [fetchItems]);

  return {
    items: filteredItems(),
    loading: itemsLoading,
    error: itemsError,
    refetch,
  };
};
