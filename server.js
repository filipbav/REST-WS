// hantering av server
const http = require('http');
const fs = require('fs');
const path = require('path');



// importera tjänster
const resultatService = require('./api_services/resultat_service');
const canvasApi = require('./api_services/canvas_api');
const studentitsService = require('./api_services/studentits_service'); 
const epok_api = require("./api_services/epok_api");


const publicDir = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    console.log(`${new Date().toISOString()} ${req.method} ${pathname}`); // logg

    
    // EPOK tjänst: hämta moduler för kurskod
    if (req.method === 'GET' && pathname.startsWith('/epok/moduler/')) {
        const parts = pathname.split('/');
        const kurskod = parts[3]; // alltid först

        epok_api.handleGetModuler(req, res, kurskod);
        return;
    }

    // GET /canvas/kurser
    if (req.method === 'GET' && pathname === '/canvas/kurser') {
        canvasApi.handleGetKurser(req, res);
        return;
    }

    // GET /canvas/kurs/:kurskod/inlamningar
    if (req.method === 'GET' && pathname.startsWith('/canvas/kurs/')) {
        const parts = pathname.split('/');
        const kurskod = parts[3];
        canvasApi.handleGetInlamningarKurs(req, res, kurskod);
        return;
    }

    // GET /canvas/modul/:modulkod/inlamningar
    if (req.method === 'GET' && pathname.startsWith('/canvas/modul/')) {
        const parts = pathname.split('/');
        const modulkod = parts[3];
        canvasApi.handleGetInlamningarModul(req, res, modulkod);
        return;
    }

    // GET /canvas/inlamning/:id
    if (req.method === 'GET' && pathname.startsWith('/canvas/inlamning/')) {
        const parts = pathname.split('/');
        const inlamningsid = parts[3];
        canvasApi.handleGetResultat(req, res, inlamningsid);
        return;
    }

    // Ladok tjänst: reg_resultat (POST /ladok/reg_resultat)
    if (
        req.method === 'POST' &&
        (pathname === '/ladok/reg_resultat' || pathname === '/ladok/reg_resultat/')
    ) {
        resultatService.handleRegResultat(req, res);
        return;
    }
        
    // GET /studentits/get_persnummer?username=xxx
    if (req.method === 'GET' && pathname === '/studentits/get_persnummer') {
        const username = parsedUrl.searchParams.get('username');
        studentitsService.handleGetPersnummer(req, res, username);
        return;
    }

    // GET /itsadmin/studenter  (adminvy: lista alla studenter)
    if (req.method === 'GET' && pathname === '/itsadmin/studenter') {
        studentitsService.handleGetAllStudents(req, res);
        return;
    }

    // Only serve static files for GET requests
    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        return res.end('Method Not Allowed');
    }

    // STATIC FILE SERVING
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
