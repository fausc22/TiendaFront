import React, { useState, useEffect } from 'react';
import { ContactoContainer, FooterBottom, FooterContainerStyled, FooterWrapper, ItemContacto, NavFootContainer } from './FooterStyles'
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { fetchConfig } from "../variablesenv";
import { FaAddressCard, FaLocationArrow, FaLocationDot, FaLocationPin, FaLocationPinLock, FaRegAddressBook } from 'react-icons/fa6';

const Footer = () => {

    const [config, setConfig] = useState(null);

  useEffect(() => {
    const getConfig = async () => {
      const configData = await fetchConfig();
      setConfig(configData);
    };

    getConfig();
  }, []);

  const googleMapsUrl = config
  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.storeAddress)}`
  : '#';

  const scrollToContact = () => {
    const contactoSection = document.getElementById('contacto');
    if (contactoSection) {
      contactoSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (menuOpen) {
      handleSetMenuOpen();
    }
  };



  return (
    <FooterContainerStyled id='contacto'>
        <FooterWrapper>
            <h2>{config ? `${config.storeName}` : 'TIENDA'}</h2>
            <NavFootContainer>
                <a href="/">Inicio</a>
                <a href="/productos">Productos</a>
                <a href="">Contacto</a>
            </NavFootContainer>
            <ContactoContainer>
                <h2>Contacto</h2>
                <ItemContacto>
                    <FaInstagram />
                    <a>{config ? `${config.storeInstagram}` : '-'}</a>
                </ItemContacto>
                <ItemContacto>
                    <IoMailOutline/>
                    <a>{config ? `${config.storeEmail}` : '-'}</a>
                </ItemContacto>
                <ItemContacto>
                    <FaWhatsapp />
                    <a>{config ? `${config.storePhone}` : '-'}</a>
                </ItemContacto>
                <ItemContacto>
                    <FaLocationDot />
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        {config ? `${config.storeAddress}` : '-'}
                    </a>
                </ItemContacto>
            </ContactoContainer>
        </FooterWrapper>
        <FooterBottom>
            <p>{config ? `${config.storeName}` : 'TIENDA'}. Todos los derechos reservados. 2024</p>
        </FooterBottom>
    </FooterContainerStyled>
  )
}

export default Footer