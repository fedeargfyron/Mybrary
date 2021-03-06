if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//Con app.set(algo, otro), le digo que algo va a ser encontrado en otro
//Otro ejemplo para entenderlo seria app.set('view engine', 'pug')
//El archivo.pug va a estar dentro de la carpeta views
//luego puedo hacer app.get('/', funcion (req, res) =>{
//  res.render('index'), que este index va a buscar ser .pug
//})
//Tambien se puede ver como (variable, valor)
//seteamos el view engine, y ejs va a ser el view engine

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
//Setteo la ruta principal
const indexRouter = require('./routes/index')
//Setteo la ruta principal del autor en una constante
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
//Layout va a ser como mi plantilla para todos los archivos para no
//duplicar todo el html
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
//Archivos publicos styles/sheets/imgs
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.use(methodOverride('_method'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to mongoose'))
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.listen(process.env.PORT || 3000)
