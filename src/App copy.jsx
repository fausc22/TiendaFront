// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes/Routes';
import 'primereact/resources/themes/saga-blue/theme.css';  // O el tema que estés utilizando
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {agregarAlCarrito, contarProductosEnCarrito} from './components/carrito';



const App = () => {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (quantity) => {
    setCartCount(cartCount + quantity);
  };

  return (
    <Router>
      
      <Routes handleAddToCart={handleAddToCart} />
    </Router>
  );
};

export default App;
