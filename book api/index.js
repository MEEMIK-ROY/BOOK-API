

const express = require('express');
const app = express();
const port = "8080";
const db = require('./db/db')

/* REST API to Get all books
    @route /books
    @description "GET all books" 
    @method GET
    @params -
    @return_type JSON object
    @content type text/JSON
*/
app.get("/books", (req,res) =>{
    var books = db.books;
    res.json(books);
})

/* REST API to Get book based on book id
    @route /books/book_id
    @description "GET particular books" 
    @method GET
    @params -
    @return_type JSON object
    @content type text/JSON
*/
app.get("/books/id/:isbn", (req,res) =>{
    const {
        isbn,
    } = req.params;
    var allbooks = db.books;
    var book = {}
    for (let i = 0; i < allbooks.length; i++) {
        const element = allbooks[i];
        if (isbn === element.ISBN){
            book = element;
            break;
        }        
    }

    var responseObj = {};
    if(book.length == 0){
        responseObj = {
            data: {},
            message: `No book found for book ID of ${isbn}`,
            status: 404
        }
    }
    else{
        responseObj = {
            data: book,
            message: `${book.title} found for book ID of ${isbn}`,
            status: 200
        }
    }

    res.json(responseObj);
})

/* REST API to Get book based on category
    @route /books/category/:category
    @description "GET particular books based on category" 
    @method GET
    @params -
    @return_type JSON object
    @content type text/JSON
*/
app.get("/books/category/:category", (req,res) =>{
    const {
        category,
    } = req.params;

    var result = db.books.filter((book) => book.category.includes(category));
    var responseObj = {};
    if(result.length == 0){
        responseObj = {
            data: {},

            message: `No book found for category of ${category}`,

            status: 404
        }
    }
    else{
        responseObj = {
            data: result,

            message: `${result.length} found for book ID of ${category}`,

            status: 200
        }
    }

    res.json(responseObj);
})

/* REST API to Get all authors
    @route /authors
    @description "GET all authors" 
    @method GET
    @params -
    @return_type JSON object
    @content type text/JSON
*/
app.get("/authors", (req,res) =>{
    var author = db.authors;
    var responseObj = {};
    if(author.length == 0){
        responseObj = {
            data: {},

            message: `No author found`,

            status: 404
        }
    }
    else{
        responseObj = {
            data: author,

            message: `${author.length} authors found`,

            status: 200
        }
    }

    res.json(responseObj);
})

/* REST API to Get all authors based on book isbn
    @route /authors/book_id/:isbn
    @description "GET all authors based on book id" 
    @method GET
    @params -
    @return_type JSON object
    @content type text/JSON
*/
app.get("/authors/book_id/:book_id", (req,res) =>{
    const {
        book_id,
    } = req.params;

    var result = db.authors.filter((author) => author.books.includes(book_id));
    var responseObj = {};
    if(result.length == 0){
        responseObj = {
            data: {},

            message: `No authors found for book-id of ${book_id}`,

            status: 404
        }
    }
    else{
        responseObj = {
            data: result,

            message: `${result.length} authors found for book ID of ${book_id}`,

            status: 200
        }
    }

    res.json(responseObj);
})


/* REST API to Get all publications
    @route /publications
    @description "GET all publications" 
    @method GET
    @params -
    @return_type JSON object
    @content type text/JSON
*/
app.get("/publications", (req,res) =>{
    var pub = db.publications;
    var responseObj = {};
    if(pub.length == 0){
        responseObj = {
            data: {},

            message: `No publishers found`,

            status: 404
        }
    }
    else{
        responseObj = {
            data: pub,

            message: `${pub.length} publishers found`,

            status: 200
        }
    }

    res.json(responseObj);
})


/* REST API to Get all authors belonging to specific publications
    @route /authors/publications/:publisher
    @description "GET all authors belonging to specific publication" 
    @method GET
    @params -
    @return_type JSON object
    @content type text/JSON
*/
app.get("/authors/publications/:publisher_name", (req,res) =>{
    const {
        publisher_name,
    } = req.params;
        var publisher = db.publications.filter((publisher) => publisher.name === publisher_name);
        var book = publisher.books;
        var result = db.authors.filter((author)=> author.books.includes(book));
        var responseObj = {};
        if(result.length == 0){
            responseObj = {
                data: {},

                message: `No authors found for publisher of ${publisher_name}`,

                status: 404
            }
        }
        else{
            responseObj = {
                data: result,

                message: `${result.length} authors found for book ID of ${publisher_name}`,

                status: 200
            }
        }
    
    res.json(responseObj);
})



app.listen(port, ()=>{console.log(`listening at http://localhost: ${port}`)})