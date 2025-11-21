// frontend/src/pages/Register.js
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

const Register = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
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
          Register
        </h2>
        
        {(formError || error) && (
          <ErrorMessage>{formError || error}</ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            label="Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
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
          
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
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
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
          </ButtonGroup>
        </Form>
        
        <LinkText>
          Already have an account? <StyledLink to="/login">Login</StyledLink>
        </LinkText>
      </Card>
    </Container>
  );
};

export default Register;