(function() {

    browser.browserAction.onClicked.addListener(() => {
        browser.runtime.openOptionsPage();
    });

    browser.contextMenus.create({
        id: "edt_actions",
        title: "Annuler le cours",
        contexts: ["page"]
    });

    browser.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === "edt_actions") {
            browser.tabs.sendMessage(tab.id, {
                type: "edt_actions"
            }).then(() => {})
            .catch(() => {});
        }
    });

    browser.runtime.onMessage.addListener(message => {
        if (message.type === "edt-action") {
            if (message.action) {
                browser.contextMenus.create({
                    id: "edt_actions",
                    title: "Annuler le cours",
                    contexts: ["page"]
                });
            } else {
                browser.contextMenus.remove("edt_actions")
                .then(() => {}).catch(() => {});
            }
        }
    })

})();