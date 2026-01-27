const edit_pfp_button = document.getElementById("edit-pfp");
const image_input = document.querySelector("#image-input");
const edit_name_button = document.querySelector("#edit-name");
const average_bonus = document.querySelector("#added-points input");

edit_pfp_button.addEventListener("click", () => {
    image_input.click();
});

image_input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
        await browser.storage.local.set({
            pronote_pfp: reader.result
        });
    };

    reader.readAsDataURL(file);
});

edit_name_button.addEventListener("click", async () => {
    const name = prompt("Nom personnalisé :");
    await browser.storage.local.set({
        pronote_name: name
    });
});

average_bonus.addEventListener("change", async (e) => {
    await browser.storage.local.set({
        pronote_bonus: e.target.value
    });
});

browser.storage.local.get("pronote_bonus").then((p) => {
    const bonus = p.pronote_bonus;
    if (bonus) {
        average_bonus.value = bonus;
    }
});