import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CardProductContainer, HomeContainerStyled, HomeWrapper, ViewMoreButton } from './HomeStyles';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import Hero from '../../components/Hero/Hero';
import Section from '../../components/Section/Section';
import CardProduct from '../../components/CardProduct/CardProduct';
import BotonWhp from '../../components/BotonWhp/BotonWhp';
import { fetchConfig } from "../../components/variablesenv";

const Home = ({ onAddToCart }) => {
  const [ofertas, setOfertas] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [config, setConfig] = useState(null);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const getConfig = async () => {
      const configData = await fetchConfig();
      setConfig(configData);
    };

    getConfig();
  }, []);

  useEffect(() => {
    if (config) {
      document.title = 'INICIO - ' + config.storeName;
    }
  }, [config]);

  // Usamos la variable de entorno para la URL base de la API
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/store/articulosOF`)
      .then(response => {
        setOfertas(response.data);
      })
      .catch(error => {
        console.error('Error fetching data (articulosOF):', error);
      });

    axios.get(`${apiUrl}/store/articulosDEST`)
      .then(response => {
        setDestacados(response.data);
      })
      .catch(error => {
        console.error('Error fetching data (articulosDEST):', error);
      });
  }, [apiUrl]);

  return (
    <HomeContainerStyled>
      <HomeWrapper>
        <Hero />
        <Section>
          <h2>Ofertas</h2>
          <CardProductContainer>
            {ofertas.map((articulo, index) => (
              <CardProduct
                key={index}
                name={articulo.art_desc_vta}
                price={articulo.PRECIO_SIN_IVA_4}
                imageUrl={articulo.CODIGO_BARRA} // Reemplaza con la URL de tu imagen
                off
                // onAddToCart={onAddToCart}
                onAddToCart={(item) => onAddToCart(item.quantity)}
              />
            ))}
          </CardProductContainer>
          <ViewMoreButton to='/productos' onClick={scrollToTop}>Ver todos los productos</ViewMoreButton>
        </Section>
        <HeroSlider />
        <Section>
          <h2>Productos destacados</h2>
          <CardProductContainer>
            {destacados.map((articulo, index) => (
              <CardProduct
                key={index}
                name={articulo.art_desc_vta}
                price={articulo.PRECIO_SIN_IVA_4}
                imageUrl={articulo.CODIGO_BARRA} // Reemplaza con la URL de tu imagen
                onAddToCart={onAddToCart}
              />
            ))}
          </CardProductContainer>
          <ViewMoreButton to='/productos' onClick={scrollToTop}>Ver más</ViewMoreButton>
        </Section>
        <BotonWhp />
      </HomeWrapper>
    </HomeContainerStyled>
  );
};

export default Home;
