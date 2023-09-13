import { stopSwitching } from './messages.js';
import urlSubjectLists from './subjectsList.js';
import { clearAllInputs } from './actions.utils.js';
import { storageLocalSet } from './storageLocal.js';
import { CUSTOM_LIST_NAMES } from './constants.js';

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
const setStartButtonActios = (startButton, subjectSelect) => {
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
        customListName: CUSTOM_LIST_NAMES.find(listName => listName === subjectSelect.value),
      }
    });
    // close the popup window
    window.close();
  });
}

const setSubjectSelectActions = (subjectSelect) => {
  subjectSelect.addEventListener('change', async () => {
    const subjectUrls = urlSubjectLists[subjectSelect.value];
    // matching each url string to each input element
    let urlList = document.querySelectorAll('.url-input input');
    switch (subjectSelect.value) {
      case 'clearAll': {
        clearAllInputs(urlList);
        break;
      }

      case ['customList1', 'customList2','customList3'].find(actionName => actionName === subjectSelect.value): {
        urlList = await storageLocalSet.get(subjectSelect.value);
      }

      default: {
        urlList = document.querySelectorAll('.url-input input');
        urlList.forEach((urlInput, index) => {
          urlInput.value = subjectUrls[index];
        });
        break;
      }
    }
  });
}

const initActions = ({ stopButton, startButton, subjectSelect }) => {
  setStopButtonActios(stopButton);
  setStartButtonActios(startButton, subjectSelect);
  setSubjectSelectActions(subjectSelect);
};

export { initActions };
