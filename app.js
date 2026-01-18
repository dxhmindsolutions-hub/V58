/* ===============================
   ESTADO GLOBAL
================================ */
let items = [];
let cart = [];
let selectedCat = "Todos";

/* ===============================
   HELPERS
================================ */
const $ = id => document.getElementById(id);

/* ===============================
   STORAGE
================================ */
function saveState() {
  localStorage.setItem("items", JSON.stringify(items));
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadState() {
  items = JSON.parse(localStorage.getItem("items")) || [];
  cart = JSON.parse(localStorage.getItem("cart")) || [];
}

/* ===============================
   UI FEEDBACK
================================ */
function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style =
    "position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#000;color:#fff;padding:10px 14px;border-radius:10px;z-index:9999";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1500);
}

/* ===============================
   RENDER
================================ */
function render() {
  renderCategories();
  renderItems();
  renderTicket();
  saveState();
}

/* ===============================
   CATEGORÍAS (DRAWER)
================================ */
function renderCategories() {
  const cats = ["Todos", ...new Set(items.map(i => i.cat))];

  $("catList").innerHTML = cats
    .map(
      c => `
      <button
        class="catBtn ${c === selectedCat ? "active" : ""}"
        onclick="selectCategory('${c}')">
        ${c}
      </button>`
    )
    .join("");
}

function selectCategory(cat) {
  selectedCat = cat;
  renderItems();
}

/* ===============================
   LISTA DE PRODUCTOS
================================ */
function renderItems() {
  $("list").innerHTML = items
    .filter(i => selectedCat === "Todos" || i.cat === selectedCat)
    .map(
      i => `
      <div class="item">
        <span onclick="addToCart(${i.id})">${i.name}</span>
        <button onclick="askDeleteItem(${i.id})">✕</button>
      </div>`
    )
    .join("");
}

/* ===============================
   CRUD PRODUCTOS
================================ */
function addItem() {
  const name = $("iname").value.trim();
  const cat = $("icat").value.trim();
  if (!name || !cat) return;

  items.push({
    id: Date.now(),
    name,
    cat
  });

  $("iname").value = "";
  $("icat").value = "";

  toast("Producto añadido");
  render();
}

function askDeleteItem(id) {
  if (!confirm("¿Eliminar este producto?")) return;

  items = items.filter(i => i.id !== id);
  cart = cart.filter(c => c.id !== id);

  toast("Producto eliminado");
  render();
}

/* ===============================
   CARRITO / TICKET
================================ */
function addToCart(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const found = cart.find(c => c.id === id);
  if (found) found.qty++;
  else cart.push({ id, name: item.name, qty: 1 });

  toast("Añadido al ticket");
  renderTicket();
  saveState();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  renderTicket();
  saveState();
}

function clearCart() {
  if (!confirm("¿Vaciar ticket?")) return;
  cart = [];
  renderTicket();
  saveState();
}

/* ===============================
   TICKET UI
================================ */
function renderTicket() {
  $("ticketList").innerHTML = cart
    .map(
      c => `
      <div class="ticket-item">
        ${c.name} x${c.qty}
        <button onclick="removeFromCart(${c.id})">✕</button>
      </div>`
    )
    .join("");
}

/* ===============================
   WHATSAPP / IMPRESIÓN
================================ */
function previewWhatsApp() {
  const msg = cart
    .map(c => `• ${c.name} x${c.qty}`)
    .join("\n");

  $("waText").value = msg;
  $("waModal").style.display = "flex";
}

function sendWhatsApp() {
  const txt = encodeURIComponent($("waText").value);
  window.open(`https://wa.me/?text=${txt}`);
}

function printTicket() {
  window.print();
}

/* ===============================
   INIT
================================ */
function init() {
  loadState();

  if (items.length === 0) {
    items = [
      { id: 1, name: "Arroz", cat: "Granos" },
      { id: 2, name: "Azúcar", cat: "Granos" },
      { id: 3, name: "Leche", cat: "Lácteos" }
    ];
  }

  render();
}

init();
