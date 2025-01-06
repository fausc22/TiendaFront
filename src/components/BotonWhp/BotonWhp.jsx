import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './BotonWhpStyles';
import { FaWhatsapp } from "react-icons/fa";

const BotonWhp = () => {

    const [envVariables, setEnvVariables] = useState({});
    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        axios.get(`${apiUrl}/store/variablesenv`)	
          .then(response => {
            setEnvVariables(response.data);
          })
          .catch(error => {
            console.error('Error fetching environment variables:', error);
          });
    }, []);

    const link = 'https://wa.me/' + envVariables.storePhone;
    const openWhatsApp = () => {
        window.open(link, '_blank');
    };

    return (
        <Button onClick={openWhatsApp}>
            <FaWhatsapp/>
        </Button>
    );
};

export default BotonWhp;
