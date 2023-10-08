import { stopSwitching } from './messages.js';
import urlSubjectLists from './subjectsList.js';
import { clearAllInputs, wrapInUrlAndDurationTimeStructure } from './actions.utils.js';
import { storageLocalSet, storageLocalGet } from './storageLocal.js';
import { CUSTOM_LIST_NAMES, LOCAL_STORAGE_KEYS } from './constants.js';

const urlRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|www\\.){0,1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
const  URL_LIST = document.querySelectorAll('.url-input input');
const  SECONDS_LIST = document.querySelectorAll('.seconds-input input');
const INPUTS_LENGTH = URL_LIST.length;
const DEFAULT_DURATION_TIME = 60;

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
    // getUrlList bring the list with items {url: string, duration: number} each
    const urlListItems = getUrlList();
    if (urlListItems.length === 0) {
      return;
    }
    // if the list is a custom list then save its content in the local storage
    if (CUSTOM_LIST_NAMES.includes(subjectSelect.value)) {
      storageLocalSet(subjectSelect.value, urlListItems);
      storageLocalSet(LOCAL_STORAGE_KEYS.subjectSelect, subjectSelect.value);
    } else if (subjectSelect.value) {
      // if the list is not a custom list then just save that selection in the local storage
      storageLocalSet(LOCAL_STORAGE_KEYS.subjectSelect, subjectSelect.value);
    }

    chrome.runtime.sendMessage({
      message: "start",
      payload: {
        urlListItems,
        customListName: subjectSelect.value,
      }
    });
    // close the popup window
    window.close();
  });
}

const setSubjectSelectActions = (subjectSelect) => {
  subjectSelect.addEventListener('change', async () => {
    // first clear
    clearAllInputs(URL_LIST);
    if (subjectSelect.value === 'clearAll') {
      return;
    }
    let subjectUrls;
    if (CUSTOM_LIST_NAMES.includes(subjectSelect.value)) {
      // if the selection is a custom selection then load the list from the local storage
      subjectUrls = (await storageLocalGet(subjectSelect.value))?.[subjectSelect.value] || [];
    } else {
      // if the selection is not a custom selection then load the list hard coded list
      subjectUrls = wrapInUrlAndDurationTimeStructure(urlSubjectLists[subjectSelect.value], DEFAULT_DURATION_TIME);
    }
    // matching each url string to each input element
    for (let index = 0; index < INPUTS_LENGTH; index++) {
      // the empty string is to support cases which the list is shorter than the number of inputs
      URL_LIST[index].value = subjectUrls[index]?.url || '';
      SECONDS_LIST[index].value = subjectUrls[index]?.durationTime || 60;
    }
  });
}

const initActions = ({ stopButton, startButton, subjectSelect }) => {
  setStopButtonActios(stopButton);
  setStartButtonActios(startButton, subjectSelect);
  setSubjectSelectActions(subjectSelect);
};

export { initActions };
