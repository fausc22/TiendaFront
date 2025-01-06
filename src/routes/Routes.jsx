// routes.jsx
import React from 'react';
import { Routes as ReactDomRoutes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Layout from '../components/Layout/Layout';
import Products from '../pages/Products/Products';
import Checkout from '../pages/Checkout/Checkout';
import Pago from '../pages/Pago/Pago';
import LayoutPublic from '../components/Layout/LayoutPublic';
import Confirmation from '../pages/Confirmation/Confirmation';



const Routes = ({ handleAddToCart }) => {
  return (
    <ReactDomRoutes>
      <Route path='/' element={<Layout> <Home onAddToCart={handleAddToCart}/> </Layout>} />
      <Route path='/productos' element={<Layout> <Products onAddToCart={handleAddToCart}/> </Layout>} />
      <Route path='/checkout' element={<Layout> <Checkout onAddToCart={handleAddToCart}/> </Layout>} />
      <Route path='/pago' element={<Layout> <Pago/> </Layout>} />
      <Route path="/confirmacion" element={<LayoutPublic> <Confirmation/> </LayoutPublic>}/>
    </ReactDomRoutes>
  );
}

export default Routes;
