import React, { useState, useEffect } from 'react';
import { FormContainer, ProductContainer, ProductsContainer, ProductsContainerStyled, ProductsWrapper } from './ProductsStyles';
import Categories from '../../components/Categories/Cateogories';
import Footer from '../../components/Footer/Footer';
import Section from '../../components/Section/Section';
import CardProduct from '../../components/CardProduct/CardProduct';
import BotonWhp from '../../components/BotonWhp/BotonWhp';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import axios from 'axios';
import { fetchConfig } from "../../components/variablesenv";

const Products = ({ onAddToCart }) => {
  const [categoryId, setCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [config, setConfig] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getConfig = async () => {
      const configData = await fetchConfig();
      setConfig(configData);
    };

    getConfig();
    
  }, []);

  useEffect(() => {
    if (config) {
      document.title = 'PRODUCTOS - ' + config.storeName;
    }
  }, [config]);

  useEffect(() => {
    axios.get(`${apiUrl}/store/productosMAIN`)
      .then(response => {
        setProducts(response.data);
        setSearched(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  useEffect(() => {
    if (categoryId !== null) {
      axios.get(`${apiUrl}/store/articulos/${categoryId}`)
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, [categoryId]);

  const handleSearch = (event) => {
    event.preventDefault(); // Evita que el botón recargue la página
    axios.get(`${apiUrl}/store/buscar?q=${searchTerm}`)
      .then(response => {
        setProducts(response.data);
        setSearched(true);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };
  


  const handleReset = () => {
    setSearchTerm('');
    axios.get(`${apiUrl}/store/productosMAIN`)
      .then(response => {
        setProducts(response.data);
        setSearched(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const currentProducts = products.slice(first, first + rows);

  return (
    <ProductsContainerStyled>
      <Categories onSelectCategory={(id) => setCategoryId(id)} />
      <ProductsWrapper>
        <ProductsContainer>
          <Section>
            <h2>Productos</h2>
            <FormContainer>
              <input
                type="text"
                placeholder='Busque su producto aquí'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="button" onClick={handleSearch} disabled={!searchTerm}>Buscar</button>
              <Button icon="pi pi-times" severity="danger" aria-label="Cancel" style={{ color: 'black', backgroundColor: 'red' }} onClick={handleReset}/>
            </FormContainer>
          </Section>
          <ProductContainer>
            {searched && products.length === 0 ? (
              <h1 style={{ color: 'black', textAlign: 'center' }}>No se han encontrado productos. Intente ingresar un nombre o referencia diferente.</h1>
            ) : (
              products.map(product => (
                <CardProduct
                  key={product.CODIGO_BARRA}
                  name={product.art_desc_vta}
                  price={product.PRECIO_SIN_IVA_4}
                  imageUrl={product.CODIGO_BARRA} // Usa la URL de la imagen si está disponible
                  
                  onAddToCart={onAddToCart}
                />
              ))
            )}
          </ProductContainer>
          
        </ProductsContainer>
        <BotonWhp />
      </ProductsWrapper>
    </ProductsContainerStyled>
  );
}

export default Products;
