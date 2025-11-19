// frontend/src/components/Navbar.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Nav = styled.nav`
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  
  &:hover {
    color: #3b82f6;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  color: #374151;
  font-weight: 500;
`;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">MyApp</Logo>
        
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/items">Items</NavLink>
          
          {isAuthenticated ? (
            <UserInfo>
              <UserName>Hello, {user?.name}</UserName>
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </UserInfo>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">
                <Button variant="primary">Register</Button>
              </NavLink>
            </>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;