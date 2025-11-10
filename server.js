// hantering av server
const http = require('http');
const fs = require('fs');
const path = require('path');

const dbStudentITS = require('./databases/db_studentITS');
const dbLadok = require('./databases/db_ladok');
const dbEpok = require('./databases/db_epok');
const dbCanvas = require('./databases/db_canvas');

const publicDir = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {

    // API ROUTE EXAMPLE
    if (req.url === "/api/testapi") {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Test API is working!" }));
    }

    // STATIC FILE HANDLING
    let filePath = req.url === '/' 
        ? path.join(publicDir, 'index.html')
        : path.join(publicDir, req.url);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            return res.end('File not found');
        }

        res.writeHead(200);
        res.end(content);
    });

});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
