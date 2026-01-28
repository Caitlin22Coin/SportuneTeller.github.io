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

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.getElementById("close");

let currentIndex = 0;

function openAt(idx){
  currentIndex = (idx + FILES.length) % FILES.length;
  const src = BASE + FILES[currentIndex];
  lightboxImg.src = src;
  lightboxImg.alt = "";
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // optional deep-link
  const url = new URL(window.location.href);
  url.searchParams.set("card", String(currentIndex));
  history.replaceState({}, "", url);
}

function close(){
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  const url = new URL(window.location.href);
  url.searchParams.delete("card");
  history.replaceState({}, "", url);
}

function prev(){ openAt(currentIndex - 1); }
function next(){ openAt(currentIndex + 1); }

function render(){
  gallery.innerHTML = "";
  FILES.forEach((file, idx) => {
    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = BASE + file;
    img.alt = "";
    img.addEventListener("click", () => openAt(idx));
    gallery.appendChild(img);
  });
}

closeBtn.addEventListener("click", close);

// click outside image closes
lightbox.addEventListener("click", (e) => {
  if(e.target === lightbox) close();
});

// keyboard
document.addEventListener("keydown", (e) => {
  if(lightbox.getAttribute("aria-hidden") === "true") return;
  if(e.key === "Escape") close();
  if(e.key === "ArrowLeft") prev();
  if(e.key === "ArrowRight") next();
});

// swipe (mobile)
let startX = null;
lightboxImg.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
}, { passive: true });

lightboxImg.addEventListener("touchend", (e) => {
  if(startX === null) return;
  const endX = e.changedTouches[0].clientX;
  const dx = endX - startX;
  startX = null;
  if(Math.abs(dx) < 40) return;
  if(dx > 0) prev();
  else next();
}, { passive: true });

render();

// deep-link support ?card=#
const params = new URLSearchParams(window.location.search);
const deep = params.get("card");
if(deep !== null){
  const idx = Number(deep);
  if(Number.isFinite(idx) && idx >= 0 && idx < FILES.length){
    openAt(idx);
  }
}
