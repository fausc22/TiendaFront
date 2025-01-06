import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LoginOptionsContainer, 
  OptionsWrapper, 
  LeftContainer, 
  RightContainer, 
  OptionButton, 
  LogoutButton, 
  Title, 
  Subtitle, 
  RightImage, 
  TitleRightContainer 
} from './LoginOptionsStyles';
import imgLogin from '../../assets/img/login-img/bg-blue.jpg';

const LoginOptions = () => {
  const navigate = useNavigate();

  const handlePanelClick = () => {
    navigate('/panel');
  };

  const handleSettingsClick = () => {
    navigate('/ajustes');
  };

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión
    navigate('/login');
  };

  return (
    <LoginOptionsContainer>
      <OptionsWrapper>
        <LeftContainer>
          <Title>Opciones</Title>
          <Subtitle>Selecciona una opción para continuar.</Subtitle>
          <OptionButton onClick={handlePanelClick}>PANEL</OptionButton>
          <OptionButton onClick={handleSettingsClick}>AJUSTES</OptionButton>
          <LogoutButton onClick={handleLogout}>CERRAR SESIÓN</LogoutButton>
        </LeftContainer>
        <RightContainer>
          <TitleRightContainer>
            <h2>Bienvenido! Somos PuntoSur</h2>
          </TitleRightContainer>
          <RightImage src={imgLogin} alt=''/>
        </RightContainer>
      </OptionsWrapper>
    </LoginOptionsContainer>
  );
};

export default LoginOptions;
