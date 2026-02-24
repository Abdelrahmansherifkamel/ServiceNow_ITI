// Cart page
// This page reads cart items from localStorage and renders them.
// It also updates quantities and calculates the total using reduce() (requirement).

const cartText = document.getElementById("cartText");
const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");

function readCart() {
  // Cart is saved as JSON text in localStorage
  // Example: [{ id: 7, name: "...", price: 75, image_url: "...", quantity: 2 }]
  const text = localStorage.getItem("cart");
  if (text === null) return [];
  return JSON.parse(text);
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart(cart) {
  // If cart is empty
  if (cart.length === 0) {
    cartText.textContent = "Your cart is empty.";
    cartBody.innerHTML = "";
    cartTotal.textContent = "0.00 EGP";
    return;
  }

  cartText.textContent = cart.length + " item(s)";

  // Build rows using map()
  cartBody.innerHTML = cart
    .map(function (item) {
      const price = Number(item.price || 0);
      const subtotal = price * Number(item.quantity || 1);

      return `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-3">
              <img
                src="/${item.image_url}"
                alt="${item.name}"
                style="width:60px;height:60px;object-fit:cover;"
                class="rounded"
              >
              <div>
                <div class="fw-semibold">${item.name}</div>
                <a class="small text-decoration-none" href="/pages/product.html?id=${item.id}">View</a>
              </div>
            </div>
          </td>

          <td>
            <input
              type="number"
              min="1"
              class="form-control form-control-sm js-qty"
              data-id="${item.id}"
              value="${item.quantity}"
            >
          </td>

          <td>${price.toFixed(2)} EGP</td>
          <td>${subtotal.toFixed(2)} EGP</td>

          <td class="text-end">
            <button class="btn btn-outline-danger btn-sm js-remove" data-id="${item.id}">
              Remove
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  // Total using reduce() (required)
  const total = cart.reduce(function (sum, item) {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 1);
    return sum + price * qty;
  }, 0);

  cartTotal.textContent = total.toFixed(2) + " EGP";

  // Remove button events
  document.querySelectorAll(".js-remove").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = Number(btn.dataset.id);

      const newCart = cart.filter(function (x) {
        return x.id !== id;
      });

      saveCart(newCart);
      startCartPage();
    });
  });

  // Quantity change events
  document.querySelectorAll(".js-qty").forEach(function (input) {
    input.addEventListener("change", function () {
      const id = Number(input.dataset.id);
      let qty = Number(input.value);

      // simple validation
      if (!Number.isFinite(qty) || qty < 1) {
        qty = 1;
        input.value = "1";
      }

      const updatedCart = readCart();

      for (let i = 0; i < updatedCart.length; i++) {
        if (updatedCart[i].id === id) {
          updatedCart[i].quantity = qty;
          break;
        }
      }

      saveCart(updatedCart);
      startCartPage();
    });
  });
}

function startCartPage() {
  const cart = readCart();
  renderCart(cart);
}

startCartPage();
