(function () {

    if (window.hasRun) {
        return
    }

    window.hasRun = true;
    let average_bonus = 0;
    let clicked_el;
    const div = document.createElement("div");
    div.innerHTML = '<tr><td style="height:10px;"><div id="GInterface.Instances[2].Instances[1].Instances[0]_Grille_Elements_statut_14" style="background-color: white; color: rgb(192, 0, 0); height: 13px;" class="EtiquetteCours"><div class="NoWrap ie-ellipsis" style="margin:0px 1px; position:relative;width:298px;" data-tooltip="ellipsis">Cours annulé</div></div></td></tr>';
    const cancelled_class = div.firstChild;
    for (const button of document.querySelectorAll(".button-cancelled")) {
        button.remove();
    }
    const button_cancelled = document.createElement("button");
    button_cancelled.className = "button-cancelled";
    button_cancelled.textContent = "Annuler le cours";
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = browser.runtime.getURL("pronote.css");
    document.head.appendChild(el);

    function getUserImage(nb_tries) {
        return new Promise((resolve, reject) => {
            const parent = document.getElementsByClassName("ibe_util_photo");
            let user_img;
            if (parent.length && parent[0].children.length > 0) {
                user_img = parent[0].children[0];
            }
            if (user_img) {
                resolve(user_img);
            } else {
                if (nb_tries < 100) {
                    setTimeout(() => {
                        getUserImage(nb_tries+1)
                        .then((p) => resolve(p))
                        .catch((p) => reject(p));
                    }, 100);
                }
                else {
                    reject();
                }
            }
        });
    }

    function onUserImage(user_img) {
        browser.storage.local.get("pronote_pfp").then((p) => {
            const img_url = p.pronote_pfp;
            if (img_url) {
                user_img.src = img_url;
                user_img.style.width = "100%;";
                user_img.style.maxHeight = "100%";
            }
        });
    }

    function getUserName(nb_tries) {
        return new Promise((resolve, reject) => {
            const name_div = document.querySelector(".ibe_util_texte.ibe_actif");
            if (name_div) {
                resolve(name_div);
            } else {
                if (nb_tries < 100) {
                    setTimeout(() => {
                        getUserName(nb_tries+1)
                        .then((p) => resolve(p))
                        .catch((p) => reject(p));
                    }, 100);
                }
                else {
                    reject();
                }
            }
        });
    }

    function onUserName(name_div) {
        browser.storage.local.get("pronote_name").then((p) => {
            const name = p.pronote_name;
            if (name) {
                name_div.textContent = "Espace Élèves - " + name;
            }
        });
    }

    getUserImage(0).then(user_img => onUserImage(user_img))
    .catch(() => {
        console.log("Impossible de modifier la photo de profil");
    });

    getUserName(0).then(name_div => onUserName(name_div))
    .catch(() => {
        console.log("Impossible de modifier le nom");
    });

    browser.storage.local.get("pronote_bonus").then((p) => {
        const bonus = p.pronote_bonus;
        if (bonus) {
            average_bonus = parseFloat(bonus) || 0;
        }
    });

    new MutationObserver(() => {
        const average_div = document.querySelector(".total-content");
        if (average_div) {
            const average_node = average_div.querySelector(".ie-titre-gros.m-left");
            if (average_node && !average_node.dataset.modified) {
                average_node.dataset.modified = "true";
                let average = parseFloat(average_node.textContent.replace(",", "."));
                average += average_bonus;
                average_node.textContent = average.toFixed(2).replace(".", ",");
            }
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });

    document.addEventListener("contextmenu", (event) => {
        clicked_el = event.target;
        if (clicked_el) {
            while (!clicked_el.matches(".EmploiDuTemps_Element")) {
                if (clicked_el.matches("body")) {
                    clicked_el = null;
                    break;
                }
                clicked_el = clicked_el.parentNode;
            }
        }
        if (clicked_el) {
            try {
                document.body.appendChild(button_cancelled);
            } catch (e) {}
            button_cancelled.style.left = (event.clientX + 20) + "px";
            button_cancelled.style.top = event.clientY + "px";
            button_cancelled.style.display = "";
        }
        }, true);

    button_cancelled.addEventListener("click", () => {
        button_cancelled.style.display = "none";
        if (!clicked_el) return;
        let tbody
        try {
            tbody = clicked_el.firstChild.firstChild.firstChild;
        } catch (e) {return}
        if (tbody.nodeName != "TBODY" || tbody.children.length != 1) return;
        let td
        try {
            td = tbody.firstChild.firstChild;
        } catch (e) {return}
        if (td.nodeName != "TD") return;
        if (td.children.length > 3) {
            td.children[td.children.length-1].remove()
        }
        tbody.insertBefore(cancelled_class.cloneNode(true), tbody.firstChild);
    });

    document.body.addEventListener("click", () => {
        button_cancelled.style.display = "none";
    })

})();