import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const CheckoutContainerStyles = styled.div`
  width: 100%;
`;

export const CheckoutWrapper = styled.div`
  padding-top: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CheckoutData = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  justify-content: center;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const EnviromentTable = styled.div`
  width: 100%;
  overflow-x: auto; /* Habilita el desplazamiento horizontal */
  -webkit-overflow-scrolling: touch; /* Mejora la experiencia en dispositivos táctiles */
  min-width: 100%;

  @media screen and (max-width: 768px) {
    padding: 0 10px; /* Añade un poco de espacio alrededor de la tabla */
  }
`;


export const CheckoutTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  table-layout: fixed; /* Fuerza que las columnas ocupen un ancho fijo */
  font-size: 14px; /* Reduce el tamaño de fuente para más espacio */

  th, td {
    word-wrap: break-word; /* Ajusta texto largo */
    text-align: center; /* Centra el contenido */
    
  }
`;






export const TableHeader = styled.th`
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  color: var(--gray-300);
  font-weight: 700;
  background-color: #f2f2f2;
  white-space: nowrap;
  font-size: 25px;

  /* Anchos específicos para cada columna en PC */
  &:nth-child(1) {
    width: 35%; /* Producto */
  }
  &:nth-child(2) {
    width: 25%; /* Precio */
  }
  &:nth-child(3) {
    width: 25%; /* Cantidad */
  }
  &:nth-child(4) {
    width: 35%; /* Subtotal */
  }
  &:nth-child(5) {
    width: 5%; /* Eliminar */
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
    text-align: center;
    border-right: 1px solid #ddd; /* Línea vertical divisoria */
    /* Anchos específicos para cada columna en responsive */
    &:nth-child(1) {
      width: 30%;
    }
    &:nth-child(2) {
      width: 30%;
    }
    &:nth-child(3) {
      width: 35%;
    }
    &:nth-child(4) {
      width: 35%;
    }
    &:nth-child(5) {
      width: 5%;
    }
  }
`;


export const TableRow = styled.tr`
  color: var(--gray-200);
  background-color: transparent;
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

export const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 20px;
  text-align: center;
  word-wrap: break-word;

  /* Anchos específicos para cada columna */
  &:nth-child(1) {
    width: 35%; /* Producto */
  }
  &:nth-child(2) {
    width: 25%; /* Precio */
  }
  &:nth-child(3) {
    width: 25%; /* Cantidad */
  }
  &:nth-child(4) {
    width: 35%; /* Subtotal */
  }
  &:nth-child(5) {
    width: 5%; /* Eliminar */
  }

  @media screen and (max-width: 768px) {
    padding: 4px;
    font-size: 15px;

    border-right: 1px solid #ddd; /* Línea vertical divisoria */
    /* Anchos específicos para cada columna en responsive */
    &:nth-child(1) {
      width: 30%;
    }
    &:nth-child(2) {
      width: 30%;
    }
    &:nth-child(3) {
      width: 35%;
    }
    &:nth-child(4) {
      width: 35%;
      
    }
    &:nth-child(5) {
      width: 5%;
      border-right: none; /* Elimina la línea de la última columna */   
    }
  }
`;




export const QuantityInput = styled.input`
  width: 50px;
  padding: 5px;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    -webkit-appearance: textfield;
    appearance: textfield;
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }
  }
`;

export const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  color: red;
  cursor: pointer;
  text-align: center;
  font-size: 20px;
`;

export const ContainerOutsideTable = styled.div`
  padding-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: end;
`;

export const TotalCell = styled.div`
  text-align: right;
  color: var(--gray-300);
  font-weight: bold;
`;

export const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  gap: 10px;
`;

export const ButtonPay = styled(NavLink)`
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #fff;
  background-color: #007bff;
  border: 1px solid #007bff;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
  text-decoration: none;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? '0.6' : '1')};

  &:hover {
    color: #fff;
    background-color: ${props => (props.disabled ? '#007bff' : '#0056b3')};
    border-color: ${props => (props.disabled ? '#007bff' : '#0056b3')};
  }
`;

export const ButtonSearch = styled(NavLink)`
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--blue);
  background-color: transparent;
  border: 1px solid #007bff;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;

  &:hover {
    color: #fff;
    background-color: #0056b3;
    border-color: #0056b3;
    text-decoration: none;
  }
`;

export const CheckProductsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  gap: 50px;

  @media screen and (max-width: 768px){
        gap: 10px;
    }
`;

export const ViewMoreButton = styled(NavLink)`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin: 20px 0;

  &:hover {
    background-color: #0056b3;
  }
`;
