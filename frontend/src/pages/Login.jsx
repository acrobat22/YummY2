// frontend/src/pages/Login.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const Container = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 0 1rem;
`;

const Form = styled.form`
  margin-top: 1.5rem;
`;

const ButtonGroup = styled.div`
  margin-top: 1.5rem;
`;

const LinkText = styled.p`
  margin-top: 1rem;
  text-align: center;
  color: #6b7280;
`;

const StyledLink = styled(Link)`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData);
      navigate('/admin/');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>
          Login
        </h2>
        
        {(formError || error) && (
          <ErrorMessage>{formError || error}</ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <ButtonGroup>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isLoading}
              style={{ width: '100%' }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </ButtonGroup>
        </Form>
        
        <LinkText>
          Don't have an account? <StyledLink to="/register">Register</StyledLink>
        </LinkText>
      </Card>
    </Container>
  );
};

export default Login;