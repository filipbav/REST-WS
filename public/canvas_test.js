


const kursSelect = document.getElementById("testKursDropdown");
const inlamningSelect = document.getElementById("testInlamningDropdown");
const output = document.getElementById("testOutput");
const btn = document.getElementById("testLoadResultat");






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
