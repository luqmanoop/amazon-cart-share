import {
  randomString,
  sendMessage,
  FEATURES_DISABLED,
  storage,
  cartKey,
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

findOrUpdateCartId(randomString());

const handleNewCartIdBtnClicked = () => {
  rerenderCartId(randomString());
};

newCartIdBtn.addEventListener("click", handleNewCartIdBtnClicked);

const disableFeatures = () => {
  newCartIdBtn.removeEventListener("click", handleNewCartIdBtnClicked);
  newCartIdBtn.classList.add("disabled");
};

// ask content-script whether to disable certain features
sendMessage({ type: FEATURES_DISABLED })
  .then((disable) => {
    if (disable) disableFeatures();
  })
  .catch(disableFeatures);
