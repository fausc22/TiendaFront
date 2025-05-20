import styled from "styled-components";

export const HeroContainerStyled = styled.section`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 40px;
`;

export const HeroWrapper = styled.div`
    width: 70%;
    max-width: 1200px;  /* Máximo tamaño en pantallas grandes */
    margin: auto;

    @media (max-width: 1024px) {
        width: 90%; /* Hace que en tablets ocupe más espacio */
    }

    @media (max-width: 768px) {
        width: 100%; /* En celulares, ocupa todo el ancho */
    }
`;

export const CustomImage = styled.img`
    width: 100%; /* La imagen ocupa todo el ancho del contenedor */
    height: auto; /* Altura automática para evitar cortes */
    max-height: 300px; /* Máxima altura para evitar imágenes gigantes */
    object-fit: contain; /* Asegura que las imágenes se muestren completas sin cortes */

    @media (max-width: 768px) {
        max-height: 200px; /* Reduce el tamaño en móviles */
    }
`;
