const express = require('express')
const router = express.Router()
const Book = require('../models/book')
//Combina 2 ubicaciones diferentes para unir la carpeta public con
//el coverImageBasePath que creamos en el modelo
const Author = require('../models/author')
const book = require('../models/book')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


//All book route
router.get('/', async (req, res) => {
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        //Si publishDate es menor o igual a nuestro filtro, me devuelve ese objeto
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})


//New book route
router.get('/new', async (req, res) =>{
    renderFormPage(res, book, "new")
})


//Create book, como acá dice router.post(), la unica manera
//de acceder a esto es con un form con un metodo de "POST"
//A la hora de subir imagenes, el single("algo") va a tener el valor
//del input que yo cree
router.post('/', async (req, res) =>{
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
    })
    saveCover(book, req.body.cover)
    try{
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    } catch {
        renderFormPage(res, book, "new", true)
    }
})

router.get('/:id', async (req, res) => {
    //params nos va devolver todos los parametros que defini en mi
    //url path
    try{
        //Con populate voy a conseguir TODA la información del author que
        //esté dentro del book
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', { 
        book: book,
        })
    } catch {
        res.redirect('/books')
    }
    
})

//Edit book route
router.get('/:id/edit', async (req, res) =>{
    try{
        const book = await Book.findById(req.params.id)
        renderFormPage(res, book, 'edit')
    }
    catch{
        res.redirect('/')
    }
    
})

//Put para actualizar
//Desde un browser solamente podemos usar get y post, así que usamos
//Una libreria
//Update book route
router.put('/:id', async (req, res) =>{
    let book
    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if(req.body.cover != null && req.body.cover != ''){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch {
        if(book != null){
            renderFormPage(res, book, "edit", true)
        }
        else{
            redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) =>{
    let book
    try{
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch {
        if(book != null){
            res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            })
        }
        else{
            res.redirect('/')
        }
    }
}) 
async function renderFormPage(res, book, form, hasError = false){
    try{
        const authors = await Author.find({})
        const params = {
                authors: authors,
                book: book
        }
        if(hasError){
            if(form === 'edit'){
                params.errorMessage = 'error Editing book'
            }
            else{
                params.errorMessage = 'error Creating book'
            } 
        }
        res.render(`books/${form}`, params)
    } catch{
        res.redirect('/books')
    }
}

function saveCover(book, coverEncoded){
    if(coverEncoded == null || coverEncoded == "") {
        return
    }
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        //Primer parametro mi data, segundo parametro de donde lo quiero convertir
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}
module.exports = router;