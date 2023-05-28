const {MongoClient, ReturnDocument} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require( 'mongodb')
let client;

const app = express();

app.use(bodyParser.json());
// 1.push your server and server1 into github
// rest api -> 1.book store() 2. todo app()
// src ->
// 2. create one route,one controller,one service.
// book store-> routes-> file(bookRoutes.js) --> all your routing(methods)
//         ->controller->file(bookcontroller.js) --> all your callback functions of routes 
//         ->service->file(bookservice.js)  --> all your database functions in service
//         ->config-> file(db.js)--> database connection and return the connetion
// 3. use import insted of require
async function main() {
	const URI = "mongodb://localhost:27017";
  client = new MongoClient(URI);
  console.log('connection estiblish');
  
  try {
    await client.connect();

    await listDatabases(client);
   
 
} catch (e) {
    console.error(e);
}
finally {
  await client.close();
}
}

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};



main().catch(console.error);

async function createBook(client, newBook){
  await client.connect();
  const result = await client.db("bookstore").collection("books").insertOne(newBook);
  console.log(`New book is created with the following id: ${result}`);
}

async function getAllBooks(client) {
  await client.connect();
  const books = await client.db("bookstore").collection("books").find({}).toArray();

  

  return books;

 }

// Sample data
let books = [
];

// GET all books
app.get('/books', async(req, res) => {
  // res.json(books);
    const result = await getAllBooks(client);
    // console.log(result);
    res.status(200).json({ message: 'all books', result});
});

// GET a single book by NAME
app.get('/books/:title', async(req, res) => {
  const titleOfBook = req.params.title;
  // const book = books.find((b) => b.id === bookId);
  const book = await findBookByTitle(client,titleOfBook);
  if(!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.status(200).json(book);


  // res.json(book);
});


async function findBookByTitle(client, titleOfBook) {
  await client.connect();
  const book = await client.db("bookstore").collection("books").findOne({ title : titleOfBook});

  if (book) {
      console.log(`Found a book in the collection with the name '${titleOfBook}':`);
      console.log(book);
      return book;
  } else {
      console.log(`No book found with the name '${titleOfBook}'`);
  }
}

async function updateBookById(client, bookId, updatedBook) {
  console.log(bookId);
  await client.connect();
 const objectId = new ObjectId(bookId);
  const result = await client.db("bookstore").collection("books")
                      .updateOne({ _id: objectId }, { $set:updatedBook});
    console.log(objectId);
    console.log(`${updatedBook.title}`);
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
        if(result.modifiedCount){
          return "record updated";
        }
        return "record not found to update"


}

async function deleteBookById(client, bookId) {
  await client.connect();
  const objectId = new ObjectId(bookId);
  const result = await client.db("bookstore").collection("books")
          .deleteOne({ _id: objectId });
  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}





// POST a new book
app.post('/books', async (req, res) => {
  const { title, author } = req.body;
  const book = { title, author };
  // books.push(book);
  console.log('before db call')

  const result = await createBook(client,book);
  console.log('after db call')
  res.status(201).json({ message: 'Book created', result });
});

// PUT/update a book
app.put('/books/:id', async(req, res) => {
  const bookId = req.params.id;
  const { title, author } = req.body;
  const response = await  updateBookById(client,bookId,{title,author});

  // const bookIndex = books.findIndex((b) => b.id === bookId);

  // if (bookIndex === -1) {
  //   return res.status(404).json({ message: 'Book not found' });
  // }

  // const updatedBook = { id: bookId, title, author };
  // books[bookIndex] = updatedBook;

  res.json({ message: response });
});

// DELETE a book
app.delete('/books/:id', async(req, res) => {
  const bookId = req.params.id;
const deletedBook = await deleteBookById(client,bookId);
 // const bookIndex = books.findIndex((b) => b.id === bookId);
 if (!bookId) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // const deletedBook = books.splice(bookIndex, 1)[0];
 res.json({ message: 'Book deleted', book: deletedBook });
});

// Start the server
app.listen(5000, () => {
  console.log("server is running on port 5000...");
});
