/* ===============================
   DESPENSA – app.js COMPLETO
   Categorías gestionables
   =============================== */

/* ===== ESTADO ===== */
let categories = JSON.parse(localStorage.getItem("categories")) || [
  "Granos",
  "Lácteos",
  "Bebidas",
  "Limpieza"
];

let items = JSON.parse(localStorage.getItem("items")) || [
  { id: 1, name: "Arroz", cat: "Granos" },
  { id: 2, name: "Leche", cat: "Lácteos" }
];

let ticket = JSON.parse(localStorage.getItem("ticket")) || [];
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

  drawer.innerHTML = `
    ${["Todos", ...categories]
      .map(cat => `
        <button
          class="${cat === selectedCat ? "active" : ""}"
          onclick="selectCategory('${cat}')">
          ${cat}
        </button>
      `)
      .join("")}

    <hr>

    <button onclick="addCategory()">➕ Nueva categoría</button>
    <button onclick="removeCategory()">🗑️ Borrar categoría</button>
  `;
}

function selectCategory(cat) {
  selectedCat = cat;
  toggleDrawer();
  renderItems();
}

/* ===== GESTIÓN DE CATEGORÍAS ===== */
function addCategory() {
  let name = prompt("Nombre de la nueva categoría:");
  if (!name) return;

  name = name.trim();

  if (categories.includes(name)) {
    alert("Esa categoría ya existe");
    return;
  }

  categories.push(name);
  save();
  renderCategories();
}

function removeCategory() {
  if (selectedCat === "Todos") {
    alert("Selecciona una categoría para borrar");
    return;
  }

  const used = items.some(i => i.cat === selectedCat);
  if (used) {
    alert("No puedes borrar una categoría con productos");
    return;
  }

  if (!confirm(`¿Eliminar la categoría "${selectedCat}"?`)) return;

  categories = categories.filter(c => c !== selectedCat);
  selectedCat = "Todos";
  save();
  render();
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

/* ===== PRODUCTOS ===== */
function showAddItem() {
  let name = prompt("Nombre del producto:");
  if (!name) return;
  name = name.trim();

  let cat = prompt(
    "Categoría:\n" + categories.join(", ")
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

/* ===== TICKET ===== */
function addToTicket(id) {
  const item = items.find(i => i.id === id);
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

function removeFromTicket(i) {
  ticket.splice(i, 1);
  save();
  renderTicket();
}

function resetTicket() {
  ticket = [];
  save();
  renderTicket();
}

/* ===== RENDER ===== */
function render() {
  renderCategories();
  renderItems();
  renderTicket();
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", render);
