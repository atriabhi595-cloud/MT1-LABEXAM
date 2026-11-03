// Part A: HTTP module, routing, methods, static file serving with FS (no Express)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// In-memory "database"
const books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: 350 },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', price: 450 },
  { id: 3, title: 'Wings of Fire', author: 'A. P. J. Abdul Kalam', price: 300 }
];

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
};

const sendHTML = (res, statusCode, html) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/html' });
  res.end(html);
};

const server = http.createServer((req, res) => {
  const { method } = req;
  const url = req.url.split('?')[0];

  // GET /
  if (url === '/' && method === 'GET') {
    return sendHTML(res, 200, '<h1>Welcome to the Library Book Management System</h1><p>Try /books, /about or /home</p>');
  }

  // GET /books
  if (url === '/books' && method === 'GET') {
    return sendJSON(res, 200, books);
  }

  // GET /about
  if (url === '/about' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Library Book Management App - built with the Node.js HTTP module, FS module and Express.js.');
  }

  // GET /home  (static file using FS module)
  if (url === '/home' && method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    return fs.readFile(filePath, (err, content) => {
      if (err) {
        return sendHTML(res, 500, '<h1>500 - Error reading file</h1>');
      }
      sendHTML(res, 200, content);
    });
  }

  // POST /add-book
  if (url === '/add-book' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      let book;
      try {
        book = JSON.parse(body);
      } catch {
        return sendJSON(res, 400, { error: 'Invalid JSON format' });
      }

      const { id, title, author, price } = book;
      if (id === undefined || !title || !author || price === undefined) {
        return sendJSON(res, 400, { error: 'id, title, author and price are required' });
      }
      if (books.some((b) => b.id === id)) {
        return sendJSON(res, 409, { error: 'Book with this id already exists' });
      }

      const newBook = { id, title, author, price };
      books.push(newBook);
      sendJSON(res, 201, { message: 'Book added successfully', book: newBook });
    });
    return;
  }

  // Known route, wrong method
  if (['/', '/books', '/about', '/home', '/add-book'].includes(url)) {
    return sendJSON(res, 405, { error: 'Method not allowed' });
  }

  // Invalid route
  sendHTML(res, 404, '<h1>404 - Page Not Found</h1>');
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
