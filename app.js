/* ========= ESTADO ========= */
let items = JSON.parse(localStorage.getItem("items")) || [
  { id: 1, name: "Arroz", cat: "Granos" },
  { id: 2, name: "Pasta", cat: "Granos" },
  { id: 3, name: "Leche", cat: "Lácteos" },
  { id: 4, name: "Yogur", cat: "Lácteos" }
];

let ticket = JSON.parse(localStorage.getItem("ticket")) || [];
let selectedCat = "Todos";

/* ========= HELPERS ========= */
const $ = id => document.getElementById(id);
const save = () => {
  localStorage.setItem("items", JSON.stringify(items));
  localStorage.setItem("ticket", JSON.stringify(ticket));
};

/* ========= DRAWER ========= */
function toggleDrawer() {
  $("drawer").classList.toggle("open");
}

/* ========= CATEGORÍAS ========= */
function renderCategories() {
  const drawer = $("drawer");
  if (!drawer) return;

  const cats = ["Todos", ...new Set(items.map(i => i.cat))];

  drawer.innerHTML = cats
    .map(c => `
      <button
        class="${c === selectedCat ? "active" : ""}"
        onclick="selectCategory('${c}')">
        ${c}
      </button>
    `)
    .join("");
}

function selectCategory(cat) {
  selectedCat = cat;
  toggleDrawer();
  render();
}

/* ========= LISTA ========= */
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

/* ========= TICKET ========= */
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

/* ========= CRUD ========= */
function showAddItem() {
  const name = prompt("Nombre del producto");
  const cat = prompt("Categoría");

  if (!name || !cat) return;

  items.push({
    id: Date.now(),
    name,
    cat
  });

  save();
  render();
}

function deleteItem(id) {
  items = items.filter(i => i.id !== id);
  save();
  render();
}

/* ========= RENDER ========= */
function render() {
  renderCategories();
  renderItems();
  renderTicket();
}

/* ========= INIT ========= */
document.addEventListener("DOMContentLoaded", render);
