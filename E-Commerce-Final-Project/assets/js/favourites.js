import { getProducts } from "./api.js";

const favText = document.getElementById("favText");
const favGrid = document.getElementById("favGrid");

async function startFavouritesPage() {
  // 1) read favourites from localStorage
  let favourites = localStorage.getItem("favourites");
  if (favourites === null) favourites = "[]";
  favourites = JSON.parse(favourites); // example: [2, 5, 9]

  if (favourites.length === 0) {
    favText.textContent = "No favourites yet.";
    favGrid.innerHTML = "";
    return;
  }

  // 2) fetch all products
  favText.textContent = "Loading...";
  const allProducts = await getProducts();

  // 3) keep only favourites
  const favProducts = allProducts.filter(function (p) {
    return favourites.includes(p.id);
  });

  // 4) render
  favText.textContent = favProducts.length + " item(s)";

  favGrid.innerHTML = favProducts
    .map(function (p) {
      const price = Number(p.price || 0).toFixed(2);

      return `
        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <img src="/${p.image_url}" class="card-img-top product-img" alt="${p.name}">
            <div class="card-body">
              <h5 class="card-title mb-2">${p.name}</h5>
              <div class="fw-bold mb-3">${price} EGP</div>

              <div class="d-flex gap-2">
                <a class="btn btn-outline-secondary btn-sm"
                   href="/pages/product.html?id=${p.id}">
                  View
                </a>

                <button class="btn btn-outline-danger btn-sm js-remove"
                        data-id="${p.id}">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  // 5) remove buttons
  document.querySelectorAll(".js-remove").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = Number(btn.dataset.id);

      favourites = favourites.filter(function (x) {
        return x !== id;
      });

      localStorage.setItem("favourites", JSON.stringify(favourites));
      startFavouritesPage(); // reload page content
    });
  });
}

startFavouritesPage();
