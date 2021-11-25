'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var ProjectSchema = schema({
    name: String,
    description: String,
    category: String,
    year: Number,
    langs: String,
    image: String  
});

module.exports = mongoose.model('Project', ProjectSchema)
// moongose cuando enviemos esto va a 'normalizar' el nombre (caps y plural) y pasa de 
// Project --> projects. Si ya existe una colección con ese nombre, en su lugar lo guarda ahí.