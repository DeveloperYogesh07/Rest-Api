const express = require('express');
const bodyParser = require('body-parser');
const { 
  v4: uuidv4,
} = require('uuid');

/* 
the standard response status code for http methods 
1. 2XX -> for sucsess like 200 for sucsess ,201  for created etc.
2. 3XX -> for partial sucsess cases 
  3. 4XX -> for unuthorised access , 400 for bad reqest ,404 for not found
  5. 5XX -> for server error   
*/ 

const app = express();

app.use(bodyParser.json());

// Sample data
let books = [
  // { id: 1, title: 'Book 1', author: 'Author 1' },
  // { id: 2, title: 'Book 2', author: 'Author 2' },
];

// to keep all the todos coming from the client 
let todos = [
  {id:uuidv4(),heading:"bkn",discription:"go to bkn"},
  {id:uuidv4(),heading:"jpr",discription:"go to jaipur"},
  {id:uuidv4(),heading:"hello",discription:"hello world"},
  
];

// GET all books
app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/todo', (req, res) => {
  res.json(todos);
});


// GET a single book by ID
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  res.json(book);
});

// POST a new book
app.post('/books', (req, res) => {
  const { id, title, author } = req.body;
  const book = { id, title, author };
  books.push(book);
  
  res.status(201).json({ message: 'Book created', book });
});

app.post('/todo', (req, res) => {
  const { heading,discription } = req.body;

  const todo = { id:uuidv4(),heading,discription };
  todos.push(todo);
  res.status(201).json({ message: 'todo created', todo });
});



// PUT/update a book
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const updatedBook = { id: bookId, title, author };
  books[bookIndex] = updatedBook;

  res.json({ message: 'Book updated', book: updatedBook });
});
 

app.put('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  console.log(todoId);
  console.log(req.params);
  const { heading,discription } = req.body;
  const index = todos.findIndex((todo) => todo.id === todoId);

  if (index === -1) {
    return res.status(404).json({ message: 'todo not found' });
  }

  const updatedTodo = { id:todoId,heading,discription };
  todos[index] = updatedTodo;

  res.json({ message: 'todo updated', todo: updatedTodo });
});
 


// DELETE a book
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];

  res.json({ message: 'Book deleted', book: deletedBook });
});



app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const index = todos.findIndex((b) => b.id === todoId);

  if (index === -1) {
    return res.status(404).json({ message: 'todo not found' });
  }

  const deletedTodo = todos.splice(index, 1)[0];

  res.json({ message: 'todo deleted', todo: deletedTodo });
});






// Start the server
app.listen(3000, () => {
  console.log("server is running on port 3000...");
});
