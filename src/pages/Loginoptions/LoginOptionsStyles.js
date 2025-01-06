import styled from "styled-components";

export const LoginOptionsContainer = styled.main`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom, #f8f9fa, #e0e0e0);
`;

export const OptionsWrapper = styled.div`
    display: flex;
    width: 80%;
    max-width: 1000px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    background: linear-gradient(45deg, #ffffff, #f0f0f0);
    
    @media screen and (max-width: 768px) {
        width: 90%;
    }
`;

export const LeftContainer = styled.div`
    flex: 1;
    padding: 60px 40px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #343a40;
    width: 50%;
    @media screen and (max-width: 768px) {
        padding: 40px;
    }

    @media screen and (max-width: 576px) {
        padding: 30px;
    }
`;

export const RightContainer = styled.div`
    display: flex;
    padding: 60px 40px;
    background-color: var(--blue, #007bff);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    position: relative;
    overflow: hidden;
    width: 50%;
    @media screen and (max-width: 768px) {
        display: none;
    }
`;

export const TitleRightContainer = styled.div`
    display: flex;
    position: absolute;
    padding: 40px 0 0 5px;
    width: 80%;
    top: 0;
    align-items: start;
    justify-content: start;
    z-index: 1;
    h2 {
        font-size: 30px;
        font-weight: 700;
    }
`

export const RightImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const Title = styled.h1`
    margin-bottom: 10px;
    font-size: 36px;
    text-align: center;

    @media screen and (max-width: 576px) {
        font-size: 28px;
    }
`;

export const Subtitle = styled.p`
    margin-bottom: 40px;
    font-size: 18px;
    text-align: center;
    color: #6c757d;

    @media screen and (max-width: 576px) {
        font-size: 16px;
        margin-bottom: 30px;
    }
`;

export const OptionButton = styled.button`
    width: 100%;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }

    &:active {
        background-color: #004085;
    }

    @media screen and (max-width: 576px) {
        font-size: 16px;
    }
`;

export const LogoutButton = styled.button`
    align-self: flex-end;
    padding: 10px 20px;
    background-color: #dc3545;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c82333;
    }

    &:active {
        background-color: #bd2130;
    }

    @media screen and (max-width: 576px) {
        font-size: 12px;
    }
`;
