// ladok databas

const Database = require('better-sqlite3');
const http = require('http');

// Ansluter till databasfilen
const db = new Database('ladok-databas.db');

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

// Lägg till mockdata om tabellen är tom
const rowCount = db.prepare('SELECT COUNT(*) AS count FROM Resultat').get().count;
if (rowCount === 0) {
    const insert = db.prepare(`
        INSERT INTO Resultat (Personnummer, Kurskod, Modul, Datum, Betyg)
        VALUES (?, ?, ?, ?, ?)
    `);
    insert.run('19900101-1234', 'D0031N', '0005', '2022-01-19', 'G');
    insert.run('19940613-2345', 'D0031N', '0001', '2022-01-19', 'VG');
    insert.run('19880505-5678', 'D0012E', '0005', '2022-02-10', 'U');
}


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