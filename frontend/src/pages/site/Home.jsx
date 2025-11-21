// frontend/src/pages/Home.jsx
import Bandeau from "../../components/site/includes/contactUs/bandeau";
import Cta from '../../components/site/includes/promesse/Cta'

const Home = () => {
  return (
        <main className="w-screen">
            <Cta />
            <Bandeau />
        </main>
  );
};

export default Home;
