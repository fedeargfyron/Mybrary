const mongoose = require('mongoose')
const Book = require('./book')
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

//Esta funcion se va a ejecutar cuando la accion "remove" sea ejectuada,
//pero antes que ella
authorSchema.pre('remove', function(next){
    Book.find({ author: this.id }, (err, books) =>{
        //Si next() está vacio, mongoose sabe que puede continuar
        //con el codigo
        if(err){
            next(err)
        } else if(books.length > 0){
            next(new Error('This author has books still'))
        }else{
            next()
        }
    })
})
module.exports = mongoose.model('Author', authorSchema)

//9:21 del video