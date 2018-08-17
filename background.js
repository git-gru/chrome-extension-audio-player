chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(
            tabs[0].id,
            { file: 'content-script.js' });
    });
});