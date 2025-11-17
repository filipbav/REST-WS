


const kursSelect = document.getElementById("testKursDropdown");
const inlamningSelect = document.getElementById("testInlamningDropdown");
const output = document.getElementById("testOutput");
const btn = document.getElementById("testLoadResultat");

//  Hämta alla kurser vid sidladdning 
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


// När användaren väljer en kurs -> hämta inlämningar
kursSelect.addEventListener("change", async () => {
    const kurskod = kursSelect.value;

    if (!kurskod) {
        inlamningSelect.innerHTML = '<option>-- Välj kurs först --</option>';
        return;
    }

    const res = await fetch(`/canvas/kurs/${kurskod}/inlamningar`);
    const inlamningar = await res.json();

    inlamningSelect.innerHTML = '<option value="">-- Välj inlämning --</option>';

    inlamningar.forEach(i => {
        const opt = document.createElement("option");
        opt.value = i.inlamningsid;
        opt.textContent = i.titel;
        inlamningSelect.appendChild(opt);
    });
});


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
