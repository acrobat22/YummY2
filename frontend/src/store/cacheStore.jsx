// frontend/src/store/cacheStore.jsx
import { create } from 'zustand';

const useCacheStore = create((set, get) => ({
  // Cache des catégories
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  categoriesLastFetch: null,
  
  // Cache des items
  items: [],
  itemsLoading: false,
  itemsError: null,
  itemsLastFetch: null,
  
  // Actions pour les catégories
  setCategories: (categories) => set({ 
    categories, 
    categoriesLastFetch: Date.now(),
    categoriesError: null 
  }),
  
  setCategoriesLoading: (loading) => set({ categoriesLoading: loading }),
  
  setCategoriesError: (error) => set({ categoriesError: error }),
  
  addCategory: (category) => set((state) => ({
    categories: [...state.categories, category]
  })),
  
  updateCategory: (id, updatedData) => set((state) => ({
    categories: state.categories.map(cat =>
      cat.id === id ? { ...cat, ...updatedData } : cat
    )
  })),
  
  removeCategory: (id) => set((state) => ({
    categories: state.categories.filter(cat => cat.id !== id),
    // Supprimer aussi les items liés (cascade)
    items: state.items.filter(item => item.categoryId !== id)
  })),
  
  // Actions pour les items
  setItems: (items) => set({ 
    items, 
    itemsLastFetch: Date.now(),
    itemsError: null 
  }),
  
  setItemsLoading: (loading) => set({ itemsLoading: loading }),
  
  setItemsError: (error) => set({ itemsError: error }),
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  updateItem: (id, updatedData) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, ...updatedData } : item
    )
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  
  // Vérifier si le cache est valide (5 minutes)
  isCacheValid: (lastFetch) => {
    if (!lastFetch) return false;
    const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
    return Date.now() - lastFetch < CACHE_TIME;
  },
  
  // Nettoyer le cache
  clearCache: () => set({
    categories: [],
    categoriesLastFetch: null,
    items: [],
    itemsLastFetch: null
  })
}));

export default useCacheStore;