// för ladok
function sendJson(res, statusCode, status) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status }));
}

function handleRegResultat(req, res, dbLadok) {
    let body = '';

    req.on('data', chunk => { body += chunk.toString(); });

    req.on('end', () => {
        let data;
        try {
            data = JSON.parse(body);
        } catch (e) {
            return sendJson(res, 400, 'hinder');
        }

        const requiredFields = ['Personnummer', 'Kurskod', 'Modul', 'Datum', 'Betyg'];
        const missing = requiredFields.filter(f => !data[f]);
        if (missing.length > 0) {
            return sendJson(res, 400, 'hinder');
        }

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
            sendJson(res, 500, 'hinder');
        }
    });

    req.on('error', () => sendJson(res, 400, 'hinder'));
}

module.exports = { handleRegResultat };