/* ===============================
   DESPENSA – app.js COMPLETO
   Categorías independientes
   =============================== */

/* ===== ESTADO ===== */

// Categorías propias (NO dependen de productos)
let categories = JSON.parse(localStorage.getItem("categories")) || [
  "Granos",
  "Lácteos",
  "Bebidas",
  "Limpieza"
];

// Productos
let items = JSON.parse(localStorage.getItem("items")) || [
  { id: 1, name: "Arroz", cat: "Granos" },
  { id: 2, name: "Pasta", cat: "Granos" },
  { id: 3, name: "Leche", cat: "Lácteos" }
];

// Ticket
let ticket = JSON.parse(localStorage.getItem("ticket")) || [];

// Categoría seleccionada
let selectedCat = "Todos";

/* ===== HELPERS ===== */
const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("items", JSON.stringify(items));
  localStorage.setItem("ticket", JSON.stringify(ticket));
}

/* ===== DRAWER ===== */
function toggleDrawer() {
  $("drawer").classList.toggle("open");
}

/* ===== CATEGORÍAS ===== */
function renderCategories() {
  const drawer = $("drawer");
  if (!drawer) return;

  const cats = ["Todos", ...categories];

  drawer.innerHTML = cats
    .map(cat => `
      <button
        class="${cat === selectedCat ? "active" : ""}"
        onclick="selectCategory('${cat}')">
        ${cat}
      </button>
    `)
    .join("");
}

function selectCategory(cat) {
  selectedCat = cat;
  toggleDrawer();
  renderItems();
}

/* ===== LISTA DE PRODUCTOS ===== */
function renderItems() {
  const list = $("list");
  const search = $("search").value.toLowerCase();

  list.innerHTML = items
    .filter(i =>
      (selectedCat === "Todos" || i.cat === selectedCat) &&
      i.name.toLowerCase().includes(search)
    )
    .map(i => `
      <div class="item">
        <span>${i.name}</span>
        <div>
          <button class="add" onclick="addToTicket(${i.id})">+</button>
          <button class="del" onclick="deleteItem(${i.id})">×</button>
        </div>
      </div>
    `)
    .join("");
}

/* ===== TICKET ===== */
function addToTicket(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  ticket.push(item);
  save();
  renderTicket();
}

function renderTicket() {
  $("ticketList").innerHTML = ticket
    .map((i, idx) => `
      <li>
        ${i.name}
        <button onclick="removeFromTicket(${idx})">×</button>
      </li>
    `)
    .join("");
}

function removeFromTicket(index) {
  ticket.splice(index, 1);
  save();
  renderTicket();
}

function resetTicket() {
  ticket = [];
  save();
  renderTicket();
}

/* ===== PRODUCTOS ===== */
function showAddItem() {
  let name = prompt("Nombre del producto:");
  if (!name) return;
  name = name.trim();

  let cat = prompt(
    "Categoría (elige una):\n" + categories.join(", ")
  );
  if (!cat || !categories.includes(cat)) {
    alert("Categoría no válida");
    return;
  }

  items.push({
    id: Date.now(),
    name,
    cat
  });

  save();
  render();
}

function deleteItem(id) {
  if (!confirm("¿Eliminar este producto?")) return;

  items = items.filter(i => i.id !== id);
  save();
  render();
}

/* ===== RENDER GENERAL ===== */
function render() {
  renderCategories();
  renderItems();
  renderTicket();
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", render);
