const DEFAULT_VILLAS=[
{id:1,title:"Villa Baobab",location:"Saly",price:75000,rooms:4,phone:"221770000000",image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85",description:"Une belle villa moderne avec piscine et espace extérieur, idéale pour les familles et les séjours entre amis.",amenities:["Piscine","Climatisation","Wi-Fi"]},
{id:2,title:"Villa Océan",location:"Mbour",price:60000,rooms:3,phone:"221770000000",image:"https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1100&q=85",description:"Une villa confortable avec une grande terrasse, parfaite pour profiter de l'ambiance de la Petite-Côte.",amenities:["Terrasse","Climatisation","Parking"]},
{id:3,title:"Villa Soleil",location:"Saly",price:95000,rooms:5,phone:"221770000000",image:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1100&q=85",description:"Grande villa avec piscine et plusieurs chambres, adaptée aux groupes et aux familles nombreuses.",amenities:["Piscine","5 chambres","Jardin"]},
{id:4,title:"Villa Teranga",location:"Mbour",price:85000,rooms:4,phone:"221770000000",image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1100&q=85",description:"Une villa élégante et chaleureuse pour profiter d'un séjour confortable sur la Petite-Côte.",amenities:["Piscine","Wi-Fi","Cuisine équipée"]},
{id:5,title:"Villa Almadies",location:"Dakar",price:120000,rooms:4,phone:"221770000000",image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=85",description:"Une adresse moderne à Dakar, pensée pour les séjours en famille ou entre amis.",amenities:["Climatisation","Wi-Fi","Parking"]},
{id:6,title:"Villa Cocotier",location:"Saly",price:55000,rooms:3,phone:"221770000000",image:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1100&q=85",description:"Une villa conviviale avec espace extérieur, idéale pour un séjour agréable à prix accessible.",amenities:["Jardin","Terrasse","Parking"]}
];
const grid=document.getElementById("villaGrid"),message=document.getElementById("resultMessage"),villaModal=document.getElementById("villaModal"),ownerModal=document.getElementById("ownerModal"),modalContent=document.getElementById("modalContent");
function getCustom(){try{return JSON.parse(localStorage.getItem("villalink_villas")||"[]")}catch(e){return[]}}
function allVillas(){return [...DEFAULT_VILLAS,...getCustom()]}
function price(n){return new Intl.NumberFormat("fr-FR").format(Number(n))+" FCFA / nuit"}
function safe(v){return String(v??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[x]))}
function render(list=allVillas()){
grid.innerHTML="";message.textContent=`${list.length} villa${list.length>1?"s":""} disponible${list.length>1?"s":""}.`;
if(!list.length){grid.innerHTML='<div class="empty"><h3>Aucune villa trouvée</h3><p>Essayez une autre ville ou un autre budget.</p></div>';return}
list.forEach(v=>{const el=document.createElement("article");el.className="card";el.innerHTML=`<div class="card-img" style="background-image:url('${safe(v.image)}')"><span class="badge">✓ Disponible</span><span class="city-badge">${safe(v.location)}</span></div><div class="card-body"><h3>${safe(v.title)}</h3><p class="meta">📍 ${safe(v.location)} · 🛏 ${safe(v.rooms)} chambres</p><div class="amenities">${(v.amenities||[]).slice(0,3).map(a=>`<span>${safe(a)}</span>`).join("")}</div><span class="price">${price(v.price)}</span><div class="card-bottom"><button class="btn outline" data-view="${v.id}">Voir détails</button><a class="btn primary" target="_blank" rel="noopener" href="https://wa.me/${safe(v.phone)}?text=${encodeURIComponent("Bonjour, je suis intéressé(e) par "+v.title+" sur VillaLink.")}">WhatsApp</a></div></div>`;grid.appendChild(el)});
grid.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>openVilla(Number(b.dataset.view)))}
function openVilla(id){const v=allVillas().find(x=>x.id===id);if(!v)return;modalContent.innerHTML=`<div class="modal-image" style="background-image:url('${safe(v.image)}')"></div><div class="eyebrow">${safe(v.location)} · ${safe(v.rooms)} chambres</div><h2>${safe(v.title)}</h2><p class="modal-price">${price(v.price)}</p><div class="modal-amenities">${(v.amenities||[]).map(a=>`<span>✓ ${safe(a)}</span>`).join("")}</div><p style="margin-top:16px">${safe(v.description)}</p><a class="btn primary" style="margin-top:22px" target="_blank" rel="noopener" href="https://wa.me/${safe(v.phone)}?text=${encodeURIComponent("Bonjour, je suis intéressé(e) par "+v.title+" sur VillaLink.")}">Contacter le propriétaire</a>`;villaModal.classList.remove("hidden")}
function applyFilters(){const loc=document.getElementById("locationInput").value.trim().toLowerCase(),rooms=Number(document.getElementById("roomsInput").value||0),max=Number(document.getElementById("priceInput").value||0);render(allVillas().filter(v=>(!loc||v.location.toLowerCase().includes(loc))&&(!rooms||v.rooms>=rooms)&&(!max||v.price<=max)))}
document.getElementById("searchForm").addEventListener("submit",e=>{e.preventDefault();applyFilters();document.getElementById("villas").scrollIntoView({behavior:"smooth"})});
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");const city=btn.dataset.city;render(city?allVillas().filter(v=>v.location===city):allVillas());document.getElementById("villas").scrollIntoView({behavior:"smooth",block:"start"})}));
document.getElementById("resetSearch").onclick=()=>{document.getElementById("searchForm").reset();document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));document.querySelector('.filter[data-city=""]').classList.add("active");render()};
document.getElementById("openOwner").onclick=()=>ownerModal.classList.remove("hidden");
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{villaModal.classList.add("hidden");ownerModal.classList.add("hidden")});
document.querySelectorAll(".modal").forEach(m=>m.onclick=e=>{if(e.target===m)m.classList.add("hidden")});
const photoFiles=document.getElementById("photoFiles");
const photoPreview=document.getElementById("photoPreview");
let selectedPhotoData="";
function compressImage(file,maxWidth=1200,quality=.72){
 return new Promise(resolve=>{
  const reader=new FileReader();
  reader.onload=()=>{
   const img=new Image();
   img.onload=()=>{
    const scale=Math.min(1,maxWidth/img.width),canvas=document.createElement("canvas");
    canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
    canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
    resolve(canvas.toDataURL("image/jpeg",quality));
   };
   img.src=reader.result;
  };
  reader.readAsDataURL(file);
 });
}
photoFiles?.addEventListener("change",async()=>{
 const files=[...photoFiles.files].slice(0,5);
 selectedPhotoData="";
 photoPreview.innerHTML="";
 for(const file of files){
  const data=await compressImage(file);
  if(!selectedPhotoData) selectedPhotoData=data;
  const box=document.createElement("div");box.className="photo-thumb";box.innerHTML=`<img src="${data}" alt="Photo de villa">`;photoPreview.appendChild(box);
 }
 if(files.length) photoPreview.insertAdjacentHTML("afterend",`<div class="photo-count">${files.length} photo${files.length>1?"s":""} sélectionnée${files.length>1?"s":""}</div>`);
 updateOwnerPreview();
});
const ownerForm=document.getElementById("ownerForm");
const ownerPreview=document.getElementById("ownerPreview");
function updateOwnerPreview(){
 const d=Object.fromEntries(new FormData(ownerForm).entries());
 const amenities=[...ownerForm.querySelectorAll('input[name="amenity"]:checked')].map(x=>x.value);
 const image=selectedPhotoData||d.image||DEFAULT_VILLAS[0].image;
 ownerPreview.innerHTML=`<div class="preview-card"><div class="preview-card-img" style="background-image:url('${safe(image)}')"></div><div class="preview-card-body"><div class="eyebrow">APERÇU</div><h3>${safe(d.title||"Nom de votre villa")}</h3><p>📍 ${safe(d.location||"Votre localisation")} · 🛏 ${safe(d.rooms||"—")} chambres</p><strong class="price">${d.price?price(d.price):"Prix à renseigner"}</strong><div class="amenities">${amenities.map(a=>`<span>${safe(a)}</span>`).join("")}</div></div></div>`;
}
ownerForm.addEventListener("input",updateOwnerPreview);
ownerForm.addEventListener("change",updateOwnerPreview);
ownerForm.addEventListener("submit",e=>{
 e.preventDefault();
 const d=Object.fromEntries(new FormData(e.target).entries());
 const amenities=[...e.target.querySelectorAll('input[name="amenity"]:checked')].map(x=>x.value);
 const session=JSON.parse(localStorage.getItem("villalink_session")||"null");
 const v={id:Date.now(),title:d.title,location:d.location,price:Number(d.price),rooms:Number(d.rooms),phone:d.phone.replace(/\D/g,""),image:selectedPhotoData||d.image||DEFAULT_VILLAS[0].image,description:d.description,amenities:amenities.length?amenities:["Nouvelle annonce"],ownerEmail:session?.email||"",ownerName:session?.name||""};
 const custom=getCustom();custom.push(v);localStorage.setItem("villalink_villas",JSON.stringify(custom));
 render();e.target.reset();selectedPhotoData="";photoPreview.innerHTML="";updateOwnerPreview();ownerModal.classList.add("hidden");document.getElementById("villas").scrollIntoView({behavior:"smooth"});alert("Votre annonce a été ajoutée au prototype VillaLink.");
});
updateOwnerPreview();
document.getElementById("menuBtn").onclick=()=>document.querySelector(".header nav").classList.toggle("mobile-open");
render();
// ===============================
// AUTHENTIFICATION VILLALINK
// ===============================

