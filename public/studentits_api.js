// studentits_api.js
const http = require('http');
const url = require('url');
const dbStudentITS = require('./db_studentITS');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'GET' && parsedUrl.pathname === '/studentits/get_persnummer') {
    const username = parsedUrl.query.username;

    if (!username) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'username saknas' }));
      return;
    }

    const row = dbStudentITS.getPersnummerByUsername(username);

    if (!row) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Student hittades inte' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      username: username,
      personnummer: row.personnummer
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(3002, () => {
  console.log('StudentITS lyssnar på port 3002');
});
