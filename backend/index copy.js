require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const axios = require('axios');
const morgan = require('morgan');
const path = require('path');
const mercadopago = require('mercadopago');
const fs = require('fs');
const dotenv = require('dotenv');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.resolve("src/public")));
app.use(express.static(path.resolve("public")));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2511',
    database: 'gootpv'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Rutas
app.get('/articulosOF', (req, res) => {
    const query = "SELECT CODIGO_BARRA, COD_INTERNO, COD_IVA, PRECIO_SIN_IVA_4, COSTO, porc_impint, COD_DPTO, PESABLE, STOCK, art_desc_vta FROM articulo WHERE art_desc_vta LIKE '%COCA COLA%' LIMIT 8";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

app.get('/articulosDEST', (req, res) => {
    const query = "SELECT CODIGO_BARRA, COD_INTERNO, COD_IVA, PRECIO_SIN_IVA_4, COSTO, porc_impint, COD_DPTO, PESABLE, STOCK, art_desc_vta FROM articulo WHERE art_desc_vta LIKE '%COCA COLA%' LIMIT 8";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

app.get('/productosMAIN', (req, res) => {
    const query = "SELECT CODIGO_BARRA, COD_INTERNO, COD_IVA, PRECIO_SIN_IVA_4, COSTO, porc_impint, COD_DPTO, PESABLE, STOCK, art_desc_vta FROM articulo LIMIT 16";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

app.get('/articulos/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const query = `
        SELECT CODIGO_BARRA, COD_INTERNO, COD_IVA, PRECIO_SIN_IVA_4, COSTO, porc_impint, COD_DPTO, PESABLE, STOCK, art_desc_vta
        FROM articulo
        WHERE COD_DPTO = ?;
    `;
    db.query(query, [categoryId], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

app.get('/buscar', (req, res) => {
    const searchTerm = req.query.q;
    const query = `
        SELECT CODIGO_BARRA, COD_INTERNO, COD_IVA, PRECIO_SIN_IVA_4, COSTO, porc_impint, COD_DPTO, PESABLE, STOCK, art_desc_vta
        FROM articulo
        WHERE art_desc_vta LIKE ?;
    `;
    db.query(query, [`%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

app.get('/categorias', (req, res) => {
    const query = `
        SELECT id_clasif, NOM_CLASIF
        FROM clasif WHERE COD_CLASIF = 1 ORDER BY NOM_CLASIF ASC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

app.get('/artCHECKOUT', (req, res) => {
    const query = "SELECT CODIGO_BARRA, COD_INTERNO, COD_IVA, PRECIO_SIN_IVA_4, COSTO, porc_impint, COD_DPTO, PESABLE, STOCK, art_desc_vta FROM articulo WHERE art_desc_vta LIKE '%COCA COLA%' LIMIT 4";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

app.post('/cart', (req, res) => {
    const { name, quantity, total, price } = req.body;
    if (!req.session.cart) {
        req.session.cart = [];
    }
    req.session.cart.push({ name, quantity, total, price });
    console.log('Carrito actualizado:', req.session.cart); // Log para depuración
    res.send('Artículo añadido al carrito');
});

app.get('/cart', (req, res) => {
    console.log('Obteniendo carrito:', req.session.cart); // Log para depuración
    res.json(req.session.cart || []);
});

//localizacion cliente
let storeCoordinates = { lat: 0, lng: 0 };

async function getStoreCoordinates() {
    const address = process.env.STORE_ADDRESS;
    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${process.env.OPENCAGE_API_KEY}`);
        if (response.data.results.length === 0) {
            console.error('Dirección de la tienda no válida');
            return;
        }
        const { lat, lng } = response.data.results[0].geometry;
        storeCoordinates = { lat, lng };
        console.log('Coordenadas de la tienda obtenidas:', storeCoordinates);
    } catch (error) {
        console.error('Error al obtener las coordenadas de la tienda:', error);
    }
}

app.post('/calculateShipping', async (req, res) => {
    const { address } = req.body;
    console.log('Received Address:', address);

    try {
        const encodedAddress = encodeURIComponent(address);
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${process.env.OPENCAGE_API_KEY}`);
        console.log('OpenCage Response:', response.data);

        if (response.data.results.length === 0) {
            return res.status(400).json({ message: 'Dirección no válida' });
        }

        const validResults = response.data.results.map(result => {
            const { lat, lng } = result.geometry;
            const distance = getDistanceFromLatLonInKm(storeCoordinates.lat, storeCoordinates.lng, lat, lng);
            const shippingCost = calculateShippingCost(distance);
            return {
                formatted: result.formatted,
                distance,
                shippingCost
            };
        });

        if (validResults.length === 0) {
            return res.status(400).json({ message: 'No se encontró una dirección válida.' });
        }

        res.json({ results: validResults });
    } catch (error) {
        console.error('Error al calcular el envío:', error);
        if (error.response && error.response.data) {
            console.error('Error Response Data:', error.response.data);
        }
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function calculateShippingCost(distance) {
    const baseCost = 100;
    const costPerKm = 5;
    return baseCost + (distance * costPerKm);
}


    
    //FUNCION MERCADO PAGO 
    const client = new mercadopago.MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });
    app.post('/create_preference', async (req, res) => {
        
        try {
            const body = {
                items: [
                    {
                        title:"PuntoSur MultiMercado",
                        quantity: 1,
                        unit_price: Number(req.body.total),
                        currency_id: "ARS"
                    },
                ],
                back_urls: {
                    success: "localhost",
                    failure: "localhost",
                    pending: "localhost",
                },
                auto_return: "approved",
            };

            const preference = new mercadopago.Preference(client);
            const result = await preference.create({ body });
            res.json({
                id: result.id,
            });
        } catch (error){
            console.log(error);
            res.status(500).json({
                error: "Error al crear la preferencia",
            });
        }
        
    });

    

    
    //FUNCION PARA GUARDAR AJUSTES
app.get('/api/getConfig', (req, res) => {
    const envPath = path.resolve(__dirname, '.env');
    const config = dotenv.parse(fs.readFileSync(envPath));

    const response = {
        storeName: config.STORE_NAME,
        storeAddress: config.STORE_ADDRESS,
        mercadoPagoToken: config.MERCADOPAGO_ACCESS_TOKEN,
        iva: config.IVA,
        pageStatus: config.PAGE_STATUS,
        userName: config.USER_NAME,
        passWord: config.PASSWORD
    };

    res.json(response);
});

app.post('/api/saveConfig', (req, res) => {
    const config = req.body;
    const envPath = path.resolve(__dirname, '.env');
    const existingConfig = dotenv.parse(fs.readFileSync(envPath));

    // Actualizar solo las variables que están en el request
    existingConfig.STORE_NAME = config.storeName || existingConfig.STORE_NAME;
    existingConfig.STORE_ADDRESS = config.storeAddress || existingConfig.STORE_ADDRESS;
    existingConfig.MERCADOPAGO_ACCESS_TOKEN = config.mercadoPagoToken || existingConfig.MERCADOPAGO_ACCESS_TOKEN;
    existingConfig.IVA = config.iva || existingConfig.IVA;
    existingConfig.PAGE_STATUS = config.pageStatus || existingConfig.PAGE_STATUS;
    existingConfig.USER_NAME = config.userName || existingConfig.USER_NAME;
    existingConfig.PASSWORD = config.passWord || existingConfig.PASSWORD;

    // Crear el contenido del archivo .env
    const updatedConfig = Object.keys(existingConfig).map(key => `${key}=${existingConfig[key]}`).join('\n');

    fs.writeFile(envPath, updatedConfig, (err) => {
        if (err) {
            console.error('Error al guardar el archivo de configuración', err);
            return res.status(500).send('Error al guardar el archivo de configuración');
        }

        res.send('Configuración guardada exitosamente');
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const envPath = path.resolve(__dirname, '.env');
    const config = dotenv.parse(fs.readFileSync(envPath));

    const envUsername = config.USER_NAME;
    const envPassword = config.PASSWORD;

    if (username === envUsername && password === envPassword) {
        res.status(200).json({ message: 'Solicitud aprobada' });
    } else {
        res.status(401).json({ message: 'Solicitud denegada. Si olvido sus datos, consulte con el proveedor.' });
    }
});

app.listen(port, async () => {
    await getStoreCoordinates(); // Obtener las coordenadas de la tienda al iniciar el servidor
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
