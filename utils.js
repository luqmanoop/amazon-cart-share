/* messaging events */
export const COPY_CART_URL = "COPY_CART_URL";
export const FEATURES_DISABLED = "FEATURES_DISABLED";
/* --- end --- */

export const cartKey = chrome.runtime.id;

export const randomString = (length = 7) =>
  Array(length)
    .fill("")
    .map(() => Math.random().toString(36).charAt(2))
    .join("");

export const isNotAmazonCartPage = () => {
  return !/https:\/\/.*amazon.*\/cart\/view.html*/.test(location.href);
};

export const sendMessage = async (msg) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  return new Promise((resolve, reject) => {
    if (!tabs.length) reject("No active tabs");

    chrome.tabs.sendMessage(tabs[0].id, msg, (response) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      if (response) resolve(response.payload);
      reject("No response");
    });
  });
};
