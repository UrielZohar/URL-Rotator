// popup.js is the entry point of the popup window.
import { storageLocalGet } from './storageLocal.js';
import {initActions} from './actions.js';
import { wrapInUrlAndDurationTimeStructure } from './actions.utils.js';
import subjectLists from './subjectsList.js';
import { CUSTOM_LIST_NAMES, LOCAL_STORAGE_KEYS, DEFAULT_DURATION_TIME } from './constants.js';

const STOP_BUTTON = document.getElementById('stop-button');
const START_BUTTON = document.getElementById('start-button');
const SUBJECT_SELECT = document.getElementById('subject-select');

const start = async () => {
  let {urlListItems = [], subjectSelect} = await storageLocalGet(LOCAL_STORAGE_KEYS.urlListItems, LOCAL_STORAGE_KEYS.subjectSelect);
  if (subjectSelect) {
    SUBJECT_SELECT.value = subjectSelect;
    if (CUSTOM_LIST_NAMES.includes(subjectSelect)) {
      const customSelectMap = await storageLocalGet(subjectSelect);
      urlListItems = customSelectMap[subjectSelect];
    } else {
      urlListItems = wrapInUrlAndDurationTimeStructure(subjectLists[subjectSelect], DEFAULT_DURATION_TIME);
    }
  }

  if (urlListItems) {
    putUrlListItemsInTheListOfElements(urlListItems);
  }

};

const putUrlListItemsInTheListOfElements = (urlListItems) => {
  const urlList = document.querySelectorAll('.url-input input');
  const secondsList = document.querySelectorAll('.seconds-input input');
  for (let index = 0; index < urlListItems.length; index++) {
    urlList[index].value = urlListItems[index].url;
    secondsList[index].value = urlListItems[index].durationTime;
  }
}

initActions({
  stopButton: STOP_BUTTON,
  startButton: START_BUTTON,
  subjectSelect: SUBJECT_SELECT,
});

// on start
start();
