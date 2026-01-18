/* ===============================
   ESTADO
================================ */
let items = [];
let ticket = [];
let selectedCat = "Todos";
let deleteId = null;

/* ===============================
   HELPERS
================================ */
const $ = id => document.getElementById(id);

/* ===============================
   STORAGE
================================ */
function save() {
  localStorage.setItem("items", JSON.stringify(items));
  localStorage.setItem("ticket", JSON.stringify(ticket));
}

function load() {
  items = JSON.parse(localStorage.getItem("items")) || [];
  ticket = JSON.parse(localStorage.getItem("ticket")) || [];
}

/* ===============================
   DRAWER
================================ */
function toggleDrawer() {
  $("drawer").classList.toggle("open");
}

/* ===============================
   RENDER
================================ */
function render() {
  renderCategories();
  renderItems();
  renderTicket();
  save();
}

/* ===============================
   CATEGORÍAS
================================ */
function renderCategories() {
  const cats = ["Todos", ...new Set(items.map(i => i.cat))];

  $("drawer").innerHTML = cats
    .map(
      c => `
      <button class="${c === selectedCat ? "active" : ""}"
        onclick="selectCategory('${c}')">
        ${c}
      </button>`
    )
    .join("");
}

function selectCategory(cat) {
  selectedCat = cat;
  toggleDrawer();
  renderItems();
}

/* ===============================
   LISTA
================================ */
function renderItems() {
  const q = $("search").value.toLowerCase();

  $("list").innerHTML = items
    .filter(i =>
      (selectedCat === "Todos" || i.cat === selectedCat) &&
      i.name.toLowerCase().includes(q)
    )
    .map(
      i => `
      <div class="item">
        <span>${i.name}</span>
        <div>
          <button class="add" onclick="addToTicket(${i.id})">＋</button>
          <button class="del" onclick="askDelete(${i.id})">✕</button>
        </div>
      </div>`
    )
    .join("");
}

/* ===============================
   PRODUCTOS
================================ */
function showAddItem() {
  const name = prompt("Nombre del producto:");
  if (!name) return;

  const cat = prompt("Categoría:");
  if (!cat) return;

  items.push({
    id: Date.now(),
    name,
    cat
  });

  render();
}

function askDelete(id) {
  deleteId = id;
  $("confirmText").textContent = "¿Eliminar este producto?";
  $("confirmModal").style.display = "flex";
}

function closeConfirm() {
  $("confirmModal").style.display = "none";
  deleteId = null;
}

function confirmDelete() {
  items = items.filter(i => i.id !== deleteId);
  ticket = ticket.filter(t => t.id !== deleteId);
  closeConfirm();
  render();
}

/* ===============================
   TICKET
================================ */
function addToTicket(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const found = ticket.find(t => t.id === id);
  if (found) found.qty++;
  else ticket.push({ id, name: item.name, qty: 1 });

  renderTicket();
  save();
}

function renderTicket() {
  $("ticketList").innerHTML = ticket
    .map(
      t => `
      <li>
        ${t.name} x${t.qty}
        <button onclick="removeFromTicket(${t.id})">✕</button>
      </li>`
    )
    .join("");
}

function removeFromTicket(id) {
  ticket = ticket.filter(t => t.id !== id);
  renderTicket();
  save();
}

function resetTicket() {
  ticket = [];
  renderTicket();
  save();
}

/* ===============================
   ACCIONES
================================ */
function sendWhatsApp() {
  if (!ticket.length) return;
  const msg = ticket.map(t => `• ${t.name} x${t.qty}`).join("\n");
  window.open("https://wa.me/?text=" + encodeURIComponent(msg));
}

function printTicket() {
  window.print();
}

/* ===============================
   INIT
================================ */
function init() {
  load();

  if (!items.length) {
    items = [
      { id: 1, name: "Arroz", cat: "Granos" },
      { id: 2, name: "Azúcar", cat: "Granos" },
      { id: 3, name: "Leche", cat: "Lácteos" }
    ];
  }

  render();
}

init();
