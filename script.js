const defaultVillas = [
  {
    id: 1, title: "Villa Baobab", location: "Saly", price: 75000, rooms: 4,
    phone: "221770000000",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
    description: "Belle villa avec piscine, jardin et espace extérieur, idéale pour un séjour en famille."
  },
  {
    id: 2, title: "Villa Océan", location: "Mbour", price: 60000, rooms: 3,
    phone: "221770000000",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=80",
    description: "Villa confortable proche de la mer, avec un grand salon et une terrasse."
  },
  {
    id: 3, title: "Villa Soleil", location: "Saly", price: 95000, rooms: 5,
    phone: "221770000000",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
    description: "Grande villa pour groupes et familles, avec piscine et plusieurs chambres."
  }
];

let customVillas = JSON.parse(localStorage.getItem("villalink_villas") || "[]");
let villas = [...defaultVillas, ...customVillas];

const grid = document.getElementById("villaGrid");
const resultMessage = document.getElementById("resultMessage");
const villaModal = document.getElementById("villaModal");
const ownerModal = document.getElementById("ownerModal");
const modalContent = document.getElementById("modalContent");

function formatPrice(value) {
  return new Intl.NumberFormat("fr-FR").format(Number(value)) + " FCFA / nuit";
}

function renderVillas(list = villas) {
  grid.innerHTML = "";
  resultMessage.textContent = `${list.length} villa${list.length > 1 ? "s" : ""} trouvée${list.length > 1 ? "s" : ""}.`;

  if (!list.length) {
    grid.innerHTML = "<p>Aucune villa ne correspond à votre recherche.</p>";
    return;
  }

  list.forEach(villa => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-img" style="background-image:url('${villa.image}')"></div>
      <div class="card-body">
        <h3>${escapeHtml(villa.title)}</h3>
        <p class="meta">📍 ${escapeHtml(villa.location)} · 🛏 ${villa.rooms} chambres</p>
        <span class="price">${formatPrice(villa.price)}</span>
        <div class="card-bottom">
          <button class="btn outline" data-view="${villa.id}">Voir détails</button>
          <a class="btn primary" target="_blank" rel="noopener" href="https://wa.me/${villa.phone}?text=${encodeURIComponent("Bonjour, je suis intéressé(e) par " + villa.title + " sur VillaLink.")}">WhatsApp</a>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  grid.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => openVilla(Number(btn.dataset.view)));
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function openVilla(id) {
  const villa = villas.find(v => v.id === id);
  if (!villa) return;
  modalContent.innerHTML = `
    <div class="modal-image" style="background-image:url('${villa.image}')"></div>
    <p class="eyebrow">${escapeHtml(villa.location)}</p>
    <h2>${escapeHtml(villa.title)}</h2>
    <p class="meta">🛏 ${villa.rooms} chambres · 💰 ${formatPrice(villa.price)}</p>
    <p>${escapeHtml(villa.description)}</p>
    <br>
    <a class="btn primary" target="_blank" rel="noopener" href="https://wa.me/${villa.phone}?text=${encodeURIComponent("Bonjour, je suis intéressé(e) par " + villa.title + " sur VillaLink.")}">Contacter le propriétaire sur WhatsApp</a>`;
  villaModal.classList.remove("hidden");
}

document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  const location = document.getElementById("locationInput").value.trim().toLowerCase();
  const rooms = Number(document.getElementById("roomsInput").value || 0);
  const maxPrice = Number(document.getElementById("priceInput").value || 0);

  const filtered = villas.filter(v => {
    const locationOk = !location || v.location.toLowerCase().includes(location);
    const roomsOk = !rooms || v.rooms >= rooms;
    const priceOk = !maxPrice || v.price <= maxPrice;
    return locationOk && roomsOk && priceOk;
  });

  renderVillas(filtered);
  document.getElementById("villas").scrollIntoView({behavior:"smooth"});
});

document.getElementById("resetSearch").addEventListener("click", () => {
  document.getElementById("searchForm").reset();
  renderVillas();
});

document.getElementById("openOwner").addEventListener("click", () => ownerModal.classList.remove("hidden"));

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    villaModal.classList.add("hidden");
    ownerModal.classList.add("hidden");
  });
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });
});

document.getElementById("ownerForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const newVilla = {
    id: Date.now(),
    title: data.title,
    location: data.location,
    price: Number(data.price),
    rooms: Number(data.rooms),
    phone: data.phone.replace(/\D/g, ""),
    image: data.image || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80",
    description: data.description
  };
  customVillas.push(newVilla);
  localStorage.setItem("villalink_villas", JSON.stringify(customVillas));
  villas = [...defaultVillas, ...customVillas];
  renderVillas();
  e.target.reset();
  ownerModal.classList.add("hidden");
  alert("Votre annonce a été ajoutée à ce prototype VillaLink.");
});

renderVillas();
