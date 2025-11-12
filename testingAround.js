const dbLadok = require('./databases/db_ladok');

function printAllLadokResults() {
    const results = dbLadok.getAllResults();
    console.log('All Ladok Results:');
results.forEach(result => {
    console.log(
        `ID: ${result.ID}, Personnummer: ${result.Personnummer}, Kurskod: ${result.Kurskod}, Modul: ${result.Modul}, Datum: ${result.Datum}, Betyg: ${result.Betyg}`
    );
});
}

// Call the function
printAllLadokResults();