const authModal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authSubmit = document.getElementById("authSubmit");
const authToggle = document.getElementById("authToggle");
const authNameField = document.getElementById("authNameField");
const closeAuth = document.getElementById("closeAuth");

let authMode = "login";
let authRole = "locataire";

// Ouvrir connexion
const openLogin = document.getElementById("openLogin");

if (openLogin) {
  openLogin.addEventListener("click", () => {
    authMode = "login";
    updateAuth();
    authModal.classList.remove("hidden");
  });
}

// Ouvrir inscription
const openSignup = document.getElementById("openSignup");

if (openSignup) {
  openSignup.addEventListener("click", () => {
    authMode = "signup";
    updateAuth();
    authModal.classList.remove("hidden");
  });
}

// Fermer
if (closeAuth) {
  closeAuth.addEventListener("click", () => {
    authModal.classList.add("hidden");
  });
}

// Choix Locataire / Propriétaire
document.querySelectorAll(".role").forEach(button => {
  button.addEventListener("click", () => {

    document.querySelectorAll(".role").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    authRole = button.dataset.role;
  });
});

// Modifier l'affichage connexion / inscription
function updateAuth() {

  const inscription = authMode === "signup";

  authTitle.textContent = inscription
    ? "Créer un compte"
    : "Se connecter";

  authSubmit.textContent = inscription
    ? "Créer mon compte"
    : "Se connecter";

  authToggle.textContent = inscription
    ? "J’ai déjà un compte → Se connecter"
    : "Pas encore de compte → Créer un compte";

  if (authNameField) {
    authNameField.style.display = inscription ? "grid" : "none";
  }
}

