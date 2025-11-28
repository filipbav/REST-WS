// för ladok

const dbLadok = require('../databases/db_ladok'); 

// För JSON-svar
function sendJson(res, statusCode, status) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
    });
    res.end(JSON.stringify({ status }));
}

// Ser till att personnummer, kurskod, modul, datum och betyg är i korrekt format
function isValidPersonnummer(pnr) {
    return /^\d{8}-\d{4}$/.test(pnr);
}
function isValidKurskod(kod) {
    // Exempel som godkanns: D0031N, DB103, MA142, etc
    return /^[A-Z]{1,3}\d{3,4}[A-Z]?$/.test(kod);
}
function isValidModul(modul) {
    // Tillat 3 eller 4 siffror, t.ex. 007 eller 0005
    return /^\d{3,4}$/.test(modul);
}

// Datum i formatet ÅÅÅÅ-MM-DD
function isValidDatum(datum) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) return false;
    const date = new Date(datum);
    return !isNaN(date.getTime());
}
// Betyg: U, G, VG
function isValidBetyg(betyg) {
    return ['U', 'G', 'VG'].includes(betyg);
}

// Hanterar registrering av resultat
function handleRegResultat(req, res) {
    let body = '';

    req.on('data', chunk => { body += chunk.toString(); });

    
    req.on('end', () => {
        let data;
        try {
            data = JSON.parse(body);
        } catch (e) {
            return sendJson(res, 400, 'ogiltig_json');
        }

        // Kontrollera att alla obligatoriska fält finns med
        const requiredFields = ['Personnummer', 'Kurskod', 'Modul', 'Datum', 'Betyg'];
        const missing = requiredFields.filter(f => !data[f]);
        if (missing.length > 0) {
            return sendJson(res, 400, 'saknar_falt');
        }

        // Validera varje fält
        if (!isValidPersonnummer(data.Personnummer)) return sendJson(res, 400, 'ogiltigt_personnummer');
        if (!isValidKurskod(data.Kurskod)) return sendJson(res, 400, 'ogiltig_kurskod');
        if (!isValidModul(data.Modul)) return sendJson(res, 400, 'ogiltig_modul');
        if (!isValidDatum(data.Datum)) return sendJson(res, 400, 'ogiltigt_datum');
        if (!isValidBetyg(data.Betyg)) return sendJson(res, 400, 'ogiltigt_betyg');

        // Försök registrera resultatet i databasen
        try {
            dbLadok.addResult(
                data.Personnummer,
                data.Kurskod,
                data.Modul,
                data.Datum,
                data.Betyg
            );
            sendJson(res, 201, 'registrerad');
        } catch (err) {
            sendJson(res, 500, 'databasfel');
        }
    });

    req.on('error', () => sendJson(res, 400, 'request_error'));
}

module.exports = { handleRegResultat };