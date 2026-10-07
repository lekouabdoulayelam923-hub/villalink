// =====================================================
// VILLALINK - SCRIPT PRINCIPAL
// =====================================================

// ===============================
// VILLAS PAR DÉFAUT
// ===============================

const DEFAULT_VILLAS = [
  {
    id: 1,
    title: "Villa Baobab",
    location: "Saly",
    price: 75000,
    rooms: 4,
    phone: "221770000000",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85",
    description: "Une belle villa moderne avec piscine et espace extérieur, idéale pour les familles et les séjours entre amis.",
    amenities: ["Piscine", "Climatisation", "Wi-Fi"]
  },
  {
    id: 2,
    title: "Villa Océan",
    location: "Mbour",
    price: 60000,
    rooms: 3,
    phone: "221770000000",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1100&q=85",
    description: "Une villa confortable avec une grande terrasse, parfaite pour profiter de l'ambiance de la Petite-Côte.",
    amenities: ["Terrasse", "Climatisation", "Parking"]
  },
  {
    id: 3,
    title: "Villa Soleil",
    location: "Saly",
    price: 95000,
    rooms: 5,
    phone: "221770000000",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1100&q=85",
    description: "Grande villa avec piscine et plusieurs chambres, adaptée aux groupes et aux familles nombreuses.",
    amenities: ["Piscine", "5 chambres", "Jardin"]
  },
  {
    id: 4,
    title: "Villa Teranga",
    location: "Mbour",
    price: 85000,
    rooms: 4,
    phone: "221770000000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1100&q=85",
    description: "Une villa élégante et chaleureuse pour profiter d'un séjour confortable sur la Petite-Côte.",
    amenities: ["Piscine", "Wi-Fi", "Cuisine équipée"]
  },
  {
    id: 5,
    title: "Villa Almadies",
    location: "Dakar",
    price: 120000,
    rooms: 4,
    phone: "221770000000",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=85",
    description: "Une adresse moderne à Dakar, pensée pour les séjours en famille ou entre amis.",
    amenities: ["Climatisation", "Wi-Fi", "Parking"]
  },
  {
    id: 6,
    title: "Villa Cocotier",
    location: "Saly",
    price: 55000,
    rooms: 3,
    phone: "221770000000",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1100&q=85",
    description: "Une villa conviviale avec espace extérieur, idéale pour un séjour agréable à prix accessible.",
    amenities: ["Jardin", "Terrasse", "Parking"]
  }
];

// ===============================
// OUTILS
// ===============================

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char];
  });
}

function price(value) {
  return new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA / nuit";
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem("villalink_session") || "null");
  } catch {
    return null;
  }
}

