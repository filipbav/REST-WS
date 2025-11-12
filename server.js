const express = require('express');
const path = require('path');

// importera databaser
const dbStudentITS = require('./databases/db_studentITS');
const dbLadok = require('./databases/db_ladok');
const dbEpok = require('./databases/db_epok');
const dbCanvas = require('./databases/db_canvas');

// importera tjänster
const resultatService = require('./api_services/resultat_service');

const app = express();
const publicDir = path.join(__dirname, 'public');
const PORT = 3000;

// Middleware för att parsa JSON
app.use(express.json());

// Servera statiska filer
app.use(express.static(publicDir));

// POST /reg_Resultat (Ladok-tjänst)
app.post('/reg_Resultat', (req, res) => {
    resultatService.handleRegResultat(req, res, dbLadok);
});

// Fallback för 404
app.use((req, res) => {
    res.status(404).send('File not found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
