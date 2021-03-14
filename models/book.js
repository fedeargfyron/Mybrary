const mongoose = require('mongoose')

const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'
//Declaro mi clase con schema
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName:{
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})
//Me permite crear un atributo virtual, actua igual pero saca su valor
//desde los atributos del objeto
bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null){
        //Aca devuelvo el valor de el archivo que está dentro de
        //Public/bookcover/imagen
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})
//Con este export, gracias a mongoose.model basicamente
//estoy creando una tabla llamada 'Author' que va a ser
//definida con el esquema que le pasemos
module.exports = mongoose.model('Book', bookSchema)
//De esta manera exporto una named variable
module.exports.coverImageBasePath = coverImageBasePath
//9:21 del video