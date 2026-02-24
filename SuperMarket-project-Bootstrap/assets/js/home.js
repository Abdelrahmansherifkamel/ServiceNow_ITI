import { getProducts } from "./api.js";

const container = document.getElementById("brandsContainer");
const leftBtn = document.getElementById("brandsLeftBtn");
const rightBtn = document.getElementById("brandsRightBtn");

function renderPicks(products) {
  // keep it simple: show first 8 products
  const picks = products.slice(0, 8);

  container.innerHTML = picks
    .map(function (p) {
      return `
        <a class="brands-item text-decoration-none" href="/pages/product.html?id=${p.id}">
          <img src="/${p.image_url}" alt="${p.name}">
        </a>
      `;
    })
    .join("");
}

function scrollByAmount(direction) {
  const amount = 320;
  container.scrollLeft = container.scrollLeft + direction * amount;
}

async function startHomePage() {
  if (!container) return;

  const products = await getProducts();
  renderPicks(products);

  if (leftBtn) leftBtn.addEventListener("click", function () {
    scrollByAmount(-1);
  });

  if (rightBtn) rightBtn.addEventListener("click", function () {
    scrollByAmount(1);
  });
}

startHomePage();