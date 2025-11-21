
const kursSelect = document.getElementById("testKursDropdown");
const modulSelect = document.getElementById("modulSelect");
const inlamningSelect = document.getElementById("inlamningSelect");




function showResult(text) {
    document.getElementById('output').textContent = text;
}


if (kursSelect)kursSelect.addEventListener("change", loadModuler);
async function loadModuler() {
    const kurskod = kursSelect ? kursSelect.value : '';
    if (!modulSelect) return console.error('Element #modulSelect saknas i DOM');

    if (!kurskod) {
        modulSelect.innerHTML = '<option value="">-- Välj modul --</option>';
        return;
    }

    try {
        const res = await fetch(`/epok/moduler/${encodeURIComponent(kurskod)}`);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const moduler = await res.json();

        modulSelect.innerHTML = '<option value="">-- Välj modul --</option>';
        (moduler || []).forEach(m => {
            const opt = document.createElement("option");
            opt.value = m.modulkod;
            opt.textContent = `${m.modulkod} – ${m.benamning}`;
            modulSelect.appendChild(opt);
        });
    } catch (err) {
        console.error("Fel vid hämtning av moduler:", err);
        showResult('Fel vid hämtning av moduler: ' + (err.message || err));
    }
}

modulSelect.addEventListener("change", async () => {
    const modulkod = modulSelect.value;

    if (!modulkod) {
        inlamningSelect.innerHTML = '<option>-- Välj modul först --</option>';
        return;
    }

    const res = await fetch(`/canvas/modul/${modulkod}/inlamningar`);
    const inlamningar = await res.json();

    inlamningSelect.innerHTML = '<option value="">-- Välj inlämning --</option>';

    inlamningar.forEach(i => {
        const opt = document.createElement("option");
        opt.value = i.inlamningsid;
        opt.textContent = i.titel;
        inlamningSelect.appendChild(opt);
    });
});

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