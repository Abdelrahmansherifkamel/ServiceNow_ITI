import { getProductById } from "./api.js";

const statusText = document.getElementById("statusText");
const productArea = document.getElementById("productArea");

const productImg = document.getElementById("productImg");
const productTitle = document.getElementById("productTitle");
const productPrice = document.getElementById("productPrice");
const productDesc = document.getElementById("productDesc");

const favoritesButton = document.getElementById("favBtn");
const cartButton = document.getElementById("cartBtn");

// =====================
// FAVOURITES (LocalStorage)
// We store favourites as an array of product ids, example: [2, 7, 10]
// =====================

function readFavorites() {
  const text = localStorage.getItem("favourites");
  if (text === null) return [];
  return JSON.parse(text);
}

function saveFavorites(list) {
  localStorage.setItem("favourites", JSON.stringify(list));
}

function isInFavorites(favorites, productId) {
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i] === productId) return true;
  }
  return false;
}

function removeFromFavorites(favorites, productId) {
  const newFavorites = [];

  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i] !== productId) {
      newFavorites.push(favorites[i]);
    }
  }

  return newFavorites;
}

function updateFavoritesButton(productId) {
  const favorites = readFavorites();
  const liked = isInFavorites(favorites, productId);

  if (liked) {
    favoritesButton.innerHTML = `<i class="bi bi-heart-fill"></i> Remove favourite`;
    favoritesButton.className = "btn btn-success";
  } else {
    favoritesButton.innerHTML = `<i class="bi bi-heart"></i> Favourite`;
    favoritesButton.className = "btn btn-outline-success";
  }
}

// =====================
// CART (LocalStorage)
// We store cart items as objects, example:
// [{ id: 7, name: "Bamboo Toothbrush", price: 75, image_url: "...", quantity: 2 }]
// =====================

function readCart() {
  const text = localStorage.getItem("cart");
  if (text === null) return [];
  return JSON.parse(text);
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

async function startProductPage() {
  // URL example: product.html?id=12
  const searchPart = window.location.search; // "?id=12"
  const idText = searchPart.replace("?id=", ""); // "12"

  const productId = Number(idText);

  if (!Number.isFinite(productId)) {
    statusText.textContent = "Wrong product id.";
    return;
  }

  // Show loading text in <p id="statusText">
  statusText.textContent = "Loading...";

  const product = await getProductById(productId);

  if (product === null) {
    statusText.textContent = "Product not found.";
    return;
  }

  // Show productArea (remove d-none)
  productArea.classList.remove("d-none");
  statusText.textContent = "";

  // Fill the page with product data
  productImg.src = "/" + product.image_url;
  productImg.alt = product.name;

  productTitle.textContent = product.name;
  productPrice.textContent = Number(product.price || 0).toFixed(2) + " EGP";
  productDesc.textContent = product.description || "";

  // Set button state
  updateFavoritesButton(product.id);

  // Click: add/remove from favorites
  favoritesButton.addEventListener("click", function () {
    const favorites = readFavorites();
    const liked = isInFavorites(favorites, product.id);

    if (liked) {
      const newFavorites = removeFromFavorites(favorites, product.id);
      saveFavorites(newFavorites);
    } else {
      favorites.push(product.id);
      saveFavorites(favorites);
    }

    updateFavoritesButton(product.id);
  });

  // Add to cart
  // - If the product is already in cart, increase quantity
  // - Otherwise, add it as quantity 1
  if (cartButton) {
    cartButton.addEventListener("click", function () {
      const cart = readCart();

      let found = false;

      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === product.id) {
          cart[i].quantity = cart[i].quantity + 1;
          found = true;
          break;
        }
      }

      if (found === false) {
        cart.push({
          id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          image_url: product.image_url,
          quantity: 1,
        });
      }

      saveCart(cart);

      // Small feedback for the user
      cartButton.textContent = "Added ✓";
    });
  }
}

startProductPage();
