function showResult(text) {
    document.getElementById('output').textContent = text;
}

async function postPayload(payload) {
    showResult('Sending...');
    try {
        const res = await fetch('/reg_Resultat', {
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

document.getElementById('registerBtn').addEventListener('click', () => {
    const payload = {
        Personnummer: document.getElementById('personnummer').value,
        Kurskod: document.getElementById('kurskod').value,
        Modul: document.getElementById('modul').value,
        Datum: document.getElementById('datum').value,
        Betyg: document.getElementById('betyg').value
    };
    postPayload(payload);
});