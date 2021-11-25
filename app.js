'use strict';

var express = require('express');

var app = express();

// cargar archivos rutas
var project_routes = require('./routes/project');

// Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// rutas de prueba
app.get('/inicio', (request, response) => {
    response.status(200).send(
        "<h1>Pagina de inicio</h1>"
    );
});

app.post('/prueba/:id', (request, response) => {
    console.log(request.body.nombre); // body porque estamos enviandolo por el cuerpo. Lo escupe por CMD
    console.log(request.query.web); // pasado por parametro ? URL
    console.log(request.params.id); // parametro obligatorio ID establecido 
    response.status(200).send({
        message: "Hola mundo desde mi API de NodeJS"
    });
});

// Rutas De Verdad
app.use('/api', project_routes);

 // exportar
 module.exports = app;