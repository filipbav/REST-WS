function showResult(text) {
    document.getElementById('output').textContent = text;
}

async function registerResultat(payload) {
    showResult('Sending...');
    try {
        const res = await fetch('/ladok/reg_resultat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const text = await res.text();
        let body;
        try { body = JSON.parse(text); } catch { body = text; }
        showResult(`HTTP ${res.status} — ${JSON.stringify(body)}`);
    } catch (err) {
        showResult('Network error: ' + (err && err.message ? err.message : err));
    }
}

// knapp för registrering av resultat
document.getElementById('registerBtn').addEventListener('click', () => {
    const payload = {
        Personnummer: document.getElementById('personnummer').value,
        Kurskod: document.getElementById('kurskod').value,
        Modul: document.getElementById('modul').value,
        Datum: document.getElementById('datum').value,
        Betyg: document.getElementById('betyg').value
    };
    registerResultat(payload);
});