// DOM-referenser
const kursSelect = document.getElementById("testKursDropdown");
const modulSelect = document.getElementById("modulSelect");
const inlamningSelect = document.getElementById("inlamningSelect");
const ladokModulSelect = document.getElementById("ladokModulSelect");
const studentTableBody = document.querySelector("#studentTable tbody");
const registerFromTableBtn = document.getElementById("registerFromTableBtn");
const output = document.getElementById("output");

// Hjälpfunktioner
function showResult(text) {
    if (output) {
        output.textContent = String(text);
    } else {
        console.log(text);
    }
}

// Ladda kurser (Canvas)
async function loadKurser() {
    if (!kursSelect) return;

    try {
        const res = await fetch("/canvas/kurser");
        if (!res.ok) throw new Error("HTTP " + res.status);

        const kurser = await res.json();
        kursSelect.innerHTML = '<option value="">-- Valj kurs --</option>';

        (kurser || []).forEach(k => {
            const opt = document.createElement("option");
            opt.value = k.kurskod;
            opt.textContent = `${k.kurskod} – ${k.kursnamn}`;
            kursSelect.appendChild(opt);
        });
    } catch (err) {
        console.error("Fel vid hamtning av kurser:", err);
        showResult("Fel vid hamtning av kurser.");
    }
}

// Ladda moduler (Epok) nar kurs valts
async function loadModuler() {
    if (!kursSelect || !modulSelect || !ladokModulSelect) return;

    // Rensa ev. gamla statusmeddelanden
    showResult("");

    const kurskod = kursSelect.value;

    // Töm listor vid byte av kurs
    modulSelect.innerHTML = '<option value="">-- Valj modul --</option>';
    ladokModulSelect.innerHTML = '<option value="">-- Valj Ladok-modul --</option>';

    // Nollställ inlämning + tabell när kurs byts
    if (inlamningSelect) {
        inlamningSelect.innerHTML = '<option value="">-- Valj modul forst --</option>';
    }
    if (studentTableBody) {
        studentTableBody.innerHTML = "";
    }

    if (!kurskod) return;

    try {
        const res = await fetch(`/epok/moduler/${encodeURIComponent(kurskod)}`);
        if (!res.ok) throw new Error("HTTP " + res.status);

        const moduler = await res.json();

        (moduler || []).forEach(m => {
            // Epok -> modulSelect
            const opt = document.createElement("option");
            opt.value = m.modulkod;
            opt.textContent = `${m.modulkod} – ${m.benamning}`;
            modulSelect.appendChild(opt);

            // Epok -> ladokModulSelect
            const opt2 = document.createElement("option");
            opt2.value = m.modulkod;
            opt2.textContent = `${m.modulkod} – ${m.benamning}`;
            ladokModulSelect.appendChild(opt2);
        });
    } catch (err) {
        console.error("Fel vid hamtning av moduler:", err);
        showResult("Fel vid hamtning av moduler.");
    }
}

// Ladda inlamningar for vald modul (Canvas)
async function loadInlamningarForModul() {
    if (!modulSelect || !inlamningSelect) return;

    // Rensa ev. gamla statusmeddelanden
    showResult("");

    const modulkod = modulSelect.value;

    // Rensa tabell vid modulbyte
    if (studentTableBody) {
        studentTableBody.innerHTML = "";
    }

    if (!modulkod) {
        inlamningSelect.innerHTML = '<option value="">-- Valj modul forst --</option>';
        return;
    }

    try {
        const res = await fetch(`/canvas/modul/${encodeURIComponent(modulkod)}/inlamningar`);
        if (!res.ok) throw new Error("HTTP " + res.status);

        const inlamningar = await res.json();

        inlamningSelect.innerHTML = '<option value="">-- Valj inlamning --</option>';

        (inlamningar || []).forEach(i => {
            const opt = document.createElement("option");
            opt.value = i.inlamningsid;
            opt.textContent = i.titel;
            inlamningSelect.appendChild(opt);
        });
    } catch (err) {
        console.error("Fel vid hamtning av inlamningar:", err);
        showResult("Fel vid hamtning av inlamningar.");
    }
}

