const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
//Combina 2 ubicaciones diferentes para unir la carpeta public con
//el coverImageBasePath que creamos en el modelo
const uploadPath = path.join('public', Book.coverImageBasePath)
const Author = require('../models/author')
const multer = require('multer')
const { remove } = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})
//En caso de obtener


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
    renderNewPage(res, new Book())
})


//Create book, como acá dice router.post(), la unica manera
//de acceder a esto es con un form con un metodo de "POST"
//A la hora de subir imagenes, el single("algo") va a tener el valor
//del input que yo cree
router.post('/', upload.single('cover'), async (req, res) =>{
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description,
    })
    try{
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    } catch {
        if(book.coverImageName != null) removeBookCover(book.coverImageName)
        renderNewPage(res, book, true)
    }
})

async function renderNewPage(res, book, hasError = false){
    try{
        const authors = await Author.find({})
        const params = {
                authors: authors,
                book: book 
        }
        if(hasError) params.errorMessage = 'error Creating book'
        res.render('books/new', params)
    } catch{
        res.redirect('/books')
    }
}

function removeBookCover(fileName){
    //Combino el uploadPath con el filename para eliminar el bookcover
    //En caso de que haya un error y no se guarde el libro
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if(err) console.error(err)
    })
}
module.exports = router;