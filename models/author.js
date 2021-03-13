const mongoose = require('mongoose')
//Declaro mi clase con schema
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
//Con este export, gracias a mongoose.model basicamente
//estoy creando una tabla llamada 'Author' que va a ser
//definida con el esquema que le pasemos
module.exports = mongoose.model('Author', authorSchema)

//9:21 del video