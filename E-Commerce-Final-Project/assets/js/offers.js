import { getProducts } from "./api.js";

let offerProducts = [];

const searchInput = document.getElementById("searchInput");
const resultsCount = document.getElementById("resultsCount");
const offersGrid = document.getElementById("offersGrid");

function cleanText(value) {
  if (value === null || value === undefined) return "";
  return String(value).toLowerCase().trim();
}

function renderOfferCards(products) {
  if (products.length === 1) resultsCount.textContent = "1 offer";
  else resultsCount.textContent = products.length + " offers";

  if (products.length === 0) {
    offersGrid.innerHTML = `<p class="text-muted">No offers found.</p>`;
    return;
  }

  offersGrid.innerHTML = products
    .map(function (p) {
      const price = Number(p.price || 0).toFixed(2);

      return `
        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card h-100 shadow-sm position-relative">
            <span class="badge bg-danger position-absolute" style="top: 12px; left: 12px;">
              Offer
            </span>

            <img src="/${p.image_url}" class="card-img-top product-img" alt="${p.name}">

            <div class="card-body">
              <h5 class="card-title mb-2">${p.name}</h5>
              <div class="fw-bold">${price} EGP</div>

              <a class="stretched-link"
                 href="/pages/product.html?id=${p.id}"
                 aria-label="Open ${p.name}"></a>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function updateView() {
  const searchText = cleanText(searchInput.value);

  const filtered = offerProducts.filter(function (p) {
    if (searchText === "") return true;

    const name = cleanText(p.name);
    const desc = cleanText(p.description);

    return name.includes(searchText) || desc.includes(searchText);
  });

  renderOfferCards(filtered);
}

async function startOffersPage() {
  // Get all products, then keep only the ones marked as offer
  const all = await getProducts();
  offerProducts = all.filter(function (p) {
    return p.is_offer === true;
  });

  updateView();
  searchInput.addEventListener("input", updateView);
}

startOffersPage();
