const storageLocalGet = (...keys) => {
  return new Promise((resolve, _reject) => {
    chrome.storage.local.get([...keys], res => {
      resolve(res);
    });
  });
};


const storageLocalSet = (key, value) => {
  chrome.storage.local.set({ [key]: value });
};

export {
  storageLocalGet,
  storageLocalSet,
};