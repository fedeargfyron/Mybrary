const mongoose = require('mongoose')

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
    coverImage:{
        type: Buffer,
        required: true
    },
    coverImageType: {
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
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})
//Con este export, gracias a mongoose.model basicamente
//estoy creando una tabla llamada 'Author' que va a ser
//definida con el esquema que le pasemos
module.exports = mongoose.model('Book', bookSchema)