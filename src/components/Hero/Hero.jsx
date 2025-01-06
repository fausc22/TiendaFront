import React, { useState, useEffect } from 'react';
import { ButtonProducts, HeroContainerStyled, HeroInfoContainer, HeroWrapper, StyledBackground } from './HeroStyles'
import HeroBackground from "../../assets/img/hero-img/4da3f42d4a05b5608f8ad65fda9158f0.jpg"
import { fetchConfig } from "../variablesenv";

const Hero = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const getConfig = async () => {
      const configData = await fetchConfig();
      setConfig(configData);
    };

    getConfig();
  }, []);

  return (
    <HeroContainerStyled id='hero'>
        <HeroWrapper>
            <StyledBackground src={HeroBackground} alt="" />
            <HeroInfoContainer>
                <h1>{config ? `${config.storeName}` : 'TIENDA'}</h1>
                <p>{config ? `${config.storeDescription}` : 'TIENDA'}</p>
                <ButtonProducts to='/productos'>Ver Productos</ButtonProducts>
            </HeroInfoContainer>
        </HeroWrapper>
    </HeroContainerStyled>
  )
}

export default Hero