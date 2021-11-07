import {
  randomString,
  sendMessage,
  FEATURES_DISABLED,
  storage,
  cartKey,
  COPY_CART_URL,
} from "./utils.js";

const cartId = document.querySelector(".cart-id");
const newCartIdBtn = document.querySelector(".new-cart-id-btn");
const copyUrlBtn = document.querySelector("button");
const warningText = document.querySelector(".warning");

const rerenderCartId = (value) => {
  cartId.textContent = value;
};

// find or update cartId in storage and update dom
const findOrUpdateCartId = async (cartId) => {
  const result = await storage.get(cartKey);
  if (result) {
    rerenderCartId(result);
  } else {
    await storage.set(cartKey, cartId);
    rerenderCartId(cartId);
  }
};

const handleNewCartIdBtnClicked = () => {
  // save newly generated cart id
  const newCartId = randomString();
  storage
    .set(cartKey, newCartId)
    .then(() => {
      rerenderCartId(newCartId);
    })
    .catch(console.log);
};

newCartIdBtn.addEventListener("click", handleNewCartIdBtnClicked);

const disableFeatures = () => {
  newCartIdBtn.removeEventListener("click", handleNewCartIdBtnClicked);
  newCartIdBtn.classList.add("disabled");
};

const copyCartUrlToClipboard = async (cartUrl) => {
  if (!cartUrl) throw new Error("no cart url");

  await window.navigator.clipboard.writeText(cartUrl);
  cartId.classList.add("animate");
};

cartId.addEventListener("animationend", () => {
  cartId.classList.remove("animate");
});

copyUrlBtn.addEventListener("click", () => {
  const cartId = document.querySelector(".cart-id").textContent;
  sendMessage({ type: COPY_CART_URL, payload: cartId })
    .then(copyCartUrlToClipboard)
    .catch(console.log);
});

const init = () => {
  findOrUpdateCartId(randomString());
  // ask content-script whether to disable certain features
  sendMessage({ type: FEATURES_DISABLED })
    .then((disable) => {
      if (disable) disableFeatures();
    })
    .catch(disableFeatures);
};

init();
