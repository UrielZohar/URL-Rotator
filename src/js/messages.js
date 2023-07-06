const actions = {
  stopSwitching: () => {
    chrome.runtime.sendMessage({message: "stop"});
  },
}