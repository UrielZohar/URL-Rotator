const storageLocalGet = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], res => {
      resolve(res[key]);
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