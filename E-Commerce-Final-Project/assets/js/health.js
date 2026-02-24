import { getProducts } from "./api.js";

let allProducts = [];

const searchInput = document.getElementById("searchInput");
const resultsCount = document.getElementById("resultsCount");
const productsGrid = document.getElementById("productsGrid");

function cleanText(value) {
  if (value === null || value === undefined) return "";
  return String(value).toLowerCase().trim();
}

function renderProductCards(products) {
  if (products.length === 1) resultsCount.textContent = "1 item";
  else resultsCount.textContent = products.length + " items";

  productsGrid.innerHTML = products
    .map(function (p) {
      const price = Number(p.price || 0).toFixed(2);

      return `
        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card h-100 shadow-sm position-relative">
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

  const filtered = allProducts.filter(function (p) {
    if (searchText === "") return true;

    const name = cleanText(p.name);
    const desc = cleanText(p.description);

    return name.includes(searchText) || desc.includes(searchText);
  });

  renderProductCards(filtered);
}

async function startHealthPage() {
  allProducts = await getProducts("health");
  updateView();

  searchInput.addEventListener("input", updateView);
}

startHealthPage();
