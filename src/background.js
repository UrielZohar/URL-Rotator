const regexStartingWithHttpOrHttps =  /^https?:\/\//;
// variable to keep track of the current index in the URL list
let currentIndex = 0;

// variable to store the intervalId for the setInterval function
let intervalId;

// variable to store the ID of the current runnig tab
let currentRunnigTabId;

function setEnabledIcon() {
  chrome.action.setIcon({
    path: {
      "16": "icons/enabled_icon_16.png",
      "32": "icons/enabled_icon_16.png",
      "48": "icons/enabled_icon_16.png",
      "128": "icons/enabled_icon_16.png",
    }
  });
};

function setDisabledIcon() {
  chrome.action.setIcon({
    path: {
      "16": "icons/disabled_icon_16.png",
      "32": "icons/disabled_icon_32.png",
      "48": "icons/disabled_icon_48.png",
      "128": "icons/disabled_icon_128.png",
    }
  });
};

function setUrlListItemsInStorage(urlListItems, customListName) {
  if (customListName) {
    chrome.storage.local.set({ [customListName]: urlListItems });
  } else {
    chrome.storage.local.set({ urlListItems });
  }
};

// function to switch to the next tab in the URL list
function switchTab(urlListItems, tabSenderID) {
    // get the current active tab
    // get the next URL from the list
    const currentUrl = urlListItems[currentIndex].url;
    const currentTimeDuration = urlListItems[currentIndex].durationTime;
    const isStartingWithHttpOrHttps = regexStartingWithHttpOrHttps.test(currentUrl);
    // update the current tab to go to the next URL
    chrome.tabs.update(tabSenderID, {
      url: isStartingWithHttpOrHttps ? currentUrl : `http://${currentUrl}`,
    });
    // increment the current index 
    currentIndex = (currentIndex + 1) % urlListItems.length;
    intervalId = setTimeout(() => {
      switchTab(urlListItems, tabSenderID);
    }, currentTimeDuration * 1000);
}

// function to start the tab switching
function start(urlListItems, tabID) {
  // first stop the old one
  stop();
  switchTab(urlListItems, tabID);
}

// function to stop the tab switching
function stop() {
  // clear the interval
  intervalId && clearInterval(intervalId);
}


// listen for message from the popup to start/stop the tab switching
chrome.runtime.onMessage.addListener(
  function(request) {
    // get the ID of the sender tab
    // get the list from the sender tab
    if( request.message === "start" ) {
        const { urlListItems, customListName } = request.payload;
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
          // stop the old one
          stop();
          currentRunnigTabId = tabs[0].id;
          start(urlListItems, currentRunnigTabId);
          setEnabledIcon();
          setUrlListItemsInStorage(urlListItems, customListName)
        })

    } else if( request.message === "stop" ) {
        stop();
        setDisabledIcon();
    }
  });

chrome.tabs.onRemoved.addListener(function(tabId, removed) {
  if (tabId === currentRunnigTabId) {
    stop();
    setDisabledIcon();
  }
})
