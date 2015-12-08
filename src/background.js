function updateIcon(enabled) {
    chrome.browserAction.setIcon({
        path: enabled ? "icon.png" : "icon-disabled.png"
    })
    chrome.browserAction.setTitle({
        "title": enabled ? "Prices are hidden. Click to show!" : "Click to hide prices"
    });
}

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.storage.sync.get("enabled", function (val) {
        var isEnabled = (val && val.enabled);

        var newState = !isEnabled;
        chrome.storage.sync.set({ "enabled": newState }, function () {
            updateIcon(newState);

            chrome.runtime.sendMessage({ from: "HideThePrices", enabled: newState });
        })
    });
});

chrome.storage.sync.get("enabled", function (val) {
    updateIcon(val.enabled);
    
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, { from: "HideThePrices", enabled: val.enabled }, function (response) {
            });
        }
    });
});