function getAccounts() {
  try {
    const accounts = JSON.parse(
      localStorage.getItem("villalink_accounts") || "[]"
    );
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(
    "villalink_accounts",
    JSON.stringify(accounts)
  );
}

function getCustom() {
  try {
    const villas = JSON.parse(
      localStorage.getItem("villalink_villas") || "[]"
    );
    return Array.isArray(villas) ? villas : [];
  } catch {
    return [];
  }
}

function saveCustom(villas) {
  localStorage.setItem(
    "villalink_villas",
    JSON.stringify(villas)
  );
}

function allVillas() {
  return [
    ...DEFAULT_VILLAS,
    ...getCustom().filter(
      villa => villa.status !== "attente" && villa.status !== "refuse"
    )
  ];
}

// ===============================
// ÉLÉMENTS
// ===============================

const grid = document.getElementById("villaGrid");
const message = document.getElementById("resultMessage");
const villaModal = document.getElementById("villaModal");
const ownerModal = document.getElementById("ownerModal");
const modalContent = document.getElementById("modalContent");

const dashboard = document.getElementById("dashboard");
const dashboardName = document.getElementById("dashboardName");
const dashboardRole = document.getElementById("dashboardRole");

const adminPanel = document.getElementById("adminPanel");
const adminGrid = document.getElementById("adminGrid");
const adminStats = document.getElementById("adminStats");

const favoritesPanel = document.getElementById("favoritesPanel");
const favoritesGrid = document.getElementById("favoritesGrid");

const myVillasPanel = document.getElementById("myVillasPanel");
const myVillasGrid = document.getElementById("myVillasGrid");

// ===============================
// FAVORIS
// ===============================

function getFavorites() {
  const session = getSession();

  if (!session?.email) return [];

  try {
    const data = JSON.parse(
      localStorage.getItem("villalink_favorites") || "{}"
    );

    return Array.isArray(data[session.email])
      ? data[session.email].map(Number)
      : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids) {
  const session = getSession();

  if (!session?.email) return;

  let data = {};

  try {
    data = JSON.parse(
      localStorage.getItem("villalink_favorites") || "{}"
    );
  } catch {}

  data[session.email] = ids.map(Number);

  localStorage.setItem(
    "villalink_favorites",
    JSON.stringify(data)
  );
}

function toggleFavorite(id) {
  if (!getSession()) {
    alert("Connectez-vous pour utiliser les favoris.");
    return;
  }

  const ids = getFavorites();
  const numberId = Number(id);

  if (ids.includes(numberId)) {
    saveFavorites(ids.filter(x => x !== numberId));
  } else {
    saveFavorites([...ids, numberId]);
  }

  render();
}

// ===============================
// AFFICHAGE DES VILLAS
// ===============================

function render(list = allVillas()) {
  if (!grid) return;

  grid.innerHTML = "";

  if (message) {
    message.textContent =
      `${list.length} villa${list.length > 1 ? "s" : ""} disponible${list.length > 1 ? "s" : ""}.`;
  }

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty">
        <h3>Aucune villa trouvée</h3>
        <p>Essayez une autre recherche.</p>
      </div>
    `;
    return;
  }

  const favorites = getFavorites();

  list.forEach(villa => {
    const image =
      villa.images?.[0] ||
      villa.image ||
      DEFAULT_VILLAS[0].image;

    const article = document.createElement("article");
    article.className = "card";

    article.innerHTML = `
      <div
        class="card-img"
        style="background-image:url('${safe(image)}')"
      >
        <span class="badge">✓ Disponible</span>
        <span class="city-badge">${safe(villa.location)}</span>

        <button
          type="button"
          class="favorite-btn ${favorites.includes(Number(villa.id)) ? "active" : ""}"
          data-favorite="${villa.id}"
        >♥</button>
      </div>

      <div class="card-body">
        <h3>${safe(villa.title)}</h3>

        <p class="meta">
          📍 ${safe(villa.location)}
          ·
          🛏 ${safe(villa.rooms)} chambres
        </p>

        <div class="amenities">
          ${(villa.amenities || [])
            .slice(0, 3)
            .map(a => `<span>${safe(a)}</span>`)
            .join("")}
        </div>

        <span class="price">
          ${price(villa.price)}
        </span>

        <div class="card-bottom">
          <button
            type="button"
            class="btn outline"
            data-view="${villa.id}"
          >
            Voir détails
          </button>

          <a
            class="btn primary"
            target="_blank"
            rel="noopener"
            href="https://wa.me/${safe(villa.phone)}?text=${encodeURIComponent(
              "Bonjour, je suis intéressé(e) par " +
              villa.title +
              " sur VillaLink."
            )}"
          >
            WhatsApp
          </a>
        </div>
      </div>
    `;

    grid.appendChild(article);
  });

  grid.querySelectorAll("[data-view]").forEach(button => {
    button.onclick = () => {
      openVilla(Number(button.dataset.view));
    };
  });

  grid.querySelectorAll("[data-favorite]").forEach(button => {
    button.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      toggleFavorite(Number(button.dataset.favorite));
    };
  });
}

// ===============================
// DÉTAIL VILLA
// ===============================

function openVilla(id) {
  const villa = allVillas().find(
    item => Number(item.id) === Number(id)
  );

  if (!villa || !modalContent || !villaModal) return;

  const images =
    Array.isArray(villa.images) && villa.images.length
      ? villa.images
      : [villa.image];

  modalContent.innerHTML = `
    <div class="villa-gallery">

      <div
        class="gallery-main"
        id="galleryMain"
        style="background-image:url('${safe(images[0])}')"
      >
        <button
          type="button"
          class="gallery-arrow gallery-prev"
        >‹</button>

        <button
          type="button"
          class="gallery-arrow gallery-next"
        >›</button>

        <span
          class="gallery-counter"
          id="galleryCounter"
        >
          1 / ${images.length}
        </span>
      </div>

      <div class="gallery-thumbs">
        ${images.map((image, index) => `
          <button
            type="button"
            class="gallery-thumb ${index === 0 ? "active" : ""}"
            data-gallery-index="${index}"
          >
            <img
              src="${safe(image)}"
              alt="Photo ${index + 1}"
            >
          </button>
        `).join("")}
      </div>

    </div>

    <div class="eyebrow">
      ${safe(villa.location)}
      ·
      ${safe(villa.rooms)} chambres
    </div>

    <h2>${safe(villa.title)}</h2>

    <p class="modal-price">
      ${price(villa.price)}
    </p>

    <div class="modal-amenities">
      ${(villa.amenities || [])
        .map(a => `<span>✓ ${safe(a)}</span>`)
        .join("")}
    </div>

    <p style="margin-top:16px">
      ${safe(villa.description)}
    </p>

    <a
      class="btn primary"
      style="margin-top:22px"
      target="_blank"
      rel="noopener"
      href="https://wa.me/${safe(villa.phone)}?text=${encodeURIComponent(
        "Bonjour, je suis intéressé(e) par " +
        villa.title +
        " sur VillaLink."
      )}"
    >
      Contacter le propriétaire
    </a>
  `;

  let current = 0;

  const main = document.getElementById("galleryMain");
  const counter = document.getElementById("galleryCounter");

  function showImage(index) {
    current =
      (index + images.length) % images.length;

    main.style.backgroundImage =
      `url('${safe(images[current])}')`;

    counter.textContent =
      `${current + 1} / ${images.length}`;

    modalContent
      .querySelectorAll("[data-gallery-index]")
      .forEach(button => {
        button.classList.toggle(
          "active",
          Number(button.dataset.galleryIndex) === current
        );
      });
  }

  modalContent
    .querySelector(".gallery-prev")
    ?.addEventListener("click", () => {
      showImage(current - 1);
    });

  modalContent
    .querySelector(".gallery-next")
    ?.addEventListener("click", () => {
      showImage(current + 1);
    });

  modalContent
    .querySelectorAll("[data-gallery-index]")
    .forEach(button => {
      button.addEventListener("click", () => {
        showImage(Number(button.dataset.galleryIndex));
      });
    });

  villaModal.classList.remove("hidden");
}

// ===============================
// RECHERCHE
// ===============================

function applyFilters() {
  const location =
    document.getElementById("locationInput")?.value
      .trim()
      .toLowerCase() || "";

  const rooms =
    Number(
      document.getElementById("roomsInput")?.value || 0
    );

  const max =
    Number(
      document.getElementById("priceInput")?.value || 0
    );

  const result = allVillas().filter(villa => {
    const locationOK =
      !location ||
      String(villa.location)
        .toLowerCase()
        .includes(location);

    const roomsOK =
      !rooms || Number(villa.rooms) >= rooms;

    const priceOK =
      !max || Number(villa.price) <= max;

    return locationOK && roomsOK && priceOK;
  });

  render(result);
}

document
  .getElementById("searchForm")
  ?.addEventListener("submit", event => {
    event.preventDefault();
    saveSearch();
    applyFilters();

    document
      .getElementById("villas")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  });

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".filter")
      .forEach(item =>
        item.classList.remove("active")
      );

    button.classList.add("active");

    const city = button.dataset.city;

    if (city) {
      render(
        allVillas().filter(
          villa => villa.location === city
        )
      );
    } else {
      render();
    }

    document
      .getElementById("villas")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  });
});

document
  .getElementById("resetSearch")
  ?.addEventListener("click", () => {
    document.getElementById("searchForm")?.reset();

    document
      .querySelectorAll(".filter")
      .forEach(item =>
        item.classList.remove("active")
      );

    document
      .querySelector('.filter[data-city=""]')
      ?.classList.add("active");

    render();
  });

// ===============================
// MODALES
// ===============================

document
  .getElementById("openOwner")
  ?.addEventListener("click", () => {
    ownerModal?.classList.remove("hidden");
  });

document
  .querySelectorAll("[data-close]")
  .forEach(button => {
    button.addEventListener("click", () => {
      villaModal?.classList.add("hidden");
      ownerModal?.classList.add("hidden");
    });
  });

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });
});

// ===============================
// PHOTOS PROPRIÉTAIRE
// ===============================

const photoFiles =
  document.getElementById("photoFiles");

const photoPreview =
  document.getElementById("photoPreview");

const videoFiles =
  document.getElementById("videoFiles");

const videoPreview =
  document.getElementById("videoPreview");

let selectedPhotoData = "";
let selectedPhotoDataList = [];
let selectedVideoDataList = [];

function compressImage(
  file,
  maxWidth = 800,
  quality = 0.5
) {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const scale =
          Math.min(1, maxWidth / image.width);

        const canvas =
          document.createElement("canvas");

        canvas.width =
          Math.round(image.width * scale);

        canvas.height =
          Math.round(image.height * scale);

        const context =
          canvas.getContext("2d");

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

        resolve(
          canvas.toDataURL(
            "image/jpeg",
            quality
          )
        );
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

photoFiles?.addEventListener(
  "change",
  async () => {
    const files = [
      ...photoFiles.files
    ];

    if (!files.length) return;

    const remaining =
      5 - selectedPhotoDataList.length;

    if (remaining <= 0) {
      alert(
        "Vous pouvez ajouter jusqu'à 5 photos."
      );
      return;
    }

    for (
      const file of files.slice(0, remaining)
    ) {
      const data =
        await compressImage(file);

      selectedPhotoDataList.push(data);

      if (!selectedPhotoData) {
        selectedPhotoData = data;
      }

      const box =
        document.createElement("div");

      box.className = "photo-thumb";

      box.innerHTML = `
        <img
          src="${data}"
          alt="Photo de villa"
        >
      `;

      photoPreview?.appendChild(box);
    }

    updateOwnerPreview();
  }
);
// ===============================
// VIDÉOS PROPRIÉTAIRE
// ===============================

videoFiles?.addEventListener(
  "change",
  () => {
    const files = [
      ...videoFiles.files
    ];

    if (!files.length) return;

    const remaining =
      2 - selectedVideoDataList.length;

    if (remaining <= 0) {
      alert(
        "Vous pouvez ajouter jusqu'à 2 vidéos."
      );
      return;
    }

    for (
      const file of files.slice(0, remaining)
    ) {
      if (!file.type.startsWith("video/")) {
        continue;
      }

      const reader =
        new FileReader();

      reader.onload = () => {
        const data = reader.result;

        selectedVideoDataList.push(data);

        const box =
          document.createElement("div");

        box.className = "photo-thumb";

        box.innerHTML = `
          <video
            src="${data}"
            controls
            playsinline
            style="width:100%;border-radius:12px;"
          ></video>
        `;

        videoPreview?.appendChild(box);
      };

      reader.readAsDataURL(file);
    }
  }
);

// ===============================
// FORMULAIRE PROPRIÉTAIRE
// ===============================

const ownerForm =
  document.getElementById("ownerForm");

const ownerPreview =
  document.getElementById("ownerPreview");

function updateOwnerPreview() {
  if (!ownerForm || !ownerPreview) return;

  const data =
    Object.fromEntries(
      new FormData(ownerForm).entries()
    );

  const amenities =
    [...ownerForm.querySelectorAll(
      'input[name="amenity"]:checked'
    )].map(input => input.value);

  const image =
    selectedPhotoData ||
    data.image ||
    DEFAULT_VILLAS[0].image;

  ownerPreview.innerHTML = `
    <div class="preview-card">

      <div
        class="preview-card-img"
        style="background-image:url('${safe(image)}')"
      ></div>

      <div class="preview-card-body">

        <div class="eyebrow">
          APERÇU
        </div>

        <h3>
          ${safe(data.title || "Nom de votre villa")}
        </h3>

        <p>
          📍 ${safe(data.location || "Votre localisation")}
          ·
          🛏 ${safe(data.rooms || "—")} chambres
        </p>

        <strong class="price">
          ${
            data.price
              ? price(data.price)
              : "Prix à renseigner"
          }
        </strong>

        <div class="amenities">
          ${amenities
            .map(a => `<span>${safe(a)}</span>`)
            .join("")}
        </div>

      </div>
    </div>
  `;
}

ownerForm?.addEventListener(
  "input",
  updateOwnerPreview
);

ownerForm?.addEventListener(
  "change",
  updateOwnerPreview
);

ownerForm?.addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const data =
      Object.fromEntries(
        new FormData(event.target).entries()
      );

    const session = getSession();

    if (!session) {
      alert(
        "Vous devez créer un compte ou vous connecter."
      );
      return;
    }

    const amenities =
      [...event.target.querySelectorAll(
        'input[name="amenity"]:checked'
      )].map(input => input.value);

    const images =
      selectedPhotoDataList.length
        ? [...selectedPhotoDataList]
        : [
            data.image ||
            DEFAULT_VILLAS[0].image
          ];
    const videos =
  selectedVideoDataList.length
    ? [...selectedVideoDataList]
    : [];

    const villa = {
      id: Date.now(),
      status: "attente",
      title: data.title || "Nouvelle villa",
      location: data.location || "",
      price: Number(data.price || 0),
      rooms: Number(data.rooms || 0),
      phone: String(data.phone || "")
        .replace(/\D/g, ""),
      image: images[0],
      images,
      videos,
      description: data.description || "",
      amenities:
        amenities.length
          ? amenities
          : ["Nouvelle annonce"],
      ownerEmail: session.email,
      ownerName: session.name || ""
    };

    const villas = getCustom();

    const editingId =
      event.target.dataset.editingId;

    if (editingId) {
      const index =
        villas.findIndex(
          item =>
            Number(item.id) ===
              Number(editingId) &&
            String(item.ownerEmail)
              .toLowerCase() ===
              String(session.email)
                .toLowerCase()
        );

      if (index >= 0) {
        villa.id = villas[index].id;
        villas[index] = villa;
      }
    } else {
      villas.push(villa);
    }

    saveCustom(villas);

    delete event.target.dataset.editingId;

    event.target.reset();

    selectedPhotoData = "";
    selectedPhotoDataList = [];

    if (photoPreview) {
      photoPreview.innerHTML = "";
    }

    updateOwnerPreview();

    ownerModal?.classList.add("hidden");

    render();

    alert(
      editingId
        ? "Votre annonce a été modifiée."
        : "Votre annonce a été envoyée. Elle est en attente de validation."
    );
  }
);

// ===============================
// AUTHENTIFICATION
// ===============================

const authForm =
  document.getElementById("authForm");

const authTitle =
  document.getElementById("authTitle");

const authSubmit =
  document.getElementById("authSubmit");

const authToggle =
  document.getElementById("authToggle");

const authModal =
  document.getElementById("authModal");

const openLogin =
  document.getElementById("openLogin");

const openSignup =
  document.getElementById("openSignup");

const closeAuth =
  document.getElementById("closeAuth");

let authMode = "login";
let authRole = "locataire";

// ===============================
// MISE À JOUR AUTH
// ===============================

function updateAuth() {
  if (!authTitle || !authSubmit) return;

  const signup =
    authMode === "signup";

  authTitle.textContent =
    signup
      ? "Créer un compte"
      : "Se connecter";

  authSubmit.textContent =
    signup
      ? "Créer mon compte"
      : "Se connecter";

  const nameField =
    document.getElementById("authName") ||
    document.getElementById("name");

  if (nameField) {
    const container =
      nameField.closest(".form-group") ||
      nameField.parentElement;

    if (container) {
      container.style.display =
        signup ? "" : "none";
    }

    nameField.required = signup;
  }

  if (authToggle) {
    authToggle.textContent =
      signup
        ? "Déjà un compte ? Se connecter"
        : "Pas encore de compte ? Créer un compte";
  }
}

// ===============================
// CHOIX DU RÔLE
// ===============================

document.querySelectorAll(".role").forEach(
  button => {
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        authRole =
          button.dataset.role ||
          "locataire";

        document
          .querySelectorAll(".role")
          .forEach(item =>
            item.classList.remove("active")
          );

        button.classList.add("active");

        console.log(
          "Rôle sélectionné :",
          authRole
        );
      }
    );
  }
);

// ===============================
// OUVRIR CONNEXION
// ===============================

function openAuth(mode) {
  authMode = mode;

  updateAuth();

  authModal?.classList.remove("hidden");
}

openLogin?.addEventListener(
  "click",
  event => {
    event.preventDefault();

    const session = getSession();

    if (session) {
      dashboard?.scrollIntoView({
        behavior: "smooth"
      });
      return;
    }

    openAuth("login");
  }
);

openSignup?.addEventListener(
  "click",
  event => {
    event.preventDefault();

    openAuth("signup");
  }
);

closeAuth?.addEventListener(
  "click",
  () => {
    authModal?.classList.add("hidden");
  }
);

authToggle?.addEventListener(
  "click",
  event => {
    event.preventDefault();

    authMode =
      authMode === "login"
        ? "signup"
        : "login";

    updateAuth();
  }
);

// ===============================
// CONNEXION / INSCRIPTION
// ===============================

authForm?.addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const emailInput =
      document.getElementById("email");

    const passwordInput =
      document.getElementById("password");

    const nameInput =
      document.getElementById("name") ||
      document.getElementById("authName");

    const email =
      emailInput?.value
        .trim()
        .toLowerCase() || "";

    const password =
      passwordInput?.value || "";

    const name =
      nameInput?.value.trim() || "";

    if (!email || !password) {
      alert(
        "Veuillez remplir votre email et votre mot de passe."
      );
      return;
    }

    let accounts =
      getAccounts();

    // ---------------------------
    // INSCRIPTION
    // ---------------------------

    if (authMode === "signup") {

      const exists =
        accounts.some(
          account =>
            String(account.email)
              .toLowerCase() === email
        );

      if (exists) {
        alert(
          "Cette adresse email possède déjà un compte."
        );
        return;
      }

      const account = {
        id: Date.now(),
        name:
          name || "Utilisateur",
        email,
        password,
        role:
          authRole || "locataire"
      };

      accounts.push(account);

      saveAccounts(accounts);

      localStorage.setItem(
        "villalink_session",
        JSON.stringify(account)
      );

      authModal?.classList.add(
        "hidden"
      );

      showDashboard(account);

      return;
    }

    // ---------------------------
    // CONNEXION
    // ---------------------------

    const account =
      accounts.find(
        item =>
          String(item.email)
            .toLowerCase() === email &&
          String(item.password) ===
            password
      );

    if (!account) {
      alert(
        "Email ou mot de passe incorrect."
      );
      return;
    }

    const session = {
      id: account.id,
      name: account.name,
      email: account.email,
      role:
        account.role || "locataire"
    };

    localStorage.setItem(
      "villalink_session",
      JSON.stringify(session)
    );

    authModal?.classList.add(
      "hidden"
    );

    showDashboard(session);
  }
);

// ===============================
// TABLEAU DE BORD
// ===============================

function showDashboard(session) {
  if (!dashboard || !session) return;

  dashboard.classList.remove("hidden");
  dashboard.style.display = "block";
  dashboard.hidden = false;

  if (dashboardName) {
    dashboardName.textContent =
      session.name || "Utilisateur";
  }

  const role =
    session.role || "locataire";

  if (dashboardRole) {
    dashboardRole.textContent =
      role === "admin"
        ? "🛡️ Administrateur"
        : role === "proprietaire"
        ? "🏠 Propriétaire"
        : "👤 Locataire";
  }

  document
    .querySelectorAll(".owner-only")
    .forEach(element => {
      element.style.display =
        role === "proprietaire"
          ? ""
          : "none";
    });

  document
    .querySelectorAll(".admin-only")
    .forEach(element => {
      element.classList.toggle(
        "hidden",
        role !== "admin"
      );
    });

  if (openLogin) {
    openLogin.textContent =
      "Mon espace";
  }

  if (openSignup) {
    openSignup.style.display =
      "none";
  }

  dashboard.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function hideDashboard() {
  dashboard?.classList.add("hidden");

  if (openLogin) {
    openLogin.textContent =
      "Se connecter";
  }

  if (openSignup) {
    openSignup.style.display =
      "";
  }
}

document
  .getElementById("logoutBtn")
  ?.addEventListener(
    "click",
    () => {
      localStorage.removeItem(
        "villalink_session"
      );

      hideDashboard();

      alert(
        "Vous êtes déconnecté de VillaLink."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );

// ===============================
// MES VILLAS
// ===============================

function showMyVillas() {
  const session = getSession();

  if (
    !session ||
    session.role !== "proprietaire"
  ) {
    alert(
      "Cette section est réservée aux propriétaires."
    );
    return;
  }

  const mine =
    getCustom().filter(
      villa =>
        String(villa.ownerEmail)
          .toLowerCase() ===
        String(session.email)
          .toLowerCase()
    );

  if (!myVillasGrid) return;

  if (!mine.length) {
    myVillasGrid.innerHTML = `
      <div class="empty">
        <h3>Aucune villa</h3>
        <p>Vous n'avez pas encore publié de villa.</p>
      </div>
    `;

    myVillasPanel?.classList.remove(
      "hidden"
    );

    return;
  }

  myVillasGrid.innerHTML =
    mine.map(villa => `
      <article class="my-villa-card">

        <div
          class="my-villa-img"
          style="background-image:url('${safe(
            villa.images?.[0] ||
            villa.image
          )}')"
        ></div>

        <div class="my-villa-body">

          <div class="eyebrow">
            ${safe(villa.location)}
          </div>

          <h4>
            ${safe(villa.title)}
          </h4>

          <p>
            🛏 ${safe(villa.rooms)}
            chambres ·
            ${price(villa.price)}
          </p>

          <div class="listing-status">
            ${
              villa.status === "publie"
                ? "🟢 Publiée"
                : villa.status === "refuse"
                ? "🔴 Refusée"
                : "🟠 En attente"
            }
          </div>

          <div class="my-villa-actions">

            <button
              type="button"
              class="btn outline"
              data-my-villa="${villa.id}"
            >
              Voir
            </button>

            <button
              type="button"
              class="btn outline"
              data-edit-villa="${villa.id}"
            >
              Modifier
            </button>

            <button
              type="button"
              class="btn danger"
              data-delete-villa="${villa.id}"
            >
              Supprimer
            </button>

          </div>

        </div>

      </article>
    `).join("");

  myVillasGrid
    .querySelectorAll("[data-my-villa]")
    .forEach(button => {
      button.onclick = () =>
        openVilla(
          Number(
            button.dataset.myVilla
          )
        );
    });

  myVillasGrid
    .querySelectorAll("[data-delete-villa]")
    .forEach(button => {
      button.onclick = () =>
        deleteMyVilla(
          Number(
            button.dataset.deleteVilla
          )
        );
    });

  myVillasPanel?.classList.remove(
    "hidden"
  );

  myVillasPanel?.scrollIntoView({
    behavior: "smooth"
  });
}

document
  .getElementById("myVillasBtn")
  ?.addEventListener(
    "click",
    showMyVillas
  );

function deleteMyVilla(id) {
  const session = getSession();

  if (!session) return;

  const villas = getCustom();

  const villa =
    villas.find(
      item =>
        Number(item.id) === Number(id) &&
        String(item.ownerEmail)
          .toLowerCase() ===
          String(session.email)
            .toLowerCase()
    );

  if (!villa) return;

  if (
    !confirm(
      `Supprimer définitivement « ${villa.title} » ?`
    )
  ) {
    return;
  }

  saveCustom(
    villas.filter(
      item =>
        Number(item.id) !== Number(id)
    )
  );

  render();
  showMyVillas();

  alert("Villa supprimée.");
}

// ===============================
// ADMINISTRATION
// ===============================

let adminFilter = "toutes";
let adminSearch = "";

function showAdmin() {
  const session = getSession();

  if (
    !session ||
    session.role !== "admin"
  ) {
    alert(
      "Accès réservé à l’administrateur."
    );
    return;
  }

  const villas = getCustom();

  const waiting =
    villas.filter(
      v => v.status === "attente"
    ).length;

  const published =
    villas.filter(
      v => v.status === "publie"
    ).length;

  const refused =
    villas.filter(
      v => v.status === "refuse"
    ).length;

  if (adminStats) {
    adminStats.innerHTML = `
      <div>
        <strong>${villas.length}</strong>
        <span>Total</span>
      </div>

      <div>
        <strong>${waiting}</strong>
        <span>En attente</span>
      </div>

      <div>
        <strong>${published}</strong>
        <span>Publiées</span>
      </div>

      <div>
        <strong>${refused}</strong>
        <span>Refusées</span>
      </div>
    `;
  }

  const search =
    adminSearch
      .trim()
      .toLowerCase();

  const filtered =
    villas.filter(villa => {
      const statusOK =
        adminFilter === "toutes" ||
        villa.status === adminFilter;

      const text =
        [
          villa.title,
          villa.location,
          villa.ownerName,
          villa.ownerEmail
        ]
          .join(" ")
          .toLowerCase();

      return (
        statusOK &&
        (!search ||
          text.includes(search))
      );
    });

  if (adminGrid) {
    adminGrid.innerHTML =
      filtered.length
        ? filtered.map(villa => `
          <article class="admin-card">

            <div
              class="admin-img"
              style="background-image:url('${safe(
                villa.image
              )}')"
            ></div>

            <div class="admin-body">

              <div class="eyebrow">
                ${safe(villa.location)}
                ·
                ${
                  villa.status === "publie"
                    ? "🟢 Publiée"
                    : villa.status === "refuse"
                    ? "🔴 Refusée"
                    : "🟠 En attente"
                }
              </div>

              <h4>
                ${safe(villa.title)}
              </h4>

              <p>
                👤 ${safe(
                  villa.ownerName ||
                  "Propriétaire"
                )}
              </p>

              <p>
                ✉️ ${safe(
                  villa.ownerEmail ||
                  "Email non renseigné"
                )}
              </p>

              <p>
                🛏 ${safe(villa.rooms)}
                chambres ·
                ${price(villa.price)}
              </p>

              <div class="admin-actions">

                <button
                  class="btn outline"
                  data-admin-view="${villa.id}"
                >
                  Voir
                </button>

                <button
                  class="btn primary"
                  data-admin-approve="${villa.id}"
                >
                  ✓ Accepter
                </button>

                <button
                  class="btn danger"
                  data-admin-refuse="${villa.id}"
                >
                  ✕ Refuser
                </button>

                <button
                  class="btn danger"
                  data-admin-delete="${villa.id}"
                >
                  🗑️ Supprimer
                </button>

              </div>

            </div>
          </article>
        `).join("")
        : `
          <div class="empty">
            <h3>Aucune annonce trouvée</h3>
          </div>
        `;

    adminGrid
      .querySelectorAll("[data-admin-view]")
      .forEach(button => {
        button.onclick = () =>
          openVilla(
            Number(
              button.dataset.adminView
            )
          );
      });

    adminGrid
      .querySelectorAll("[data-admin-approve]")
      .forEach(button => {
        button.onclick = () =>
          adminSetStatus(
            Number(
              button.dataset.adminApprove
            ),
            "publie"
          );
      });

    adminGrid
      .querySelectorAll("[data-admin-refuse]")
      .forEach(button => {
        button.onclick = () =>
          adminSetStatus(
            Number(
              button.dataset.adminRefuse
            ),
            "refuse"
          );
      });

    adminGrid
      .querySelectorAll("[data-admin-delete]")
      .forEach(button => {
        button.onclick = () =>
          adminDelete(
            Number(
              button.dataset.adminDelete
            )
          );
      });
  }

  adminPanel?.classList.remove(
    "hidden"
  );

  adminPanel?.scrollIntoView({
    behavior: "smooth"
  });
}

function adminSetStatus(id, status) {
  const session = getSession();

  if (session?.role !== "admin") return;

  const villas = getCustom();

  const villa =
    villas.find(
      item =>
        Number(item.id) === Number(id)
    );

  if (!villa) return;

  villa.status = status;

  saveCustom(villas);

  render();
  showAdmin();

  alert(
    status === "publie"
      ? "✅ Annonce acceptée et publiée !"
      : "🔴 Annonce refusée."
  );
}

function adminDelete(id) {
  const session = getSession();

  if (session?.role !== "admin") return;

  const villas = getCustom();

  const villa =
    villas.find(
      item =>
        Number(item.id) === Number(id)
    );

  if (!villa) return;

  if (
    !confirm(
      `Supprimer définitivement « ${villa.title} » ?`
    )
  ) {
    return;
  }

  saveCustom(
    villas.filter(
      item =>
        Number(item.id) !== Number(id)
    )
  );

  render();
  showAdmin();
}

document
  .getElementById("adminBtn")
  ?.addEventListener(
    "click",
    showAdmin
  );

document
  .getElementById("closeAdmin")
  ?.addEventListener(
    "click",
    () => {
      adminPanel?.classList.add(
        "hidden"
      );
    }
  );

// ===============================
// FAVORIS - ESPACE
// ===============================

function showFavorites() {
  const session = getSession();

  if (!session) {
    alert(
      "Connectez-vous pour utiliser vos favoris."
    );
    return;
  }

  if (!favoritesGrid) return;

  const ids = getFavorites();

  const villas =
    allVillas().filter(
      villa =>
        ids.includes(Number(villa.id))
    );

  if (!villas.length) {
    favoritesGrid.innerHTML = `
      <div class="empty">
        <h3>Aucun favori pour le moment</h3>
        <p>Cliquez sur ❤️ pour enregistrer une villa.</p>
      </div>
    `;
  } else {
    favoritesGrid.innerHTML =
      villas.map(villa => `
        <article class="my-villa-card">

          <div
            class="my-villa-img"
            style="background-image:url('${safe(
              villa.image
            )}')"
          ></div>

          <div class="my-villa-body">

            <div class="eyebrow">
              ${safe(villa.location)}
            </div>

            <h4>
              ${safe(villa.title)}
            </h4>

            <p>
              🛏 ${safe(villa.rooms)}
              chambres ·
              ${price(villa.price)}
            </p>

            <button
              class="btn outline"
              data-favorite-view="${villa.id}"
            >
              Voir l’annonce
            </button>

            <button
              class="btn danger"
              data-remove-favorite="${villa.id}"
            >
              Retirer ❤️
            </button>

          </div>
        </article>
      `).join("");

    favoritesGrid
      .querySelectorAll(
        "[data-favorite-view]"
      )
      .forEach(button => {
        button.onclick = () =>
          openVilla(
            Number(
              button.dataset.favoriteView
            )
          );
      });

    favoritesGrid
      .querySelectorAll(
        "[data-remove-favorite]"
      )
      .forEach(button => {
        button.onclick = () => {
          saveFavorites(
            getFavorites().filter(
              id =>
                id !==
                Number(
                  button.dataset
                    .removeFavorite
                )
            )
          );

          showFavorites();
          render();
        };
      });
  }

  favoritesPanel?.classList.remove(
    "hidden"
  );

  favoritesPanel?.scrollIntoView({
    behavior: "smooth"
  });
}

document
  .getElementById("favoritesBtn")
  ?.addEventListener(
    "click",
    showFavorites
  );

// ===============================
// HISTORIQUE RECHERCHES
// ===============================

function getSearchHistory() {
  const session = getSession();

  if (!session?.email) return [];

  try {
    const data = JSON.parse(
      localStorage.getItem(
        "villalink_searches"
      ) || "{}"
    );

    return Array.isArray(
      data[session.email]
    )
      ? data[session.email]
      : [];
  } catch {
    return [];
  }
}

function saveSearch() {
  const session = getSession();

  if (!session?.email) return;

  const location =
    document.getElementById(
      "locationInput"
    )?.value.trim() || "";

  const rooms =
    document.getElementById(
      "roomsInput"
    )?.value || "";

  const max =
    document.getElementById(
      "priceInput"
    )?.value || "";

  if (!location && !rooms && !max) {
    return;
  }

  let data = {};

  try {
    data = JSON.parse(
      localStorage.getItem(
        "villalink_searches"
      ) || "{}"
    );
  } catch {}

  const list =
    Array.isArray(data[session.email])
      ? data[session.email]
      : [];

  const item = {
    id: Date.now(),
    location,
    rooms,
    max,
    date: new Date().toLocaleString(
      "fr-FR"
    )
  };

  data[session.email] = [
    item,
    ...list
  ].slice(0, 10);

  localStorage.setItem(
    "villalink_searches",
    JSON.stringify(data)
  );
}

function showSearches() {
  const session = getSession();

  if (!session) {
    alert(
      "Connectez-vous pour voir vos recherches."
    );
    return;
  }

  const panel =
    document.getElementById(
      "searchesPanel"
    );

  const searchGrid =
    document.getElementById(
      "searchesGrid"
    );

  if (!panel || !searchGrid) return;

  const list =
    getSearchHistory();

  if (!list.length) {
    searchGrid.innerHTML = `
      <div class="empty">
        <h3>Aucune recherche enregistrée</h3>
        <p>Vos recherches apparaîtront ici.</p>
      </div>
    `;
  } else {
    searchGrid.innerHTML =
      list.map(item => `
        <article class="search-history-card">

          <div>
            <div class="eyebrow">
              ${safe(item.date)}
            </div>

            <h4>
              ${safe(
                item.location ||
                "Toutes les villes"
              )}
            </h4>
          </div>

          <button
            class="btn outline"
            data-delete-search="${item.id}"
          >
            Supprimer
          </button>

        </article>
      `).join("");

    searchGrid
      .querySelectorAll(
        "[data-delete-search]"
      )
      .forEach(button => {
        button.onclick = () => {
          deleteSearch(
            Number(
              button.dataset.deleteSearch
            )
          );
        };
      });
  }

  panel.classList.remove("hidden");

  panel.scrollIntoView({
    behavior: "smooth"
  });
}

function deleteSearch(id) {
  const session = getSession();

  if (!session?.email) return;

  let data = {};

  try {
    data = JSON.parse(
      localStorage.getItem(
        "villalink_searches"
      ) || "{}"
    );
  } catch {}

  data[session.email] =
    getSearchHistory().filter(
      item =>
        Number(item.id) !== Number(id)
    );

  localStorage.setItem(
    "villalink_searches",
    JSON.stringify(data)
  );

  showSearches();
}

document
  .getElementById("searchesBtn")
  ?.addEventListener(
    "click",
    showSearches
  );

// ===============================
// MENU MOBILE
// ===============================

document
  .getElementById("menuBtn")
  ?.addEventListener(
    "click",
    () => {
      document
        .querySelector(".header nav")
        ?.classList.toggle(
          "mobile-open"
        );
    }
  );

// ===============================
// SESSION EXISTANTE
// ===============================

function restoreSession() {
  const session = getSession();

  if (session) {
    showDashboard(session);
  }
}

// ===============================
// INITIALISATION
// ===============================

updateAuth();
updateOwnerPreview();
render();
restoreSession();

console.log(
  "✅ VillaLink chargé correctement."
);
