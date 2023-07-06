import {stopSwitching} from './messages.js';

const closePopupWindow = () => {
  window.close();
}

const setStopButtonActios = (stopButton) => {
  stopButton.addEventListener('click', () => {
    stopSwitching();
    closePopupWindow();
  });
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

const initActions = ({stopButton}) => {
  setStopButtonActios(stopButton);
}

const actions = {
  initActions,
};

export default actions;


