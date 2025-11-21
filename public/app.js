
const kursSelect = document.getElementById("testKursDropdown");

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

async function loadKurser() {
    try {
        const res = await fetch("/canvas/kurser");
        const kurser = await res.json();

        kursSelect.innerHTML = '<option value="">-- Välj kurs --</option>';

        kurser.forEach(k => {
            const opt = document.createElement("option");
            opt.value = k.kurskod;
            opt.textContent = `${k.kurskod} – ${k.kursnamn}`;
            kursSelect.appendChild(opt);
        });
    } catch (err) {
        output.textContent = "Fel vid hämtning av kurser.";
    }
}

loadKurser();

//  Ladda studentresultat 
btn.addEventListener("click", async () => {
    const id = inlamningSelect.value;

    if (!id) {
        output.textContent = "Välj en inlämningsuppgift först!";
        return;
    }

    const res = await fetch(`/canvas/inlamning/${id}`);
    const resultat = await res.json();

    output.textContent = JSON.stringify(resultat, null, 2);
});

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