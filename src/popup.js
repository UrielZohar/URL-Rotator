const urlRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

const putUrlListItemsInTheListOfElements = () => {
  chrome.storage.local.get(["urlListItems"]).then(res => {
    const urlListItems = res?.urlListItems || [];
    const urlList = document.querySelectorAll(".url-input input");
    const secondsList = document.querySelectorAll(".seconds-input input");
    for (let index = 0; index < urlListItems.length; index++) {
      urlList[index].value = urlListItems[index].url;
      secondsList[index].value = urlListItems[index].durationTime;
    }
  });
}
const getUrlList = () => {
  const urlListItems = [];
  const urlList = document.querySelectorAll(".url-input input");
  const secondsList = document.querySelectorAll(".seconds-input input");
  for (let index = 0; index < urlList.length; index++) {
    const currentUrl = urlList[index].value;
    const currentSeconds = parseInt(secondsList[index].value);
    if (urlRegex.test(currentUrl) && currentSeconds) {
      urlListItems.push({
        durationTime: currentSeconds,
        url: currentUrl
      });
    }
  }
  return urlListItems;
}

// handle the start button click
document.getElementById('start-button').addEventListener('click', function() {
  // send a message to the background script to start the tab switching
  const urlListItems = getUrlList();
  if (urlListItems.length === 0) {
    return;
  }
  chrome.runtime.sendMessage({
    message: "start",
    payload: {
      urlListItems,
    }
  });
  // close the popup window
  window.close();
});

// handle the stop button click
document.getElementById('stop-button').addEventListener('click', function() {
  // send a message to the background script to stop the tab switching
  chrome.runtime.sendMessage({message: "stop"});
  // close the popup window
  window.close();
});

// on start
putUrlListItemsInTheListOfElements();
