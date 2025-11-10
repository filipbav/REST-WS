// ladok databas
const Database = require('better-sqlite3');
const http = require('http');

// Ansluter till databasfilen
const db = new Database('databas-rest-ws.db');

// Skapa tabellen Resultat
db.prepare(`
    CREATE TABLE IF NOT EXISTS Resultat (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Personnummer TEXT NOT NULL,
        Kurskod TEXT NOT NULL,
        Modul TEXT NOT NULL,
        Datum DATE NOT NULL,
        Betyg TEXT NOT NULL
    )
`).run();


module.exports = {
    // Lägg till nytt resultat
    addResult(personnummer, kurskod, modul, datum, betyg) {
        const sql = `
            INSERT INTO Resultat (Personnummer, Kurskod, Modul, Datum, Betyg)
            VALUES (?, ?, ?, ?, ?)
        `;
        return db.prepare(sql).run(personnummer, kurskod, modul, datum, betyg);
    },

    // Hämta alla resultat för ett specifikt personnummer
    getResultsByPersonnummer(personnummer) {
        const sql = 'SELECT * FROM Resultat WHERE Personnummer = ?';
        return db.prepare(sql).all(personnummer); 
    },

    // Hämta alla resultat
    getAllResults() {
        return db.prepare('SELECT * FROM Resultat').all();
    }
};