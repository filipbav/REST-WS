//testdatabas by kim
const Database = require('better-sqlite3');
const http = require('http');

const db = new Database('databas-rest-ws.db');

// skapa databas
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`).run();

// testdata
db.prepare('INSERT INTO users (name) VALUES (?)').run('TestStudent');

// server localhost:3000
const server = http.createServer((req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
});

// startar servern
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});