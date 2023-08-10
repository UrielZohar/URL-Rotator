const stopSwitching =  () => {
  chrome.runtime.sendMessage({message: "stop"});
};

export {
  stopSwitching,
};