// Passer de connexion à inscription
if (authToggle) {
  authToggle.addEventListener("click", () => {

    authMode = authMode === "login"
      ? "signup"
      : "login";

    updateAuth();
  });
}

// Traitement du formulaire
if (authForm) {

  authForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const formData = new FormData(authForm);

    const name = formData.get("name") || "";
    const email = formData.get("email");
    const password = formData.get("password");

    let accounts = [];

    try {
      accounts = JSON.parse(
        localStorage.getItem("villalink_accounts") || "[]"
      );
    } catch (error) {
      accounts = [];
    }

    // CRÉATION DE COMPTE
    if (authMode === "signup") {

      const exists = accounts.some(
        account =>
          account.email.toLowerCase() === email.toLowerCase()
      );

      if (exists) {
        alert("Un compte existe déjà avec cet email.");
        return;
      }

      const account = {
        name: name,
        email: email,
        password: password,
        role: authRole
      };

      accounts.push(account);

      localStorage.setItem(
        "villalink_accounts",
        JSON.stringify(accounts)
      );

      localStorage.setItem(
        "villalink_session",
        JSON.stringify({
          name: name,
          email: email,
          role: authRole
        })
      );

      alert("🎉 Compte VillaLink créé avec succès !");

    }

    // CONNEXION
    else {

      const account = accounts.find(
        account =>
          account.email.toLowerCase() === email.toLowerCase() &&
          account.password === password
      );

      if (!account) {
        alert("❌ Email ou mot de passe incorrect.");
        return;
      }

      localStorage.setItem(
        "villalink_session",
        JSON.stringify({
          name: account.name,
          email: account.email,
          role: account.role
        })
      );

      alert(
        "👋 Bienvenue sur VillaLink, " +
        account.name +
        " !"
      );
    }

    authForm.reset();
    authModal.classList.add("hidden");

    // Ouvrir automatiquement l'espace personnel après connexion/inscription
    const session = JSON.parse(localStorage.getItem("villalink_session") || "null");
    if (session && typeof showDashboard === "function") {
      showDashboard(session);
    }

  });
}

