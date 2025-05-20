import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  AjustesContainerStyled, 
  AjustesWrapper, 
  FormGroup, 
  Input, 
  Select, 
  StyledButton, 
  Title, 
  Subtitle, 
  BackButton, 
  TitleContainer, 
  ButtonsContainer,
  ContactoContainer,
  ItemContacto 
} from './ConfirmationStyles';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchConfig } from "../../components/variablesenv";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { FaAddressCard, FaLocationArrow, FaLocationDot, FaLocationPin, FaLocationPinLock, FaRegAddressBook } from 'react-icons/fa6';
import { Button } from 'primereact/button';


const Confirmation = () => {
    const [config, setConfig] = useState(null);
    const [pedido, setPedido] = useState(null);
    let storeName = '';

    const apiUrl = import.meta.env.VITE_API_URL;


    useEffect(() => {
        const getConfig = async () => {
          const configData = await fetchConfig();
          setConfig(configData);
        };
    
        getConfig();
        
      }, []);

      useEffect(() => {
        if (config) {
          document.title = 'PEDIDO CONFIRMADO - ' + config.storeName;
          storeName = config.storeName;

        }
      }, [config]);
      
        const products = {};



        const enviarEmail = async (pedido) => {

          const productosParaEmail = pedido.productos.map(producto => ({
            name: producto.nombre_producto,
            quantity: producto.cantidad,
            price: producto.precio
          }));

          try {
              await axios.post(`${apiUrl}/store/mailPedidoRealizado`, {
                  storeName: config.storeName,
                  name: pedido.cliente,
                  clientMail: pedido.email_cliente,
                  items: productosParaEmail,
                  subtotal: pedido.subtotal,
                  shippingCost: pedido.costoEnvio,
                  total: pedido.monto_total,
                  storeMail: config.storeEmail,
                  storePhone: config.storePhone
              });
              console.log('Correo enviado exitosamente');
          } catch (error) {
              console.error('Error al enviar el correo:', error);
          }
      };
    
      const insertarPedidoBaseDatos = async (pedido) => {
          try {
              await axios.post(`${apiUrl}/store/NuevoPedido`, {
                  cliente: pedido.cliente,
                  direccion_cliente: pedido.direccion_cliente,
                  telefono_cliente: pedido.telefono_cliente,
                  email_cliente: pedido.email_cliente,
                  cantidad_productos: pedido.productos.length,
                  monto_total: pedido.monto_total,
                  costo_envio: pedido.costoEnvio,
                  medio_pago: pedido.medio_pago,
                  estado: 'Pendiente',
                  notas_local: pedido.notas_local,
                  productos: pedido.productos
              });
              console.log('Pedido y productos insertados correctamente en la base de datos');
              localStorage.removeItem('cart');
              console.log('Carrito eliminado del localStorage');
          } catch (error) {
              console.error('Error al insertar el pedido en la base de datos:', error);
          }
      };



      useEffect(() => {
        const pedidoStored = JSON.parse(localStorage.getItem('pedido'));
        setPedido(pedidoStored);
        // Verificar si los datos del pedido están disponibles antes de llamar a las funciones
        if (pedidoStored && config && storeName) {
          
          // Enviar email
          enviarEmail(pedidoStored);

          // Insertar pedido en la base de datos
          insertarPedidoBaseDatos(pedidoStored)
            .then(() => {
                // Eliminar el localStorage una vez que se confirma la inserción
                localStorage.removeItem('pedido');
                console.log('Pedido eliminado del localStorage');
            })
            .catch(error => {
                console.error('Error al insertar el pedido:', error);
            });
      }
    }, [config, storeName]);

    

    

      if (!pedido) {
        return <div>Loading...</div>; 
    }

    const subtotal = pedido.productos.reduce((acc, item) => acc + parseFloat(item.precio) * item.cantidad, 0).toFixed(2);
    const costoEnvio = parseFloat(pedido.costoEnvio); 
    const totalFinal = (parseFloat(subtotal) + costoEnvio).toFixed(2);

    return (
        <AjustesContainerStyled>
          <AjustesWrapper>
            <h3 style={{ color: 'blue', textAlign: 'center',  marginBottom: 40, fontSize: '23px' }}>{config ? `${config.storeName}` : 'TIENDA'}</h3>
            <Title style={{ color: 'darkblue', textDecoration: 'underline', fontSize: '32px' }}>PEDIDO REALIZADO CON ÉXITO!</Title>
            <Subtitle style={{ color: 'darkgreen', fontStyle: 'nunito', marginTop: 40 }}>{pedido.cliente ? `Gracias ${pedido.cliente}` : 'TIENDA'} por elegirnos! En tu email recibirás toda la información y el seguimiento de tu pedido.</Subtitle>
            
            <h3 style={{ color: 'purple', textAlign: 'center', marginTop: 40, marginBottom: 10, fontSize: '28px' }}>DETALLES DEL PEDIDO:</h3>

            <DataTable 
              value={pedido.productos} 
              showGridlines 
              tableStyle={{ 
                minWidth: '50rem', 
                marginTop: '20px',
                border: '2px solid #ccc', 
                backgroundColor: '#f9f9f9' 
              }}>
                <Column field="nombre_producto" header="PRODUCTO" style={{ width: '25%', backgroundColor: '#e6e6fa' }}></Column>
                <Column field="cantidad" header="CANTIDAD" style={{ width: '5%', backgroundColor: '#e6e6fa' }}></Column>
                <Column field="precio" header="PRECIO" body={(rowData) => `$${rowData.precio}`} style={{ width: '25%', backgroundColor: '#e6e6fa' }}></Column>
            </DataTable>

            <div style={{ marginTop: '40px', textAlign: 'right', fontSize: '18px', color: 'black', marginInline: '10px' }}>
                <p style={{ marginBottom: '15px' }}><strong>Subtotal:</strong> ${subtotal}</p>
                <p style={{ marginBottom: '15px' }}><strong>Costo de Envío:</strong> ${costoEnvio.toFixed(2)}</p>
                <h3 style={{fontWeight: 'bold', marginBottom: '15px'}}><strong>Total:</strong> ${totalFinal}</h3>
                <p style={{ marginBottom: '15px' }}><strong>Metodo de Pago:  </strong>{pedido ? `${pedido.medio_pago}` : 'EFECTIVO'}</p>
            </div>

            <a href="/" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                <Button 
                    label="VOLVER A LA TIENDA" 
                    severity="success" 
                    style={{ 
                        fontSize: '20px',  // Aumenta el tamaño del texto del botón
                        padding: '10px 10px',  // Aumenta el tamaño del botón 
                        textAlign: 'center',  // Asegura que el texto esté centrado
                        width: '50%',  // Haz que el botón ocupe todo el ancho disponible
                        maxWidth: '400px'  // Define un ancho máximo para evitar que sea demasiado ancho
                    }} 
                />
            </a>


            <div style={{justifyContent: 'center', marginTop: '40px', fontSize: '12px'}}>
            <ContactoContainer style={{ color: 'gray', textAlign: 'center' }}>
              <h2 style={{ fontWeight: 'bold' }}>Contacto</h2>
              <ItemContacto style={{ color: 'gray' }}>
                  <FaInstagram />
                  <a>{config ? `${config.storeInstagram}` : '-'}</a>
              </ItemContacto>
              <ItemContacto style={{ color: 'gray' }}>
                  <IoMailOutline/>
                  <a>{config ? `${config.storeEmail}` : '-'}</a>
              </ItemContacto>
              <ItemContacto style={{ color: 'gray' }}>
                  <FaWhatsapp />
                  <a>{config ? `${config.storePhone}` : '-'}</a>
              </ItemContacto>
              <ItemContacto style={{ color: 'gray' }}>
                  <FaLocationDot />
                  <a>
                      {config ? `${config.storeAddress}` : '-'}
                  </a>
              </ItemContacto>
            </ContactoContainer>
            </div>

          </AjustesWrapper>
        </AjustesContainerStyled>
    );
};

export default Confirmation;
