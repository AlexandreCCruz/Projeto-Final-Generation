require('dotenv').config();

const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);

app.listen(process.env.PORT);
console.log(`Servidor iniciado na porta ${process.env.PORT}`);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: 'Projeto Final Generation',
            version: "1.0.0",
        },
    },
    apis: ['./controladores/*.js'],
};
const CSS_URL =
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocs, { customCssUrl: CSS_URL })
);