// Ladda studentlista for vald inlamning 
async function loadStudenterForInlamning() {
    if (!inlamningSelect || !studentTableBody) return;

    // Rensa ev. gamla statusmeddelanden
    showResult("");

    const id = inlamningSelect.value;

    // Tom tabell om ingen inlamning vald
    if (!id) {
        studentTableBody.innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`/resultat/studentlista/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error("HTTP " + res.status);

        const students = await res.json();

        studentTableBody.innerHTML = ""; // rensa tabell

        (students || []).forEach(s => {
            const tr = document.createElement("tr");

            // Spara data vi behover for Ladok
            tr.dataset.personnummer = s.personnummer || "";
            tr.dataset.datum = s.examinationsdatum || "";

            // Det betyg som kommer fran Canvas
            const canvasBetyg = s.canvasBetyg || "";

            tr.innerHTML = `
                <td><input type="checkbox" class="reg-check" checked></td>
                <td>${s.namn || ""}</td>
                <td>${s.personnummer || ""}</td>
                <td>${canvasBetyg}</td>
                <td>${s.examinationsdatum || ""}</td>
                <td>
                    <input 
                        type="text" 
                        class="ladok-betyg-input" 
                        value="${canvasBetyg}" 
                        style="width:60px;"
                    >
                </td>
            `;

            studentTableBody.appendChild(tr);
        });

        if (!students || students.length === 0) {
            showResult("Inga studenter hittades for denna inlamning.");
        } else {
            showResult(`Laddade ${students.length} studenter.`);
        }
    } catch (err) {
        console.error("Fel vid hamtning av studentlista:", err);
        showResult("Fel vid hamtning av studentlista.");
    }
}

// Anropa Ladok-API på din server
async function registerResultat(payload) {
    try {
        const res = await fetch("/ladok/reg_resultat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        let body;
        try {
            body = JSON.parse(text);
        } catch {
            body = text;
        }

        // Visa senaste svaret (kan skrivas över sedan i batch)
        showResult(`Ladok-svar: HTTP ${res.status} — ${JSON.stringify(body)}`);

        if (!res.ok) {
            throw new Error("Ladok fel: " + res.status);
        }

        return body;
    } catch (err) {
        console.error("Natt gick fel vid anrop till /ladok/reg_resultat:", err);
        showResult("Natt gick fel vid anrop till Ladok.");
        throw err;
    }
}

// Registrera alla markerade studenter i tabellen
async function registerFromTable() {
    if (!kursSelect || !ladokModulSelect || !studentTableBody) return;

    const kurskod = kursSelect.value;
    const modul = ladokModulSelect.value;

    if (!kurskod || !modul) {
        showResult("Valj kurskod och Ladok-modul forst.");
        return;
    }

    const rows = studentTableBody.querySelectorAll("tr");
    if (rows.length === 0) {
        showResult("Det finns inga studenter i tabellen.");
        return;
    }

    let skickade = 0;
    let fel = 0;

    for (const tr of rows) {
        const checkbox = tr.querySelector(".reg-check");
        if (!checkbox || !checkbox.checked) continue;

        const personnummer = tr.dataset.personnummer || "";
        let datum = tr.dataset.datum || "";

        const betygInput = tr.querySelector(".ladok-betyg-input");
        const betyg = betygInput ? betygInput.value.trim() : "";

        // Frontend-validering: tillåt bara U, G, VG
        const tillatnaBetyg = ["U", "G", "VG"];
        if (!tillatnaBetyg.includes(betyg)) {
            showResult(`Fel: "${betyg}" ar inte ett giltigt betyg. Endast U, G och VG ar tillatna.`);
            fel++;
            continue; // hoppa over denna student
        }

        if (!personnummer || !betyg) {
            console.warn("Saknar personnummer eller betyg, hoppar over rad:", tr);
            fel++;
            continue;
        }

        // fallback om datum saknas
        if (!datum) {
            datum = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        }

        const payload = {
            Personnummer: personnummer,
            Kurskod: kurskod,
            Modul: modul,
            Datum: datum,
            Betyg: betyg
        };

        try {
            await registerResultat(payload);
            skickade++;
        } catch (e) {
            console.error("Fel vid registrering for", personnummer, e);
            fel++;
        }
    }

    showResult(`Fardig. Registrerade ${skickade} resultat, misslyckade: ${fel}.`);
}

// eventlyssnare
if (kursSelect) {
    kursSelect.addEventListener("change", loadModuler);
}

if (modulSelect) {
    modulSelect.addEventListener("change", loadInlamningarForModul);
}

if (inlamningSelect) {
    inlamningSelect.addEventListener("change", loadStudenterForInlamning);
}

if (registerFromTableBtn) {
    registerFromTableBtn.addEventListener("click", () => {
        registerFromTable().catch(err => {
            console.error("Ovantat fel i registerFromTable:", err);
        });
    });
}

// Init
loadKurser().catch(err => {
    console.error("Fel i loadKurser:", err);
});
