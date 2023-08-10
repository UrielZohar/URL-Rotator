import { stopSwitching } from './messages.js';

const urlRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?)([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

const closePopupWindow = () => {
  window.close();
}

const setStopButtonActios = (stopButton) => {
  stopButton.addEventListener('click', () => {
    stopSwitching();
    closePopupWindow();
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
const setStartButtonActios = (startButton) => {
  startButton.addEventListener('click', function () {
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
}

const initActions = ({ stopButton, startButton }) => {
  setStopButtonActios(stopButton);
  setStartButtonActios(startButton);
};

export { initActions };
