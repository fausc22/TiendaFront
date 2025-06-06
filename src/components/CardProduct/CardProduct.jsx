import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ImgCustom, PriceOfferContainer, ProductContainerStyled, ProductFoot, ProductImgContainer, ProductInfoContainer, ProductQuantity, ProductTotalContainer, SuccessMessage } from './CardProductStlyes';
import { IoMdAdd } from "react-icons/io";
import { AiOutlineMinus } from "react-icons/ai";
import shopping from '../../assets/img/products-img/shopping.png'; // Imagen predeterminada

const CardProduct = ({ name, price, imageUrl, off, onAddToCart, reloadOnAdd }) => {
    const [quantity, setQuantity] = useState(0);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [finalImageUrl, setFinalImageUrl] = useState(shopping);


    useEffect(() => {
        const img = new Image();
        const localImageUrl = `../../assets/img/products-img/${imageUrl}.png`;
        
        // Primero intentamos cargar la imagen local
        img.src = localImageUrl;
        img.onload = () => setFinalImageUrl(localImageUrl);
        img.onerror = () => {
            // Si no se encuentra la imagen local, intentamos con la URL del servidor
            const serverImageUrl = `https://www.rsoftware.com.ar/imgart/${imageUrl}.png`;
            img.src = serverImageUrl;
            img.onload = () => setFinalImageUrl(serverImageUrl);
            img.onerror = () => setFinalImageUrl(shopping); // Si tampoco se encuentra en el servidor, usamos la imagen predeterminada
        };
    }, [imageUrl]);

    const handleIncrease = () => {
        setQuantity(prevQuantity => prevQuantity + 1);  
    };

    const handleDecrease = () => {
        setQuantity(prevQuantity => (prevQuantity > 0 ? prevQuantity - 1 : 0));
    };

    const handleAddToCart = (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
        if (quantity === 0) return; // Evita agregar si no hay cantidad seleccionada

        const total = Number(price) * quantity;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.name === name);

        if (itemIndex >= 0) {
            cart[itemIndex].quantity += quantity;
            cart[itemIndex].total = cart[itemIndex].quantity * Number(price);
        } else {
            cart.push({ name, quantity, total, price: Number(price), CODIGO_BARRA: imageUrl });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        // Notificar al componente padre sobre el producto agregado
        if (onAddToCart) {
            onAddToCart({ name, quantity, price: Number(price), total });
        }

        

        // Mostrar mensaje de éxito y restablecer la cantidad
        setShowSuccessMessage(true);
        setQuantity(0);
        setTimeout(() => {
            setShowSuccessMessage(false);
            

            
        
        }, 2000); // Mostrar el mensaje durante 2 segundos

        if (reloadOnAdd) {
            setTimeout(() => {
                window.location.reload();
            }, 2000); // Recarga la página después de 2 segundos
        }
                
    };

    const total = price * quantity;

    

    return (
        <ProductContainerStyled>
            {showSuccessMessage && <SuccessMessage>Producto agregado con éxito</SuccessMessage>}
            <ProductImgContainer>
                <ImgCustom src={finalImageUrl} alt={name} onError={(e) => { e.target.onerror = null; e.target.src = shopping; }} />
            </ProductImgContainer>
            <ProductInfoContainer>
                <h3>{name}</h3>
                <PriceOfferContainer>
                    {off && <p style={{ textDecoration: "line-through", color: "red" }}>${off}</p>}
                    <span>${price}</span>
                </PriceOfferContainer>

                <ProductFoot>
                    <ProductQuantity>
                        <AiOutlineMinus onClick={handleDecrease} />
                        <span>{quantity}</span>
                        <IoMdAdd onClick={handleIncrease} />
                    </ProductQuantity>
                    {quantity > 0 && (
                        <ProductTotalContainer>
                            Total: ${total.toFixed(2)}
                        </ProductTotalContainer>
                    )}
                    <a href="#" onClick={handleAddToCart}>Agregar</a>
                </ProductFoot>
            </ProductInfoContainer>
        </ProductContainerStyled>
    );
};

export default CardProduct;
