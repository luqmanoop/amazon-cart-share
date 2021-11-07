let utils = {};
(async () => {
  const utilsSrc = chrome.runtime.getURL("utils.js");
  utils = await import(utilsSrc);
})();

const getCart = () => {
  const cart = Array.from(
    document.querySelectorAll("#sc-active-cart .sc-list-item-content") || []
  );

  if (!cart.length) return null;

  const cartData = cart.map((cartItem) => {
    const qty = cartItem.querySelector("select[name=quantity").value;
    const url = cartItem.querySelector(".sc-product-link").href;
    const price = cartItem.querySelector(".sc-product-price").innerText;
    const image = cartItem.querySelector(".sc-product-image").src;
    const title = cartItem.querySelector(
      ".sc-product-title .a-truncate-full"
    ).innerText;
    const selected = cartItem.querySelector(
      ".sc-list-item-checkbox input[type=checkbox]"
    ).checked;

    return {
      qty,
      price,
      image,
      url,
      title,
      selected,
    };
  });

  return cartData;
};

const saveCart = async (id, cart) => {
  return fetch("https://amazon-cart-share.codeshifu.dev/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      cart,
    }),
  })
    .then((res) => res.json())
    .then((data) => data.url)
    .catch(console.log);
};

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  switch (message.type) {
    case utils.FEATURES_DISABLED:
      return utils.isNotAmazonCartPage()
        ? reply({ payload: true })
        : reply({ payload: false });

    case utils.COPY_CART_URL:
      const cart = getCart();

      if (!cart) {
        utils.storage.get(utils.cartUrlKey).then((url) => {
          reply({ payload: url });
        });
        return true;
      }

      // make a fetch request to server to save cart
      saveCart(message.payload, cart)
        .then((url) => utils.storage.set(utils.cartUrlKey, url))
        .then((url) => reply({ payload: url }));
      return true; // IMPORTANT if we're calling `reply` in async functions
  }
});
