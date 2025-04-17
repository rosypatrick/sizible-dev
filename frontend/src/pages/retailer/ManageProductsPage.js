/**
 * Manage Products Page
 * 
 * This page allows retailers to view and manage their product catalog.
 * It displays a list of imported garments with filtering and search capabilities.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SizibleNavigation from '../../components/common/SizibleNavigation';
import SizibleButton from '../../components/common/SizibleButton';
import SizibleCard from '../../components/common/SizibleCard';
import axios from 'axios';

// Styled components
const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.large};
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.large};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.medium};
  }
`;

const SearchFilterBar = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.medium};
  margin-bottom: ${props => props.theme.spacing.large};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  padding: ${props => props.theme.spacing.small};
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.small};
  flex: 1;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing.small};
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.small};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${props => props.theme.spacing.large};
  
  th, td {
    padding: ${props => props.theme.spacing.small};
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f9f9f9;
    font-weight: ${props => props.theme.typography.fontWeight.medium};
  }
  
  tr:hover {
    background-color: #f5f5f5;
  }
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

const ActionButton = styled(SizibleButton)`
  padding: ${props => props.theme.spacing.xsmall} ${props => props.theme.spacing.small};
  font-size: ${props => props.theme.typography.fontSize.small};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xlarge};
  background-color: #f9f9f9;
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.small};
  margin-top: ${props => props.theme.spacing.large};
`;

const PageButton = styled.button`
  padding: ${props => props.theme.spacing.xsmall} ${props => props.theme.spacing.small};
  border: 1px solid #ddd;
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : 'inherit'};
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : '#f0f0f0'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * ManageProductsPage Component
 * 
 * @returns {JSX.Element} The manage products page component
 */
const ManageProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const itemsPerPage = 10;
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/garments`);
        
        // Transform the data to match the expected format
        const formattedProducts = response.data.map((item, index) => ({
          id: index + 1,
          sku: item.FE_Item_Code || '',
          name: item.Title || '',
          brand: item.Brand || '',
          type: item.Garment_Type || '',
          size: item.Garment_Size || '',
          color: item["Color Family"] || '',
          stock: item.Stock || '0',
          // Keep the original data for reference
          originalData: item
        }));
        
        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = 
      brandFilter === '' || 
      product.brand.toLowerCase() === brandFilter.toLowerCase();
    
    const matchesType = 
      typeFilter === '' || 
      product.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesBrand && matchesType;
  });
  
  // Get unique brands and types for filters
  const brands = [...new Set(products.map(product => product.brand))].filter(Boolean);
  const types = [...new Set(products.map(product => product.type))].filter(Boolean);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle brand filter change
  const handleBrandFilterChange = (e) => {
    setBrandFilter(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle type filter change
  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <>
      <SizibleNavigation isRetailer={true} />
      <PageContainer>
        <PageHeader>
          <h1>Manage Products</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <SizibleButton as="a" href="/retailer/import">
              Import Products
            </SizibleButton>
            <SizibleButton variant="secondary">
              Connect E-Commerce
            </SizibleButton>
          </div>
        </PageHeader>
        
        <SizibleCard elevated>
          <SearchFilterBar>
            <SearchInput 
              type="text" 
              placeholder="Search by name or SKU..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            
            <FilterSelect 
              value={brandFilter}
              onChange={handleBrandFilterChange}
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </FilterSelect>
            
            <FilterSelect 
              value={typeFilter}
              onChange={handleTypeFilterChange}
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </FilterSelect>
          </SearchFilterBar>
          
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : paginatedProducts.length > 0 ? (
            <>
              <ProductTable>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map(product => (
                    <tr key={product.id}>
                      <td>{product.sku}</td>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.type}</td>
                      <td>{product.size}</td>
                      <td>{product.color}</td>
                      <td>{product.stock}</td>
                      <td>
                        <ActionButton variant="secondary" size="small">
                          Edit
                        </ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ProductTable>
              
              {totalPages > 1 && (
                <Pagination>
                  <PageButton 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &laquo;
                  </PageButton>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <PageButton 
                      key={index + 1}
                      active={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </PageButton>
                  ))}
                  
                  <PageButton 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &raquo;
                  </PageButton>
                </Pagination>
              )}
            </>
          ) : (
            <EmptyState>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters, or import new products.</p>
              <SizibleButton as="a" href="/retailer/import" style={{ marginTop: '20px' }}>
                Import Products
              </SizibleButton>
            </EmptyState>
          )}
        </SizibleCard>
      </PageContainer>
    </>
  );
};

export default ManageProductsPage;
