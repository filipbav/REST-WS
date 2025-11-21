


const kursSelect = document.getElementById("testKursDropdown");
const inlamningSelect = document.getElementById("testInlamningDropdown");
const output = document.getElementById("testOutput");
const btn = document.getElementById("testLoadResultat");



// När användaren väljer en modul -> hämta inlämningar
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
