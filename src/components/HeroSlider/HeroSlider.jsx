import React, { useState, useEffect } from "react";
import { HeroContainerStyled, HeroWrapper, CustomImage } from "./HeroSliderStyles";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import axios from "axios";

const HeroSlider = () => {
    const [imagenes, setImagenes] = useState([]);

    useEffect(() => {
        const fetchImagenesPublicidad = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/store/getImagenesPublicidad`);
                setImagenes(response.data.map(url => ({ original: `${import.meta.env.VITE_API_URL}${url}` })));
            } catch (error) {
                console.error("Error al obtener imágenes de publicidad:", error);
            }
        };
        fetchImagenesPublicidad();
    }, []);

    return (
        <HeroContainerStyled>
            <HeroWrapper>
                <ImageGallery
                    items={imagenes}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    showBullets={true}
                    autoPlay={true}
                    renderItem={(item) => <CustomImage src={item.original} />}
                />
            </HeroWrapper>
        </HeroContainerStyled>
    );
};

export default HeroSlider;
