import styled from 'styled-components';
import Error404Picture from '../../assets/images/404.svg';

const ErrorWrapper = styled.div`
    margin: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;


const Illustration = styled.img`
    max-width: 800px;
`;

function Error() {
    return (
        <ErrorWrapper>
            <h1 className='text-red-800 font-extrabold'>Oups...</h1>
            <Illustration src={Error404Picture} />
            <h2 className='text-red-800 font-extrabold'>Il semblerait que la page que vous cherchez n’existe pas</h2>
        </ErrorWrapper>
    );
}

export default Error;
