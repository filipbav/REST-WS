// för ladok

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
    return /^[A-Z]\d{4}[A-Z]$/.test(kod);
}
function isValidModul(modul) {
    return /^\d{4}$/.test(modul);
}
function isValidDatum(datum) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) return false;
    const date = new Date(datum);
    return !isNaN(date.getTime());
}
function isValidBetyg(betyg) {
    return ['U', 'G', 'VG'].includes(betyg);
}

// Hanterar registrering av resultat
function handleRegResultat(req, res, dbLadok) {
    let body = '';

    req.on('data', chunk => { body += chunk.toString(); });

    req.on('end', () => {
        let data;
        try {
            data = JSON.parse(body);
        } catch (e) {
            return sendJson(res, 400, 'ogiltig_json');
        }

        const requiredFields = ['Personnummer', 'Kurskod', 'Modul', 'Datum', 'Betyg'];
        const missing = requiredFields.filter(f => !data[f]);
        if (missing.length > 0) {
            return sendJson(res, 400, 'saknar_falt');
        }

        if (!isValidPersonnummer(data.Personnummer)) return sendJson(res, 400, 'ogiltigt_personnummer');
        if (!isValidKurskod(data.Kurskod)) return sendJson(res, 400, 'ogiltig_kurskod');
        if (!isValidModul(data.Modul)) return sendJson(res, 400, 'ogiltig_modul');
        if (!isValidDatum(data.Datum)) return sendJson(res, 400, 'ogiltigt_datum');
        if (!isValidBetyg(data.Betyg)) return sendJson(res, 400, 'ogiltigt_betyg');

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