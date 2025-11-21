// frontend/src/pages/Categories.js
import { useState } from 'react';
import styled from 'styled-components';
import { useCategories } from '../../hooks/useCategories';
import { categoriesAPI } from '../../services/api';
import useCacheStore from '../../store/cacheStore';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loading from '../../components/Loading';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CategoryCard = styled(Card)`
  position: relative;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  max-width: 500px;
  width: 90%;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const AdminCategories = () => {
  const { isAuthenticated } = useAuth();
  const { categories, loading, error } = useCategories();
  const { addCategory, updateCategory, removeCategory } = useCacheStore();
  
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setShowModal(true);
    setFormError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setFormError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name) {
      setFormError('Name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const { category } = await categoriesAPI.update(editingCategory.id, formData);
        updateCategory(editingCategory.id, category);
      } else {
        const { category } = await categoriesAPI.create(formData);
        addCategory(category);
      }
      handleCloseModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will also delete all items in this category.')) {
      return;
    }

    try {
      await categoriesAPI.delete(id);
      removeCategory(id);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;

  return (
    <Container>
      <Header>
        <Title>Categories</Title>
        {isAuthenticated && (
          <Button variant="primary" onClick={() => handleOpenModal()}>
            Add Category
          </Button>
        )}
      </Header>

      {categories.length === 0 ? (
        <Card>
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No categories yet. {isAuthenticated && 'Create your first category!'}
          </p>
        </Card>
      ) : (
        <Grid>
          {categories.map((category) => (
            <CategoryCard key={category.id}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {category.name}
              </h3>
              <p style={{ color: '#6b7280' }}>
                {category.description || 'No description'}
              </p>
              
              {isAuthenticated && (
                <CardActions>
                  <Button onClick={() => handleOpenModal(category)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(category.id)}>
                    Delete
                  </Button>
                </CardActions>
              )}
            </CategoryCard>
          ))}
        </Grid>
      )}

      {showModal && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </ModalTitle>
            
            {formError && <ErrorMessage>{formError}</ErrorMessage>}
            
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="name"
                label="Name"
                placeholder="Category name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <Input
                type="text"
                name="description"
                label="Description"
                placeholder="Category description (optional)"
                value={formData.description}
                onChange={handleChange}
              />
              
              <ButtonGroup>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  type="button" 
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AdminCategories;