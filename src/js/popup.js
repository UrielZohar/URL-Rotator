import {initActions} from './actions.js';

const STOP_BUTTON = document.getElementById('stop-button');
const START_BUTTON = document.getElementById('start-button');
const SUBJECT_SELECT = document.getElementById('subject-select');

const putUrlListItemsInTheListOfElements = () => {
  chrome.storage.local.get(['urlListItems']).then(res => {
    const urlListItems = res?.urlListItems || [];
    const urlList = document.querySelectorAll('.url-input input');
    const secondsList = document.querySelectorAll('.seconds-input input');
    for (let index = 0; index < urlListItems.length; index++) {
      urlList[index].value = urlListItems[index].url;
      secondsList[index].value = urlListItems[index].durationTime;
    }
  });
}

initActions({
  stopButton: STOP_BUTTON,
  startButton: START_BUTTON,
  subjectSelect: SUBJECT_SELECT,
});

// on start
putUrlListItemsInTheListOfElements();
