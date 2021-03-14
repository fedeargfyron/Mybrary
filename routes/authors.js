const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
//En caso de obtener
//All authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })
    }catch (err){
        res.redirect('/')
    }
    
})

//New author route
router.get('/new', (req, res) =>{
    res.render('authors/new', {author: new Author()})
})

//Create author, como acá dice router.post(), la unica manera
//de acceder a esto es con un form con un metodo de "POST"
router.post('/', async (req, res) =>{
    const author = new Author({
        name: req.body.name
    })
    try{
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        })
    }
})
//Despues de la barra va a haber un id que va a ser pasado con el request 
router.get('/:id', async (req, res) => {
    //params nos va devolver todos los parametros que defini en mi
    //url path
    try{
        const author = await Author.findById(req.params.id)
        const booksByAuthor = await Book.find({author: author.id}).limit(6).exec()
        res.render('authors/show', { 
        author: author,
        booksByAuthor: booksByAuthor
        })
    } catch {
        res.redirect('/authors')
    }
    
})

router.get('/:id/edit', async (req, res) =>{
    try{
        //Metodo dentro de la libreria mongoose
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author})
    }
    catch{
        res.redirect('/authors')
    }
})

//Put para actualizar
//Desde un browser solamente podemos usar get y post, así que usamos
//Una libreria
router.put('/:id', async (req, res) =>{
    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        if(author == null){
            res.redirect('/')
        }
        else{
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating author'
            })
        }
    }
})

router.delete('/:id', async (req,res) =>{
    let author
    try{
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch {
        if(author == null){
            res.redirect('/')
        }
        else{
            res.redirect(`authors/${author.id}`)
        }
    }
})
module.exports = router;