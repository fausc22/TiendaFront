import React, { useState, useEffect } from 'react';
import { Categorie, CategoriesContainer, CategoriesContainerStyled, CategoriesTitle, CategoriesWrapper } from './Categories';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import CategoriesOpener from './CategoriesOpener';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Categories = ({ onSelectCategory }) => {
  const [openCategories, setOpenCategories] = useState(false);  // Menú inicialmente cerrado
  const [categories, setCategories] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  // Función para abrir/cerrar el menú manualmente
  const handleToggleCategories = () => {
    setOpenCategories(prev => !prev);  // Cambia el estado del menú
    console.log(`Categories menu toggled. Now openCategories: ${!openCategories}`);
  };

  useEffect(() => {
    // Llamada a la API para obtener las categorías
    axios.get(`${apiUrl}/store/categorias`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleSelectCategory = (name) => {
    onSelectCategory(name); // Enviar el nombre en vez del ID
    setOpenCategories(false);
    console.log(`Selected category: ${name}. Closing categories menu.`);
};


  return (
    <>
      <AnimatePresence>
        {/* Renderiza el menú de categorías si está abierto */}
        {openCategories && (
          <CategoriesContainerStyled
            initial={{ translateX: -1000 }}
            animate={{ translateX: 0 }}
            exit={{ translateX: -1000, opacity: 0 }}
            transition={{ type: "spring", damping: 27 }}
            key="menu-categories"
          >
            <CategoriesWrapper>
              <CategoriesTitle>
                {/* Botón para cerrar el menú */}
                <FaArrowLeft onClick={handleToggleCategories} />
                <h3>Categorias</h3>
              </CategoriesTitle>
              <CategoriesContainer>
                {categories.map(category => (
                  <Categorie key={category.NOM_CLASIF} onClick={() => handleSelectCategory(category.NOM_CLASIF)}>
                  <a href={`#${category.NOM_CLASIF}`}>{category.NOM_CLASIF}</a>
                  <FaArrowRight />
                </Categorie>
                ))}
              </CategoriesContainer>
            </CategoriesWrapper>
          </CategoriesContainerStyled>
        )}
        {/* Renderiza el botón de apertura si el menú está cerrado */}
        {!openCategories && (
          <CategoriesOpener onClick={handleToggleCategories} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Categories;
