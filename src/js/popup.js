import {initActions} from './actions.js';

const urlRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

const STOP_BUTTON = document.getElementById('stop-button');
const START_BUTTON = document.getElementById('start-button');

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

initActions({
  stopButton: STOP_BUTTON,
  startButton: START_BUTTON,
});

// on start
putUrlListItemsInTheListOfElements();
