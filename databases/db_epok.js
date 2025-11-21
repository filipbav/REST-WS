//testdatabas flera
const Database = require('better-sqlite3');
const http = require('http');

const db = new Database('epok.db');

// skapa databas
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS modul (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kurskod TEXT NOT NULL,
    modulkod TEXT NOT NULL,
    benamning TEXT NOT NULL,
    tillstand TEXT DEFAULT 'Aktiv'
);
`).run();

// Testdata (ta bort sen)
db.prepare(`
INSERT INTO modul (kurskod, modulkod, benamning, tillstand)
VALUES ('D0031N', '0005', 'Inlämningsuppgift', 'Aktiv')
`).run();

db.prepare(`
INSERT INTO modul (kurskod, modulkod, benamning, tillstand)
VALUES ('D0031N', '0006', 'Projekt', 'Aktiv')
`).run();

// testdata
db.prepare('INSERT INTO users (name) VALUES (?)').run('TestStudent');

module.exports = {
    getAllUsers() {
        return db.prepare('SELECT * FROM users').all();
    },
    addUser(name) {
        return db.prepare('INSERT INTO users (name) VALUES (?)').run(name);
    },

    // Funktion som hämtar moduler tillhörande en kurskod
    getModulerByKurskod(kurskod) {
        return db.prepare(`
            SELECT modulkod, benamning
            FROM modul
            WHERE kurskod = ?
              AND tillstand = 'Aktiv'
        `).all(kurskod);
    }
};