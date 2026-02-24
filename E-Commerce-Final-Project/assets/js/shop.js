import { getProducts } from "./api.js";

let allProducts = [];

const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const resultsCount = document.getElementById("resultsCount");
const productsGrid = document.getElementById("productsGrid");

// Make any value safe to search (string, lowercase, trimmed)
function cleanText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value).toLowerCase().trim();
  return text;
}

function productMatches(product, searchText, selectedCategory) {
  // 1) Category check
  let categoryMatch = false;

  if (selectedCategory === "all") {
    categoryMatch = true;
  } else if (product.category === selectedCategory) {
    categoryMatch = true;
  }

  if (categoryMatch === false) {
    return false;
  }

  // 2) Search check
  const searchQuery = cleanText(searchText);

  // If user didn't type anything, don't filter by search
  if (searchQuery === "") {
    return true;
  }

  const nameText = cleanText(product.name);
  const descText = cleanText(product.description);

  const foundInName = nameText.includes(searchQuery);
  const foundInDesc = descText.includes(searchQuery);

  return foundInName || foundInDesc;
}

function renderProductCards(products) {
  if (products.length === 1) {
    resultsCount.textContent = "1 item";
  } else {
    resultsCount.textContent = products.length + " items";
  }

  const html = products
    .map(function (product) {
      const price = Number(product.price || 0).toFixed(2);

      return `
        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card h-100 shadow-sm position-relative">
            <img src="/${product.image_url}" class="card-img-top product-img" alt="${product.name}">

            <div class="card-body">
              <h5 class="card-title mb-2">${product.name}</h5>
              <div class="fw-bold">${price} EGP</div>

              <a class="stretched-link"
                 href="/pages/product.html?id=${product.id}"
                 aria-label="View ${product.name}">
              </a>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  productsGrid.innerHTML = html;
}

function updateView() {
  const searchText = searchInput.value;
  const selectedCategory = categorySelect.value;

  const filteredProducts = allProducts.filter(function (product) {
    return productMatches(product, searchText, selectedCategory);
  });

  renderProductCards(filteredProducts);
}

function attachEvents() {
  searchInput.addEventListener("input", updateView);
  categorySelect.addEventListener("change", updateView);
}

async function startShopPage() {
  attachEvents();
  allProducts = await getProducts();
  updateView();
}

startShopPage();
