// frontend/src/pages/Items.js
import { useState } from 'react';
import styled from 'styled-components';
import { useItems } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';
import { itemsAPI } from '../services/api';
import useCacheStore from '../store/cacheStore';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';

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
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ItemCard = styled(Card)`
  position: relative;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.5rem;
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

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
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

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Items = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const { items, loading: itemsLoading } = useItems(selectedCategoryFilter || null);
  const { categories, loading: categoriesLoading } = useCategories();
  const { addItem, updateItem, removeItem } = useCacheStore();
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', categoryId: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        categoryId: item.categoryId
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', categoryId: '' });
    }
    setShowModal(true);
    setFormError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', categoryId: '' });
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
    
    if (!formData.name || !formData.categoryId) {
      setFormError('Name and category are required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        const { item } = await itemsAPI.update(editingItem.id, formData);
        updateItem(editingItem.id, item);
      } else {
        const { item } = await itemsAPI.create(formData);
        addItem(item);
      }
      handleCloseModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await itemsAPI.delete(id);
      removeItem(id);
    } catch (err) {
      alert(err.message);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  if (itemsLoading || categoriesLoading) return <Loading />;

  return (
    <Container>
      <Header>
        <Title>Items</Title>
        
        <FilterContainer>
          <FormGroup style={{ margin: 0 }}>
            <Label>Filter by category:</Label>
            <Select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          {isAuthenticated && (
            <Button 
              variant="primary" 
              onClick={() => handleOpenModal()}
              style={{ marginTop: '1.5rem' }}
            >
              Add Item
            </Button>
          )}
        </FilterContainer>
      </Header>

      {items.length === 0 ? (
        <Card>
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No items found. {isAuthenticated && 'Create your first item!'}
          </p>
        </Card>
      ) : (
        <Grid>
          {items.map((item) => (
            <ItemCard key={item.id}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {item.name}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                {item.description || 'No description'}
              </p>
              <CategoryBadge>{getCategoryName(item.categoryId)}</CategoryBadge>
              
              {isAuthenticated && (
                <CardActions>
                  <Button onClick={() => handleOpenModal(item)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </CardActions>
              )}
            </ItemCard>
          ))}
        </Grid>
      )}

      {showModal && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              {editingItem ? 'Edit Item' : 'Add Item'}
            </ModalTitle>
            
            {formError && <ErrorMessage>{formError}</ErrorMessage>}
            
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="name"
                label="Name"
                placeholder="Item name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <Input
                type="text"
                name="description"
                label="Description"
                placeholder="Item description (optional)"
                value={formData.description}
                onChange={handleChange}
              />
              
              <FormGroup>
                <Label>Category *</Label>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
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

export default Items;