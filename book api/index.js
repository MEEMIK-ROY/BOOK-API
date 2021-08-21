

const express = require('express');
const db = require('./db/db')
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.raw());
const port = "8080";



/* Starting Page*/
app.get("/", (req,res) =>{
    res.send("Welcome to Book Management APIs");
})

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
    var publisher = db.publications.filter((publisher) => publisher.name == publisher_name)[0];
    var result =[]; 
    for (let i = 0; i < db.authors.length; i++) {
        let author = db.authors[i];
        for (let j = 0; j < author.books.length; j++) {
            const a_book = author.books[j];
            for (let m = 0; m < publisher.books.length; m++) {
                const p_book = publisher.books[m];
                if(a_book === p_book){
                    result.push(author)
                }
            }
        }
            
    }
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
    
    res.send(responseObj);
})

/* REST API to Get books based on author name
    @route /books/author/:author_name
    @description "GET all books based on authorname" 
    @method GET
    @params -
    @return_type JSON object
    @content type text/JSON
*/
app.get("/books/author/:author_name", (req,res) =>{  
        const {
            author_name,
        } = req.params;

        var req_author = db.authors.filter((author) => author.name === author_name)[0].id;
        var result = db.books.filter((book) => book.authors.includes(req_author))
        var responseObj = {};
        if(result.length == 0){
            responseObj = {
                data: {},

                message: `No books found for the author ${author_name}`,

                status: 404
            }
        }
        else{
            responseObj = {
                data: result,

                message: `${result.length} books found for the author ${author_name}`,

                status: 200
            }
        }
    

    res.json(responseObj);
   
})


/*..................................................................................................................................................*/
/* REST API to POST books 
    @route /books
    @description "POST book to db.books" 
    @method POST
    @params -
    @return_type JSON object
    @content type application/JSON
*/


app.post("/books", (req,res) =>{
    const book = req.body;

    if(db.books === undefined){
        db.books = [book];
    }
    else{
        db.books.push(book);
    }

    var responseObj = {};
        if(db.books.length == 0){
            responseObj = {
                data: {},

                message: `No books added`,

                status: 404
            }
        }
        else{
            responseObj = {
                data: db.books,

                message: `${db.books.length} books present in the database`,

                status: 200
            }
        }
    res.json(responseObj);
})

app.listen(port, ()=>{console.log(`listening at http://localhost: ${port}`)})