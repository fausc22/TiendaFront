import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ButtonPay, ButtonEditPay, FormLabel, InputsContainer, OptGroup, PagoContainerStyled,
  PagoForm, PagoFormContainer, PagoWrapper, Product, ProductContainer, ProductImg,
  ProductItems, ProductListWrapper, ProductsListContainer, Step, StepOne, StepThree,
  TextContainer
} from './PagoStyles';
import { CiCircleCheck } from "react-icons/ci";
import shopping from '../../assets/img/products-img/shopping.png';
import { fetchConfig } from "../../components/variablesenv";
import { Button } from 'primereact/button';
import Modal from 'react-modal';
import { ConfirmDialog } from 'primereact/confirmdialog';

const Pago = () => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [addressOptions, setAddressOptions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState(''); // Estado para la opción de entrega
  const [isDepartment, setIsDepartment] = useState(false); // Estado para manejar si es un departamento
  const [departmentNumber, setDepartmentNumber] = useState(''); // Estado para el número de departamento
  const [name, setName] = useState(''); // Estado para el nombre
  const [email, setEmail] = useState(''); // Estado para el email
  const [phone, setPhone] = useState(''); // Estado para el teléfono
  const [config, setConfig] = useState(null);
  const [localNote, setLocalNote] = useState(''); // Estado para la nota local
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); // Estado inicial para el método de pago
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
    
    
  }, []);

  useEffect(() => {
    const getConfig = async () => {
      const configData = await fetchConfig();
      setConfig(configData);
    };

    getConfig();
    
  }, []);

  useEffect(() => {
    if (config) {
      document.title = 'PAGO - ' + config.storeName;
    }
  }, [config]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const total = parseFloat(subtotal.toFixed(2)) + parseFloat(shippingCost.toFixed(2));
  


  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleCalculateShipping = async () => {
    setError('');
    setAddressOptions([]);
    if (address.trim()) {
      try {
        const response = await axios.post('http://localhost:3001/store/calculateShipping', { address });
        if (response.data.results.length > 0) {
          setAddressOptions(response.data.results);
        } else {
          setError('No se encontró una dirección válida.');
        }
      } catch (error) {
        console.error('Error al calcular el costo de envío:', error);
        if (error.response && error.response.data) {
          console.error('Error Response Data:', error.response.data);
          
        }
        setError('No se pudo calcular el costo de envío. Verifica la dirección ingresada.');
      }
    } else {
      setError('Por favor, ingresa una dirección válida.');
    }
  };

  

  const handleAddressSelection = (selected) => {
    // Actualiza el input con la dirección seleccionada
    setAddress(selected.formatted); // o la propiedad que tenga el formato adecuado
  
    // Guarda la dirección seleccionada en la variable selectedAddress
    setSelectedAddress(selected.formatted);
    console.log(selected.formatted);
  
    // Actualiza el costo de envío
    setShippingCost(selected.shippingCost);
  
    // Limpia las opciones de dirección
    setAddressOptions([]);
  };
  

  const handleCreatePreference = async () => {
    // Validaciones
    if (!name.trim() || !email.trim() || !phone.trim()) {
        setError('Por favor, completa todos los campos requeridos.');
        return;
    }

    if (deliveryOption === 'delivery') {
        if (!selectedAddress || shippingCost === 0) {
            setError('Por favor, calcula el costo de envío con una dirección válida.');
            return;
        }
        if (isDepartment && !departmentNumber.trim()) {
            setError('Por favor, ingresa el número de departamento.');
            return;
        }
    }

    if (deliveryOption === '') {
        setError('Por favor, selecciona una opción de entrega.');
        return;
    }

      try {
        const pedido = {
            cliente: name,
            direccion_cliente: `${selectedAddress}, ${departmentNumber}`,
            telefono_cliente: phone,
            email_cliente: email,
            cantidad_productos: cartItems.reduce((acc, item) => acc + item.quantity, 0),
            subtotal: subtotal.toFixed(2),
            costoEnvio: shippingCost.toFixed(2),
            monto_total: total,
            medio_pago: selectedPaymentMethod,
            estado: 'Pendiente',
            notas_local: localNote.trim() === '' ? '-' : localNote,
            productos: cartItems.map(item => ({
                codigo_barra: item.CODIGO_BARRA,
                nombre_producto: item.name,
                cantidad: item.quantity,
                precio: item.total.toFixed(2)
            }))
        };

        localStorage.setItem('pedido', JSON.stringify(pedido));

        if (selectedPaymentMethod === 'Efectivo') {
            
            window.location.href = '/confirmacion';
            
        } else if (selectedPaymentMethod === 'MercadoPago') {
            // Crear preferencia de pago en Mercado Pago
            const response = await axios.post('http://localhost:3001/store/create_preference', { total });
            setPreferenceId(response.data.id);
            window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${response.data.id}`;
        }

    } catch (error) {
        console.error('Error al crear la preferencia, enviar el correo o guardar el pedido:', error);
        setError('No se pudo completar la operación.');
    }
  };


  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setIsDepartment(e.target.value === 'si');
  };


  const handleConfirmDialog = () => {
    if (selectedPaymentMethod === 'Efectivo') {
      
      setModalMessage('Si la respuesta es SI, el pedido se confirmará y comenzara su proceso de preparación. Oprime NO para cancelar.');
      
      
  } else if (selectedPaymentMethod === 'MercadoPago') {
    setModalMessage('Si la respuesta es SI, te redireccionaremos a la plataforma de MERCADO PAGO para terminar la compra, y solo se confirmará una vez recibido el pago. Oprime NO para cancelar.');
  }
    setModalIsOpen(true);
  };

  const confirmDelete = () => {
    handleCreatePreference();
    setModalIsOpen(false);
    
  };


  const cancelDelete = () => {
    setModalIsOpen(false);
    
  };
  

  return (
    <PagoContainerStyled>
      <PagoWrapper>
        <Step>
          <StepOne><CiCircleCheck /> Elegir productos</StepOne>
          <StepOne><CiCircleCheck /> Agregar al carrito</StepOne>
          <StepThree><CiCircleCheck /> Confirmar pedido</StepThree>
        </Step>
        <PagoFormContainer>
          <PagoForm>
            <h3>Formulario de pago</h3>
            <InputsContainer>
              <FormLabel>
                Nombre
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </FormLabel>
              <FormLabel>
                Teléfono
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </FormLabel>
              <FormLabel>
                Email
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormLabel>
              <FormLabel>
                Forma de entrega
                <OptGroup>
                  <input
                    type="radio"
                    name="pago"
                    value="delivery"
                    checked={deliveryOption === 'delivery'}
                    onChange={handleDeliveryOptionChange}
                  />
                  <p>Envío por delivery</p>
                </OptGroup>
                <OptGroup>
                  <input
                    type="radio"
                    name="pago"
                    value="local"
                    checked={deliveryOption === 'local'}
                    onChange={handleDeliveryOptionChange}
                  />
                  <p>Retiro en el local</p>
                </OptGroup>
              </FormLabel>
              {deliveryOption === 'delivery' && (
                <>
                  <FormLabel>
                    Dirección
                    <input id="addressInput" type="text" value={address} onChange={handleAddressChange} placeholder="Ej: Chacabuco 635, Córdoba, Argentina" />
                    <button
                      type="button"
                      onClick={handleCalculateShipping}
                      style={{
                        marginLeft: '10px',
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Calcular envío
                    </button>
                    <p style={{ display: 'inline', marginLeft: '10px' }}>
                      {shippingCost > 0 ? `Costo de envío: $${shippingCost.toFixed(2)}` : ''}
                    </p>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {addressOptions.length > 0 && (
                      <div>
                        <h4>Seleccione la dirección correcta:</h4>
                        <ul>
                          {addressOptions.map((option, index) => (
                            <li key={index} onClick={() => handleAddressSelection(option)} style={{ cursor: 'pointer', color: 'blue' }}>
                              {option.formatted}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </FormLabel>
                  <FormLabel>
                    ¿Es un departamento?
                    <OptGroup>
                      <input
                        type="radio"
                        name="departamento"
                        value="si"
                        checked={isDepartment === true}
                        onChange={handleDepartmentChange}
                      />
                      <p>Si</p>
                    </OptGroup>
                    <OptGroup>
                      <input
                        type="radio"
                        name="departamento"
                        value="no"
                        checked={isDepartment === false}
                        onChange={handleDepartmentChange}
                      />
                      <p>No</p>
                    </OptGroup>
                  </FormLabel>
                  {isDepartment && (
                    <FormLabel>
                      Número de Departamento
                      <input
                        type="text"
                        value={departmentNumber}
                        onChange={(e) => setDepartmentNumber(e.target.value)}
                        placeholder="Número de Departamento"
                      />
                    </FormLabel>
                  )}
                  
                </>
              )}
              <FormLabel>
                    Método de pago
                    <OptGroup>
                      <input type="radio" name="metodo_pago" value="efectivo" onChange={(e) => setSelectedPaymentMethod('Efectivo')} />
                      <p>Efectivo</p>
                    </OptGroup>
                    <OptGroup>
                      <input type="radio" name="metodo_pago" value="mercado_pago" onChange={(e) => setSelectedPaymentMethod('MercadoPago')} />
                      <p>Mercado pago / Tarjeta de crédito/débito</p>
                    </OptGroup>
                  </FormLabel>
              <FormLabel>
                Nota para el local
                <input type="text" value={localNote} onChange={(e) => setLocalNote(e.target.value)} />
              </FormLabel>
            </InputsContainer>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </PagoForm>
          <ProductsListContainer>
            <h3>Listado del pedido</h3>
            <ProductListWrapper>
              <p>{cartItems.length} items</p>
              <ProductContainer>
                {cartItems.map((item, index) => (
                  <Product key={index}>
                    <ProductImg>
                      <img src={`https://www.rsoftware.com.ar/imgart/${item.CODIGO_BARRA}.png`} alt={item.name} onError={(e) => { e.target.onerror = null; e.target.src = shopping; }} />
                    </ProductImg>
                    <ProductItems>
                      <h4>${item.total.toFixed(2)}</h4>
                      <p>{item.name}</p>
                      <span>Cantidad: {item.quantity}</span>
                    </ProductItems>
                  </Product>
                ))}
              </ProductContainer>
            </ProductListWrapper>
            <TextContainer>
              <p>Subtotal</p>
              <span>${subtotal.toFixed(2)}</span>
            </TextContainer>
            <TextContainer>
              <p>Envío</p>
              <span>${shippingCost.toFixed(2)}</span>
            </TextContainer>
            <TextContainer>
              <h3>Total</h3>
              <h3>${total.toFixed(2)}</h3>
            </TextContainer>
            <ButtonPay onClick={handleConfirmDialog}>Confirmar pedido</ButtonPay>

            <ButtonEditPay to='/checkout'>Editar Carrito</ButtonEditPay>
            
             
            
            
            


          </ProductsListContainer>
        </PagoFormContainer>
      </PagoWrapper>


      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={cancelDelete}
        contentLabel="Confirm Delete"
        ariaHideApp={false}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <h2 style={{ color: '#333', marginBottom: '20px' }}>¿Estás seguro que deseas confirmar el pedido?</h2>
        <h5 style={{ color: '#333', marginBottom: '8px' }}>{modalMessage}</h5>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            onClick={confirmDelete} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sí
          </button>
          <button 
            onClick={cancelDelete} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            No
          </button>
        </div>
      </Modal>
    </PagoContainerStyled>
    
  );
};

export default Pago;
