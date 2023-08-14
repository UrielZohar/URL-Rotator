import { stopSwitching } from './messages.js';
import urlSubjectLists from './subjectsList.js';

const urlRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|www\\.){0,1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

const closePopupWindow = () => {
  window.close();
}

const setStopButtonActios = (stopButton) => {
  stopButton.addEventListener('click', () => {
    stopSwitching();
  });
}

const getUrlList = () => {
  const urlListItems = [];
  const urlList = document.querySelectorAll(".url-input input");
  const secondsList = document.querySelectorAll(".seconds-input input");
  for (let index = 0; index < urlList.length; index++) {
    const currentUrl = urlList[index].value;
    console.log(currentUrl);
    const currentSeconds = parseInt(secondsList[index].value);
    console.log(currentSeconds);
    if (urlRegex.test(currentUrl) && currentSeconds) {
      console.log('passed the test');
      urlListItems.push({
        durationTime: currentSeconds,
        url: currentUrl
      });
    } else {
      console.log('failed the test');
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

const setSubjectSelectActions = (subjectSelect) => {
  subjectSelect.addEventListener('change', function () {
    const subjectUrls = urlSubjectLists[subjectSelect.value];
    const urlList = document.querySelectorAll(".url-input input");
    urlList.forEach((urlInput, index) => {
      urlInput.value = subjectUrls[index];
    });
  });
}

const initActions = ({ stopButton, startButton, subjectSelect }) => {
  setStopButtonActios(stopButton);
  setStartButtonActios(startButton);
  setSubjectSelectActions(subjectSelect);
};

export { initActions };
