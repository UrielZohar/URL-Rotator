const clearAllInputs = (inputs) => {
    inputs.forEach(input => input.value = '');
};

const wrapInUrlAndDurationTimeStructure = (urlList, durationTime) => {
    return urlList.map(url => ({ url, durationTime }));
};

export {
  clearAllInputs,
  wrapInUrlAndDurationTimeStructure,
}