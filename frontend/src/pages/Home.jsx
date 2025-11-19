// frontend/src/pages/Home.jsx
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Container>
      <Hero>
        <Title>Welcome to MyApp</Title>
        <Subtitle>
          {isAuthenticated 
            ? `Hello ${user?.name}! Manage your items and categories.`
            : 'Please login to start managing your items and categories.'}
        </Subtitle>
      </Hero>
      
      <Grid>
        <Card 
          title="Categories" 
          description="Organize your items into categories for better management."
        />
        <Card 
          title="Items" 
          description="Create and manage your items with ease."
        />
        <Card 
          title="Secure" 
          description="Your data is protected with JWT authentication."
        />
      </Grid>
    </Container>
  );
};

export default Home;