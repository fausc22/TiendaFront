import React, { useState, useEffect } from 'react';
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
  ButtonsContainer 
} from './AjustesStyles';
import Modal from './Modal';

const Ajustes = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    mercadoPagoToken: '',
    iva: '0',
    pageStatus: '0',
    userName: '',
    passWord: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/api/getConfig'); // Asegúrate de que la ruta sea correcta
      const data = await response.json();
      setFormData(data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleConfirm = async () => {
    if (Object.values(formData).some(field => field.trim() === '')) {
      alert('Todos los campos deben estar completos');
      return;
    }

    setShowModal(true);

    const response = await fetch('http://localhost:3001/api/saveConfig', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      console.log('Configuración guardada exitosamente');
    } else {
      console.error('Error al guardar la configuración');
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleModalConfirm = () => {
    closeModal();
    navigate('/loginoptions');
  };

  return (
    <AjustesContainerStyled>
      <AjustesWrapper>
        <TitleContainer>
          <Title>Punto<span>Sur</span></Title>
          <Subtitle>Ajustes</Subtitle>
        </TitleContainer>
        <FormGroup>
          <label htmlFor="storeName">Nombre de la Tienda:</label>
          <Input type="text" id="storeName" value={formData.storeName} onChange={handleChange} placeholder="Ingrese el nombre de la tienda" />
        </FormGroup>
        <FormGroup>
          <label htmlFor="storeAddress">Dirección de la Tienda:</label>
          <Input type="text" id="storeAddress" value={formData.storeAddress} onChange={handleChange} placeholder="Ingrese la dirección de la tienda" />
        </FormGroup>
        <FormGroup>
          <label htmlFor="mercadoPagoToken">Token de Mercado Pago:</label>
          <Input type="password" id="mercadoPagoToken" value={formData.mercadoPagoToken} onChange={handleChange} placeholder="Ingrese el token de Mercado Pago" />
        </FormGroup>
        <FormGroup>
          <label htmlFor="iva">PRECIO IVA:</label>
          <Select id="iva" value={formData.iva} onChange={handleChange}>
            <option value="0">IVA 0</option>
            <option value="1">IVA 1</option>
            <option value="2">IVA 2</option>
            <option value="3">IVA 3</option>
            <option value="4">IVA 4</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <label htmlFor="pageStatus">ESTADO PAGINA</label>
          <Select id="pageStatus" value={formData.pageStatus} onChange={handleChange}>
            <option value="1">HABILITADA</option>
            <option value="0">DESHABILITADA</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <label htmlFor="userName">Nombre de Usuario:</label>
          <Input type="text" id="userName" value={formData.userName} onChange={handleChange} placeholder="Ingrese el usuario para los ajustes" />
        </FormGroup>
        <FormGroup>
          <label htmlFor="passWord">Contraseña:</label>
          <Input type="password" id="passWord" value={formData.passWord} onChange={handleChange} placeholder="Ingrese la contraseña para los ajustes" />
        </FormGroup>
        <ButtonsContainer>
          <BackButton onClick={() => navigate('/loginoptions')}>Volver</BackButton>
          <StyledButton onClick={handleConfirm}>Confirmar</StyledButton>
        </ButtonsContainer>
      </AjustesWrapper>
      <Modal 
        closeModal={closeModal} 
        confirmAction={handleModalConfirm} 
        show={showModal}
      />
    </AjustesContainerStyled>
  );
};

export default Ajustes;