// Initialiser l'affichage
updateAuth();


/* ===============================
   TABLEAU DE BORD
   =============================== */
const dashboard = document.getElementById("dashboard");
const dashboardName = document.getElementById("dashboardName");
const dashboardRole = document.getElementById("dashboardRole");
const logoutBtn = document.getElementById("logoutBtn");
const myVillasBtn = document.getElementById("myVillasBtn");

function showDashboard(session){
  if(!dashboard || !session) return;
  dashboard.classList.remove("hidden");
  dashboardName.textContent = session.name || "Utilisateur";
  const owner = session.role === "proprietaire";
  dashboardRole.textContent = owner ? "🏠 Propriétaire" : "👤 Locataire";
  document.querySelectorAll(".owner-only").forEach(el => {
    el.style.display = owner ? "" : "none";
  });
  dashboard.scrollIntoView({behavior:"smooth", block:"start"});
  const loginButton=document.getElementById("openLogin");
  const signupButton=document.getElementById("openSignup");
  if(loginButton) loginButton.textContent="Mon espace";
  if(signupButton) signupButton.style.display="none";
  if(loginButton) loginButton.onclick=()=>dashboard.scrollIntoView({behavior:"smooth"});
}

function hideDashboard(){
  if(dashboard) dashboard.classList.add("hidden");
  const loginButton=document.getElementById("openLogin");
  const signupButton=document.getElementById("openSignup");
  if(loginButton) loginButton.textContent="Se connecter";
  if(loginButton) loginButton.onclick=null;
  if(signupButton) signupButton.style.display="";
}

if(logoutBtn){
  logoutBtn.addEventListener("click",()=>{
    localStorage.removeItem("villalink_session");
    hideDashboard();
    alert("Vous êtes déconnecté de VillaLink.");
    window.scrollTo({top:0,behavior:"smooth"});
  });
}

if(myVillasBtn){
  myVillasBtn.addEventListener("click",()=>{
    const session=JSON.parse(localStorage.getItem("villalink_session")||"null");
    const villas=getCustom();
    const mine=villas.filter(v=>v.ownerEmail===session?.email);
    if(!mine.length){
      alert("Vous n'avez pas encore publié de villa. Cliquez sur « Propriétaires » pour créer votre première annonce.");
      return;
    }
    document.getElementById("villas")?.scrollIntoView({behavior:"smooth"});
  });
}

document.getElementById("favoritesBtn")?.addEventListener("click",()=>{
  alert("Les favoris seront disponibles dans la prochaine version de VillaLink.");
});
document.getElementById("searchesBtn")?.addEventListener("click",()=>{
  document.getElementById("villas")?.scrollIntoView({behavior:"smooth"});
});

function restoreSession(){
  try{
    const session=JSON.parse(localStorage.getItem("villalink_session")||"null");
    if(session) showDashboard(session);
  }catch(e){}
}
restoreSession();
