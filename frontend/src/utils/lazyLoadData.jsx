// frontend/src/utils/lazyLoadData.js
export const loadDataFromJSON = async (filename) => {
  try {
    // Les fichiers JSON doivent être dans le dossier public
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading JSON:', error);
    throw error;
  }
};

// Exemple d'utilisation dans un composant:
// const { data, loading, error, loadJSON } = useLazyJSON();
// 
// useEffect(() => {
//   loadJSON('/data/example.json');
// }, []);