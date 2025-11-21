import fb from '../../../assets/images/logos/logo-facebook.svg'
import insta from '../../../assets/images/logos/logo-instagram.svg'
import map from '../../../assets/images/logos/logo-maps-location.svg'


function Footer() {
    return (
        <footer className="w-screen bg-black flex justify-evenly md:justify-end pt-3 pb-3 md:gap-6">
            <img src={fb} alt="Yummy Nouilles logo Facebook"/>
            <img src={insta} alt="Yummy Nouilles logo Instagram"/>
            <img className="md:mr-4" src={map} alt="Yummy Nouilles Trouvez nous"/>
        </footer>
    );
}

export default Footer;