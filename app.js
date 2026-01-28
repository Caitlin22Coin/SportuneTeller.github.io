const BASE = "assets/cards/";

const FILES = [
  "chariot.png",
  "death.png",
  "devil.png",
  "emperor.png",
  "empress.png",
  "fool.png",
  "hermit.png",
  "hierophant.png",
  "highpriestess.png",
  "judgment.png",
  "justice.png",
  "magician.png",
  "moon.png",
  "star.png",
  "strength.png",
  "sun.png",
  "temperance.png",
  "tower.png",
  "wheel.png",
  "world.png",
];

const prettyName = (file) =>
  file.replace(".png","").replace(/[-_]/g," ").trim();

const grid = document.getElementById("grid");

const viewer = document.getElementById("viewer");
const backdrop = document.getElementById("backdrop");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const openBtn = document.getElementById("openBtn");
const fullImg = document.getElementById("fullImg");
const cardName = document.getElementById("cardName");

let currentIndex = 0;

function renderGrid(){
  grid.innerHTML = "";
  FILES.forEach((file, idx) => {
    const tile = document.createElement("article");
    tile.className = "tile";
    tile.tabIndex = 0;

    tile.innerHTML = `
      <img class="thumb" loading="lazy" src="${BASE + file}" alt="${prettyName(file)}" />
      <div class="caption">${prettyName(file)}</div>
    `;

    tile.addEventListener("click", () => openAt(idx));
    tile.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " ") openAt(idx);
    });

    grid.appendChild(tile);
  });
}

function setUrl(idx){
  const url = new URL(window.location.href);
  url.searchParams.set("card", String(idx));
  history.replaceState({}, "", url);
}

function clearUrl(){
  const url = new URL(window.location.href);
  url.searchParams.delete("card");
  history.replaceState({}, "", url);
}

function openAt(idx){
  currentIndex = (idx + FILES.length) % FILES.length;
  const file = FILES[currentIndex];

  viewer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  fullImg.src = BASE + file;
  fullImg.alt = prettyName(file);
  cardName.textContent = prettyName(file);

  openBtn.href = BASE + file;

  setUrl(currentIndex);
}

function closeViewer(){
  viewer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  clearUrl();
}

function prev(){ openAt(currentIndex - 1); }
function next(){ openAt(currentIndex + 1); }

backdrop.addEventListener("click", closeViewer);
closeBtn.addEventListener("click", closeViewer);
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);

document.addEventListener("keydown", (e) => {
  if(viewer.getAttribute("aria-hidden") === "true") return;
  if(e.key === "Escape") closeViewer();
  if(e.key === "ArrowLeft") prev();
  if(e.key === "ArrowRight") next();
});

// Swipe (mobile)
let startX = null;
fullImg.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
}, {passive:true});

fullImg.addEventListener("touchend", (e) => {
  if(startX === null) return;
  const endX = e.changedTouches[0].clientX;
  const dx = endX - startX;
  startX = null;
  if(Math.abs(dx) < 40) return;
  if(dx > 0) prev();
  else next();
}, {passive:true});

renderGrid();

// Deep link ?card=#
const params = new URLSearchParams(window.location.search);
const deep = params.get("card");
if(deep !== null){
  const idx = Number(deep);
  if(Number.isFinite(idx) && idx >= 0 && idx < FILES.length){
    openAt(idx);
  }
}
