// hantering av server
const http = require('http');
const fs = require('fs');
const path = require('path');

// importera databaser
const dbStudentITS = require('./databases/db_studentITS');
const dbLadok = require('./databases/db_ladok');
const dbEpok = require('./databases/db_epok');
const dbCanvas = require('./databases/db_canvas');

// importera tjänster
const resultatService = require('./api_services/resultat_service');


const publicDir = path.join(__dirname, 'public');
const URL_RESULTAT = '/reg_Resultat'; // ladoks URL

const server = http.createServer((req, res) => {

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // Ladok tjänst: reg_Resultat (POST /reg_Resultat)
    if (req.method === 'POST' && pathname === URL_RESULTAT) {
        resultatService.handleRegResultat(req, res, dbLadok);
        return;
    }

    // Only serve static files for GET requests
    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        return res.end('Method Not Allowed');
    }

    // Minimal static file handling (no extra path sanitization per your request)
    const filePath = pathname === '/' 
        ? path.join(publicDir, 'index.html')
        : path.join(publicDir, pathname);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('File not found');
        }

        // basic content-type for common files
        const ext = path.extname(filePath).toLowerCase();
        const contentType = ext === '.js' ? 'text/javascript' : ext === '.css' ? 'text/css' : 'text/html';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });

});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
