let utils = {};
(async () => {
  const utilsSrc = chrome.runtime.getURL("utils.js");
  utils = await import(utilsSrc);
})();

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  switch (message.type) {
    case utils.FEATURES_DISABLED:
      return utils.isNotAmazonCartPage()
        ? reply({ payload: true })
        : reply({ payload: false });
  }
});
