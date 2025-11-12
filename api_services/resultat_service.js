// för ladok

// För JSON-svar
function sendJson(res, statusCode, status) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
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
    const data = req.body;

    // Kollar att alla nödvändiga fält finns
    const requiredFields = ['Personnummer', 'Kurskod', 'Modul', 'Datum', 'Betyg'];
    const missing = requiredFields.filter(f => !data[f]);
    if (missing.length > 0) {
        return res.status(400).json({ status: 'hinder' });
    }

    // Validerar formatet
    if (!isValidPersonnummer(data.Personnummer)) return res.status(400).json({ status: 'hinder' });
    if (!isValidKurskod(data.Kurskod)) return res.status(400).json({ status: 'hinder' });
    if (!isValidModul(data.Modul)) return res.status(400).json({ status: 'hinder' });
    if (!isValidDatum(data.Datum)) return res.status(400).json({ status: 'hinder' });
    if (!isValidBetyg(data.Betyg)) return res.status(400).json({ status: 'hinder' });

    // Försöker lägga till resultatet i databasen
    try {
        dbLadok.addResult(
            data.Personnummer,
            data.Kurskod,
            data.Modul,
            data.Datum,
            data.Betyg
        );
        res.status(201).json({ status: 'registrerad' });
    } catch (err) {
        res.status(500).json({ status: 'hinder' });
    }
}

module.exports = { handleRegResultat };