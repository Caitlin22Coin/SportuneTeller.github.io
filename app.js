const CARDS = [
  // Replace these with your real filenames & metadata
  {
    id: "judgment-xx-referees",
    title: "Judgment",
    subtitle: "Final call on the biggest stage",
    team: "neutral",
    arcana: "major",
    numeral: "XX",
    img: "assets/cards/judgment-xx-referees.jpg",
    thumb: "assets/cards/judgment-xx-referees.jpg",
    tags: ["Judgment", "Referees", "XX"]
  },
  {
    id: "temperance-bentley",
    title: "Temperance",
    subtitle: "Ja'Whaun Bentley — Patriots #8",
    team: "patriots",
    arcana: "major",
    numeral: "XIV",
    img: "assets/cards/temperance-xiv-bentley.jpg",
    thumb: "assets/cards/temperance-xiv-bentley.jpg",
    tags: ["Bentley", "Temperance", "Patriots"]
  },
  {
    id: "moon-fant",
    title: "The Moon",
    subtitle: "Noah Fant — Seahawks #87",
    team: "seahawks",
    arcana: "major",
    numeral: "XVIII",
    img: "assets/cards/the-moon-xviii-fant.jpg",
    thumb: "assets/cards/the-moon-xviii-fant.jpg",
    tags: ["Fant", "Moon", "Seahawks"]
  },
  // Add the rest...
];

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const teamFilter = document.getElementById("teamFilter");
const typeFilter = document.getElementById("typeFilter");

const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalTeam = document.getElementById("modalTeam");
const modalArcana = document.getElementById("modalArcana");
const copyLink = document.getElementById("copyLink");
const openImage = document.getElementById("openImage");

document.getElementById("year").textContent = new Date().getFullYear();

function teamLabel(team){
  if(team === "patriots") return "Patriots";
  if(team === "seahawks") return "Seahawks";
  return "Neutral";
}

function render(cards){
  grid.innerHTML = "";
  cards.forEach(card => {
    const el = document.createElement("article");
    el.className = "card";
    el.tabIndex = 0;
    el.innerHTML = `
      <img class="thumb" loading="lazy" src="${card.thumb}" alt="${card.title} (${card.numeral})" />
      <div class="card-meta">
        <h3>${card.title} <span class="muted">(${card.numeral})</span></h3>
        <p>${card.subtitle}</p>
        <div class="pills">
          <span class="pill">${teamLabel(card.team)}</span>
          <span class="pill">${card.arcana === "major" ? "Major Arcana" : "Minor Arcana"}</span>
        </div>
      </div>
    `;
    el.addEventListener("click", () => openModal(card));
    el.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " ") openModal(card);
    });
    grid.appendChild(el);
  });
}

function openModal(card){
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  modalImg.src = card.img;
  modalImg.alt = `${card.title} (${card.numeral})`;
  modalTitle.textContent = `${card.title} (${card.numeral})`;
  modalSubtitle.textContent = card.subtitle;
  modalTeam.textContent = teamLabel(card.team);
  modalArcana.textContent = card.arcana === "major" ? "Major Arcana" : "Minor Arcana";

  const url = new URL(window.location.href);
  url.searchParams.set("card", card.id);
  history.replaceState({}, "", url);
  openImage.href = card.img;

  copyLink.onclick = async () => {
    await navigator.clipboard.writeText(url.toString());
    copyLink.textContent = "Copied!";
    setTimeout(() => (copyLink.textContent = "Copy link"), 900);
  };
}

function closeModal(){
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  const url = new URL(window.location.href);
  url.searchParams.delete("card");
  history.replaceState({}, "", url);
}

modalBackdrop.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
});

function applyFilters(){
  const q = (search.value || "").trim().toLowerCase();
  const team = teamFilter.value;
  const type = typeFilter.value;

  const filtered = CARDS.filter(c => {
    const matchesTeam = (team === "all") || (c.team === team);
    const matchesType = (type === "all") || (c.arcana === type);
    const hay = [c.title, c.subtitle, c.numeral, ...(c.tags || [])].join(" ").toLowerCase();
    const matchesQuery = !q || hay.includes(q);
    return matchesTeam && matchesType && matchesQuery;
  });

  render(filtered);
}

search.addEventListener("input", applyFilters);
teamFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);

render(CARDS);

// Deep link support ?card=
const params = new URLSearchParams(window.location.search);
const deepId = params.get("card");
if(deepId){
  const found = CARDS.find(c => c.id === deepId);
  if(found) openModal(found);
}
