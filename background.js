(function() {

    browser.browserAction.onClicked.addListener(() => {
        browser.runtime.openOptionsPage();
    });

})();