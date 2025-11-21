import { email, tel } from '../../../../data/Infos'

function Bandeau() {
    return (
        // Accueil - Contactez-nous
        <section>
            <h2 className="mt-3 text-center font-title underline decoration-4 decoration-red-yummy">Contactez-nous</h2>
            <address className="not-italic text-center ml-4 mr-4 mt-3 mb-3 md:mr-28 md:ml-8">
                Vous souhaitez nous poser une question, nous faire un feedback, ou tout simplement nous contacter ?
                Écrivez-nous à&nbsp;
                <a className="font-bold" href={`mailto:${email}?&subject=Contact%20Yummy%20Nouilles`}>{email}</a>&nbsp;
                ou appelez nous au &nbsp;
                <a className="font-bold" href="tel:+33113862342">{tel}</a>
            </address>
        </section>
    )
}

export default Bandeau