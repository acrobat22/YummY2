import { useItems } from "../../hooks/useItems";
import Loading from "../../components/Loading";
import Bandeau from "../../components/site/includes/contactUs/bandeau";
import Cta from '../../components/site/includes/promesse/Cta';

const Items = () => {
  // Récupère TOUS les items (sans filtre de catégorie et sans vérifier l'authentification)
  const { items, loading, error } = useItems();

  if (loading) return <Loading />;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <main className="w-screen">
      <Cta />
      {/* <Carte /> */}
      {/* ********** Carte *********************** */}
      {items.length === 0 ? (
        <p>Aucun article trouvé.</p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.name}</h3>
              <p>{item.description || "Pas de description"}</p>
              <p>{item.price} €</p>
            </div>
          ))}
        </div>
      )}
      {/* ********** Carte *********************** */}
      <Bandeau />
    </main>
  );
};

export default Items;
