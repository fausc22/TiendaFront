import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContainerStyled, LoginWrapper, LeftContainer, RightContainer, FormGroup, StyledButton, Title, Subtitle, Input, RightImage, TitleRightContainer } from './LoginStyles';
import imgLogin from '../../assets/img/login-img/bg-blue.jpg';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const errorMessage = (message) => {
    toast.error(message);
  }

  const successMessage = (message) => {
    toast.success(message);
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleLogin = async () => {
    const response = await fetch('http://localhost:3001/admin/loginCheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.status === 200) {
      successMessage(result.message);
      navigate('/loginoptions');
    } else {
      errorMessage(result.message);
    }
  };

  return (
    <LoginContainerStyled>
      <LoginWrapper>
        <LeftContainer>
          <Title>Login</Title>
          <Subtitle>Bienvenido! Por favor, inicie sesión para continuar.</Subtitle>
          <FormGroup>
            <label htmlFor="username">Usuario</label>
            <Input type="text" id="username" value={formData.username} onChange={handleChange} placeholder="Ingrese su usuario" />
          </FormGroup>
          <FormGroup>
            <label htmlFor="password">Contraseña</label>
            <Input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="Ingrese su contraseña" />
          </FormGroup>
          <StyledButton onClick={handleLogin}>Login</StyledButton>
        </LeftContainer>
        <RightContainer>
          <TitleRightContainer>
            <h2>Bienvenido! Somos PuntoSur</h2>
          </TitleRightContainer>
          <RightImage src={imgLogin} alt=''/>
        </RightContainer>
      </LoginWrapper>
      <Toaster/>
    </LoginContainerStyled>
  );
};

export default Login;
