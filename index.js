'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = 3700;

mongoose.Promise = global.Promise; // esto es una promesa
mongoose.connect('mongodb://localhost:27017/portafolio',
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Conexion a base de datos establecida con éxito...");

        // Creacion del servidor
        app.listen(port, () => {
            console.log("Servidor corriendo correctamente en la URL: localhost:3700");
        })
    })
    .catch(err => console.log(err));