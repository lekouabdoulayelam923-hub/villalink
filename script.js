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
function allVillas(){return [...DEFAULT_VILLAS,...getCustom().filter(v=>v.status!=="attente"&&v.status!=="refuse")]}
function price(n){return new Intl.NumberFormat("fr-FR").format(Number(n))+" FCFA / nuit"}
function safe(v){return String(v??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[x]))}
function getFavorites(){const s=JSON.parse(localStorage.getItem("villalink_session")||"null");if(!s?.email)return [];try{const a=JSON.parse(localStorage.getItem("villalink_favorites")||"{}");return Array.isArray(a[s.email])?a[s.email].map(Number):[]}catch(e){return []}}
function saveFavorites(ids){const s=JSON.parse(localStorage.getItem("villalink_session")||"null");if(!s?.email)return;let a={};try{a=JSON.parse(localStorage.getItem("villalink_favorites")||"{}")}catch(e){}a[s.email]=ids.map(Number);localStorage.setItem("villalink_favorites",JSON.stringify(a))}
function toggleFavorite(id){const s=JSON.parse(localStorage.getItem("villalink_session")||"null");if(!s?.email){alert("Connectez-vous pour utiliser les favoris.");return}const ids=getFavorites();saveFavorites(ids.includes(Number(id))?ids.filter(x=>x!==Number(id)):[...ids,Number(id)]);render()}
function render(list=allVillas()){
  grid.innerHTML="";
  message.textContent=`${list.length} villa${list.length>1?"s":""} disponible${list.length>1?"s":""}.`;
  if(!list.length){grid.innerHTML='<div class="empty"><h3>Aucune villa trouvée</h3><p>Essayez une autre ville ou un autre budget.</p></div>';return}
  const favorites=getFavorites();
  list.forEach(v=>{
    const el=document.createElement("article");el.className="card";
    el.innerHTML=`<div class="card-img" style="background-image:url('${safe((v.images&&v.images[0])||v.image)}')"><span class="badge">✓ Disponible</span><span class="city-badge">${safe(v.location)}</span><button class="favorite-btn ${favorites.includes(Number(v.id))?"active":""}" data-favorite="${v.id}" aria-label="Ajouter aux favoris">♥</button></div><div class="card-body"><h3>${safe(v.title)}</h3><p class="meta">📍 ${safe(v.location)} · 🛏 ${safe(v.rooms)} chambres</p><div class="amenities">${(v.amenities||[]).slice(0,3).map(a=>`<span>${safe(a)}</span>`).join("")}</div><span class="price">${price(v.price)}</span><div class="card-bottom"><button class="btn outline" data-view="${v.id}">Voir détails</button><a class="btn primary" target="_blank" rel="noopener" href="https://wa.me/${safe(v.phone)}?text=${encodeURIComponent("Bonjour, je suis intéressé(e) par "+v.title+" sur VillaLink.")}">WhatsApp</a></div></div>`;
    grid.appendChild(el);
  });
  grid.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>openVilla(Number(b.dataset.view)));
  grid.querySelectorAll("[data-favorite]").forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();toggleFavorite(Number(b.dataset.favorite))});
}
function openVilla(id){
 const v=allVillas().find(x=>x.id===id);if(!v)return;
 const images=Array.isArray(v.images)&&v.images.length?v.images:[v.image];
 modalContent.innerHTML=`<div class="villa-gallery"><div class="gallery-main" id="galleryMain" style="background-image:url('${safe(images[0])}')"><button class="gallery-arrow gallery-prev" type="button" aria-label="Photo précédente">‹</button><button class="gallery-arrow gallery-next" type="button" aria-label="Photo suivante">›</button><span class="gallery-counter" id="galleryCounter">1 / ${images.length}</span></div><div class="gallery-thumbs">${images.map((img,i)=>`<button type="button" class="gallery-thumb ${i===0?"active":""}" data-gallery-index="${i}"><img src="${safe(img)}" alt="Photo ${i+1}"></button>`).join("")}</div></div><div class="eyebrow">${safe(v.location)} · ${safe(v.rooms)} chambres</div><h2>${safe(v.title)}</h2><p class="modal-price">${price(v.price)}</p><div class="modal-amenities">${(v.amenities||[]).map(a=>`<span>✓ ${safe(a)}</span>`).join("")}</div><p style="margin-top:16px">${safe(v.description)}</p><a class="btn primary" style="margin-top:22px" target="_blank" rel="noopener" href="https://wa.me/${safe(v.phone)}?text=${encodeURIComponent("Bonjour, je suis intéressé(e) par "+v.title+" sur VillaLink.")}">Contacter le propriétaire</a>`;
 let current=0;
 const main=document.getElementById("galleryMain"),counter=document.getElementById("galleryCounter");
 const show=i=>{current=(i+images.length)%images.length;main.style.backgroundImage=`url('${safe(images[current])}')`;counter.textContent=`${current+1} / ${images.length}`;modalContent.querySelectorAll("[data-gallery-index]").forEach(b=>b.classList.toggle("active",Number(b.dataset.galleryIndex)===current))};
 modalContent.querySelector(".gallery-prev")?.addEventListener("click",()=>show(current-1));
 modalContent.querySelector(".gallery-next")?.addEventListener("click",()=>show(current+1));
 modalContent.querySelectorAll("[data-gallery-index]").forEach(b=>b.addEventListener("click",()=>show(Number(b.dataset.galleryIndex))));
 villaModal.classList.remove("hidden")
}
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
let selectedPhotoDataList=[];
function compressImage(file,maxWidth=800,quality=.5){
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
 const files=[...photoFiles.files];
 if(!files.length)return;
 const remaining=5-selectedPhotoDataList.length;
 if(remaining<=0){alert("Vous pouvez ajouter jusqu'à 5 photos.");return}
 for(const file of files.slice(0,remaining)){
  const data=await compressImage(file);
  selectedPhotoDataList.push(data);
  if(!selectedPhotoData) selectedPhotoData=data;
  const box=document.createElement("div");box.className="photo-thumb";box.innerHTML=`<img src="${data}" alt="Photo de villa">`;photoPreview.appendChild(box);
 }
 photoPreview.querySelectorAll(".photo-count").forEach(x=>x.remove());
 if(selectedPhotoDataList.length) photoPreview.insertAdjacentHTML("beforeend",`<div class="photo-count">${selectedPhotoDataList.length} photo${selectedPhotoDataList.length>1?"s":""} sélectionnée${selectedPhotoDataList.length>1?"s":""}</div>`);
 if(files.length>remaining) alert("Maximum 5 photos. Les premières photos ont été ajoutées.");
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
 const images=selectedPhotoDataList.length?[...selectedPhotoDataList]:[d.image||DEFAULT_VILLAS[0].image];
 const v={id:Date.now(),status:"attente",title:d.title,location:d.location,price:Number(d.price),rooms:Number(d.rooms),phone:d.phone.replace(/\D/g,""),image:images[0],images:images,description:d.description,amenities:amenities.length?amenities:["Nouvelle annonce"],ownerEmail:session?.email||"",ownerName:session?.name||""};
 const custom=getCustom();
 const editingId=e.target.dataset.editingId;
 if(editingId){
   const index=custom.findIndex(x=>Number(x.id)===Number(editingId)&&String(x.ownerEmail||"").toLowerCase()===String(session?.email||"").toLowerCase());
   if(index>=0){v.status="attente";custom[index]=v;}
 }else{
   custom.push(v);
 }
 try{localStorage.setItem("villalink_villas",JSON.stringify(custom))}catch(err){alert("Les photos prennent trop de place. Choisis 2 ou 3 photos et réessaie.");console.error(err);return}
 const wasEditing=!!editingId;
 delete e.target.dataset.editingId;
 render();e.target.reset();selectedPhotoData="";selectedPhotoDataList=[];photoPreview.innerHTML="";updateOwnerPreview();ownerModal.classList.add("hidden");document.getElementById("villas").scrollIntoView({behavior:"smooth"});
 alert(wasEditing?"Votre annonce a été modifiée avec succès !":"Votre annonce a été ajoutée avec "+images.length+" photo"+(images.length>1?"s":"")+" !");
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
const authNameField = document.getElementById("authName");
const closeAuth = document.getElementById("closeAuth");

let authMode = "login";
let authRole = "locataire";
const openLogin = document.getElementById("openLogin");
const openSignup = document.getElementById("openSignup");
if (closeAuth) closeAuth.addEventListener("click", () => authModal.classList.add("hidden"));
document.querySelectorAll(".role").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".role").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    authRole = button.dataset.role;
    updateAuth();
  });
});
function updateAuth() {
  const inscription = authMode === "signup";
  authTitle.textContent = inscription ? (authRole==="admin" ? "Créer un compte administrateur (test)" : "Créer un compte") : "Se connecter";
  authSubmit.textContent = inscription ? "Créer mon compte" : "Se connecter";
  authToggle.textContent = inscription ? "J’ai déjà un compte → Se connecter" : "Pas encore de compte → Créer un compte";
  if (authNameField) { authNameField.style.display = inscription ? "" : "none"; authNameField.required = inscription; authNameField.disabled = !inscription; }
}
if (authToggle) authToggle.addEventListener("click", () => { authMode = authMode === "login" ? "signup" : "login"; updateAuth(); });
if (authForm) {
  authForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(authForm),name=formData.get("name")||"",email=formData.get("email"),password=formData.get("password");
    let accounts=[];try{accounts=JSON.parse(localStorage.getItem("villalink_accounts")||"[]")}catch(error){accounts=[]}
    if(authMode==="signup"){
      const exists=accounts.some(account=>account.email.toLowerCase()===email.toLowerCase());
      if(exists){alert("Un compte existe déjà avec cet email.");return}
      accounts.push({name,email,password,role:authRole});
      localStorage.setItem("villalink_accounts",JSON.stringify(accounts));
      localStorage.setItem("villalink_session",JSON.stringify({name,email,role:authRole}));
      alert("🎉 Compte VillaLink créé avec succès !");
    }else{
      const account=accounts.find(account=>account.email.toLowerCase()===email.toLowerCase()&&account.password===password);
      if(!account){alert("❌ Email ou mot de passe incorrect.");return}
      localStorage.setItem("villalink_session",JSON.stringify({name:account.name,email:account.email,role:account.role}));
      alert("👋 Bienvenue sur VillaLink, "+account.name+" !");
    }
    authForm.reset();authModal.classList.add("hidden");
    const session=JSON.parse(localStorage.getItem("villalink_session")||"null");
    if(session&&typeof showDashboard==="function")showDashboard(session);
  });
}
updateAuth();

// ===============================
// TABLEAU DE BORD
// ===============================
const dashboard=document.getElementById("dashboard"),dashboardName=document.getElementById("dashboardName"),dashboardRole=document.getElementById("dashboardRole"),logoutBtn=document.getElementById("logoutBtn"),myVillasBtn=document.getElementById("myVillasBtn"),adminBtn=document.getElementById("adminBtn"),adminPanel=document.getElementById("adminPanel"),adminGrid=document.getElementById("adminGrid"),adminStats=document.getElementById("adminStats"),closeAdmin=document.getElementById("closeAdmin");
function showDashboard(session){
  if(!dashboard||!session)return;
  dashboard.classList.remove("hidden");dashboardName.textContent=session.name||"Utilisateur";adminPanel?.classList.add("hidden");
  const owner=session.role==="proprietaire",admin=session.role==="admin";dashboardRole.textContent=admin?"🛡️ Administrateur":owner?"🏠 Propriétaire":"👤 Locataire";
  document.querySelectorAll(".owner-only").forEach(el=>{el.style.display=owner?"":"none"});document.querySelectorAll(".admin-only").forEach(el=>{el.classList.toggle("hidden",!admin)});
  dashboard.scrollIntoView({behavior:"smooth",block:"start"});
  const loginButton=document.getElementById("openLogin"),signupButton=document.getElementById("openSignup");
  if(loginButton)loginButton.textContent="Mon espace";
  if(signupButton)signupButton.style.display="none";
  bindAuthButtons();
}
function hideDashboard(){
  if(dashboard)dashboard.classList.add("hidden");myVillasPanel?.classList.add("hidden");favoritesPanel?.classList.add("hidden");
  const loginButton=document.getElementById("openLogin"),signupButton=document.getElementById("openSignup");
  if(loginButton)loginButton.textContent="Se connecter";if(signupButton)signupButton.style.display="";bindAuthButtons();
}
if(logoutBtn)logoutBtn.addEventListener("click",()=>{localStorage.removeItem("villalink_session");hideDashboard();alert("Vous êtes déconnecté de VillaLink.");window.scrollTo({top:0,behavior:"smooth"})});
const favoritesPanel=document.getElementById("favoritesPanel"),favoritesGrid=document.getElementById("favoritesGrid"),closeFavorites=document.getElementById("closeFavorites"),myVillasPanel=document.getElementById("myVillasPanel"),myVillasGrid=document.getElementById("myVillasGrid"),closeMyVillas=document.getElementById("closeMyVillas");

function editMyVilla(id){
  const session=JSON.parse(localStorage.getItem("villalink_session")||"null");
  if(!session?.email)return;
  const custom=getCustom();
  const index=custom.findIndex(v=>Number(v.id)===Number(id)&&String(v.ownerEmail||"").toLowerCase()===String(session.email).toLowerCase());
  if(index<0)return;
  const v=custom[index];
  const form=document.getElementById("ownerForm");
  if(!form)return;
  ownerModal.classList.remove("hidden");
  form.querySelector('[name="title"]').value=v.title||"";
  form.querySelector('[name="location"]').value=v.location||"";
  form.querySelector('[name="price"]').value=v.price||"";
  form.querySelector('[name="rooms"]').value=v.rooms||"";
  form.querySelector('[name="phone"]').value=v.phone||"";
  form.querySelector('[name="description"]').value=v.description||"";
  form.querySelectorAll('input[name="amenity"]').forEach(x=>x.checked=(v.amenities||[]).includes(x.value));
  selectedPhotoData=(v.images&&v.images[0])||v.image||"";
  selectedPhotoDataList=Array.isArray(v.images)&&v.images.length?[...v.images]:[selectedPhotoData];
  photoPreview.innerHTML="";
  selectedPhotoDataList.forEach(data=>{const box=document.createElement("div");box.className="photo-thumb";box.innerHTML=`<img src="${safe(data)}" alt="Photo de villa">`;photoPreview.appendChild(box)});
  photoPreview.insertAdjacentHTML("beforeend",`<div class="photo-count">${selectedPhotoDataList.length} photo${selectedPhotoDataList.length>1?"s":""} sélectionnée${selectedPhotoDataList.length>1?"s":""}</div>`);
  form.dataset.editingId=String(v.id);
  updateOwnerPreview();
}

document.getElementById("cancelVillaEdit")?.addEventListener("click",cancelVillaEdit);
function cancelVillaEdit(){
  const form=document.getElementById("ownerForm");
  if(!form)return;
  delete form.dataset.editingId;
  form.reset();selectedPhotoData="";selectedPhotoDataList=[];photoPreview.innerHTML="";updateOwnerPreview();ownerModal.classList.add("hidden");
}

function deleteMyVilla(id){
  const session=JSON.parse(localStorage.getItem("villalink_session")||"null");
  if(!session?.email)return;
  const custom=getCustom();
  const index=custom.findIndex(v=>Number(v.id)===Number(id)&&String(v.ownerEmail||"").toLowerCase()===String(session.email).toLowerCase());
  if(index<0)return;
  const v=custom[index];
  if(!confirm("Supprimer définitivement « "+v.title+" » ?"))return;
  custom.splice(index,1);
  localStorage.setItem("villalink_villas",JSON.stringify(custom));
  render();
  showMyVillas();
  alert("La villa a été supprimée.");
}

function showMyVillas(){
 favoritesPanel?.classList.add("hidden");
 const session=JSON.parse(localStorage.getItem("villalink_session")||"null");
 if(!session||session.role!=="proprietaire")return;
 const mine=getCustom().filter(v=>String(v.ownerEmail||"").toLowerCase()===String(session.email||"").toLowerCase());
 if(!mine.length){
  if(myVillasPanel)myVillasPanel.classList.add("hidden");
  alert("Vous n'avez pas encore publié de villa. Cliquez sur « Propriétaires » pour créer votre première annonce.");
  return;
 }
 const counts={attente:mine.filter(v=>v.status==="attente").length,publie:mine.filter(v=>v.status==="publie").length,refuse:mine.filter(v=>v.status==="refuse").length};
 if(myVillasGrid){
  myVillasGrid.innerHTML=`
    <div class="my-villas-summary">
      <div><strong>${mine.length}</strong><span>Total</span></div>
      <div class="summary-wait"><strong>${counts.attente}</strong><span>En attente</span></div>
      <div class="summary-live"><strong>${counts.publie}</strong><span>Publiées</span></div>
      <div class="summary-refuse"><strong>${counts.refuse}</strong><span>Refusées</span></div>
    </div>
    ${mine.map(v=>`
    <article class="my-villa-card">
      <div class="my-villa-img" style="background-image:url('${safe((v.images&&v.images[0])||v.image)}')"><span class="my-villa-photo-count">📷 ${Array.isArray(v.images)?v.images.length:1}</span></div>
      <div class="my-villa-body">
        <div class="eyebrow">${safe(v.location)}</div>
        <h4>${safe(v.title)}</h4>
        <p>🛏 ${safe(v.rooms)} chambres · ${price(v.price)}</p>
        <div class="amenities">${(v.amenities||[]).slice(0,3).map(a=>`<span>${safe(a)}</span>`).join("")}</div>
        <div class="listing-status ${v.status==="refuse"?"status-refuse":v.status==="attente"?"status-attente":"status-publie"}">${v.status==="refuse"?"🔴 Refusée":v.status==="attente"?"🟠 En attente de validation":"🟢 Publiée"}</div>
        ${v.status==="refuse"?'<p class="status-help">Cette annonce doit être modifiée avant une nouvelle validation.</p>':v.status==="attente"?'<p class="status-help">Votre annonce sera visible après validation par l’administration.</p>':'<p class="status-help">Votre annonce est actuellement visible par les locataires.</p>'}
        <div class="my-villa-actions">
          <button class="btn outline" data-my-villa="${v.id}">Voir l'annonce</button>
          <button class="btn outline" data-edit-villa="${v.id}">Modifier</button>
          <button class="btn danger" data-delete-villa="${v.id}">Supprimer</button>
        </div>
      </div>
    </article>`).join("")`;
  myVillasGrid.querySelectorAll("[data-my-villa]").forEach(btn=>btn.addEventListener("click",()=>openVilla(Number(btn.dataset.myVilla))));
  myVillasGrid.querySelectorAll("[data-edit-villa]").forEach(btn=>btn.addEventListener("click",()=>editMyVilla(Number(btn.dataset.editVilla))));
  myVillasGrid.querySelectorAll("[data-delete-villa]").forEach(btn=>btn.addEventListener("click",()=>deleteMyVilla(Number(btn.dataset.deleteVilla))));
 }
 myVillasPanel?.classList.remove("hidden");myVillasPanel?.scrollIntoView({behavior:"smooth",block:"start"});
}
if(myVillasBtn)myVillasBtn.addEventListener("click",showMyVillas);
if(closeMyVillas)closeMyVillas.addEventListener("click",()=>myVillasPanel?.classList.add("hidden"));
let adminFilter="toutes",adminSearch="";
function showAdmin(){
 const session=JSON.parse(localStorage.getItem("villalink_session")||"null");
 if(!session||session.role!=="admin"){alert("Accès réservé à l’administrateur.");return}
 const custom=getCustom();
 const attente=custom.filter(v=>v.status==="attente").length,publiees=custom.filter(v=>v.status==="publie").length,refusees=custom.filter(v=>v.status==="refuse").length;
 if(adminStats)adminStats.innerHTML=`<div><strong>${custom.length}</strong><span>Total</span></div><div><strong>${attente}</strong><span>En attente</span></div><div><strong>${publiees}</strong><span>Publiées</span></div><div><strong>${refusees}</strong><span>Refusées</span></div>`;
 const search=adminSearch.trim().toLowerCase();
 const filtered=custom.filter(v=>{
   const statusOk=adminFilter==="toutes"||v.status===adminFilter;
   const text=[v.title,v.location,v.ownerName,v.ownerEmail].join(" ").toLowerCase();
   return statusOk&&(!search||text.includes(search));
 });
 if(adminGrid){
  if(!filtered.length){adminGrid.innerHTML='<div class="empty"><h3>Aucune annonce trouvée</h3><p>Modifiez votre recherche ou votre filtre.</p></div>'}
  else{
   adminGrid.innerHTML=filtered.map(v=>`<article class="admin-card"><div class="admin-img" style="background-image:url('${safe(v.image)}')"></div><div class="admin-body"><div class="eyebrow">${safe(v.location)} · ${v.status==="attente"?"🟠 En attente":v.status==="refuse"?"🔴 Refusée":"🟢 Publiée"}</div><h4>${safe(v.title)}</h4><p>👤 <strong>${safe(v.ownerName||"Propriétaire")}</strong></p><p>✉️ ${safe(v.ownerEmail||"Email non renseigné")}</p><p>🛏 ${safe(v.rooms)} chambres · 💰 ${price(v.price)}</p><div class="admin-actions"><button class="btn outline" data-admin-view="${v.id}">Voir</button><button class="btn primary" data-admin-approve="${v.id}">✓ Accepter</button><button class="btn danger" data-admin-refuse="${v.id}">✕ Refuser</button><button class="btn danger" data-admin-delete="${v.id}">🗑️ Supprimer</button></div></div></article>`).join("")
  }
  adminGrid.querySelectorAll("[data-admin-view]").forEach(b=>b.onclick=()=>openVilla(Number(b.dataset.adminView)));
  adminGrid.querySelectorAll("[data-admin-approve]").forEach(b=>b.onclick=()=>adminSetStatus(Number(b.dataset.adminApprove),"publie"));
  adminGrid.querySelectorAll("[data-admin-refuse]").forEach(b=>b.onclick=()=>adminSetStatus(Number(b.dataset.adminRefuse),"refuse"));
  adminGrid.querySelectorAll("[data-admin-delete]").forEach(b=>b.onclick=()=>adminDelete(Number(b.dataset.adminDelete)));
 }
 document.querySelectorAll("[data-admin-filter]").forEach(b=>b.classList.toggle("active",b.dataset.adminFilter===adminFilter));
 const searchInput=document.getElementById("adminSearch");
 if(searchInput){searchInput.value=adminSearch;searchInput.oninput=e=>{adminSearch=e.target.value;showAdmin()}}
 document.querySelectorAll("[data-admin-filter]").forEach(b=>b.onclick=()=>{adminFilter=b.dataset.adminFilter;showAdmin()});
 myVillasPanel?.classList.add("hidden");favoritesPanel?.classList.add("hidden");adminPanel?.classList.remove("hidden");adminPanel?.scrollIntoView({behavior:"smooth",block:"start"});
}
function adminSetStatus(id,status){
 const session=JSON.parse(localStorage.getItem("villalink_session")||"null");if(session?.role!=="admin")return;
 const custom=getCustom(),v=custom.find(x=>Number(x.id)===Number(id));if(!v)return;
 v.status=status;
 localStorage.setItem("villalink_villas",JSON.stringify(custom));
 render();
 showAdmin();
 alert(status==="publie"?"✅ Annonce acceptée et publiée !":"🔴 Annonce refusée. Le propriétaire verra le nouveau statut dans son espace.");
}
function adminDelete(id){
 const session=JSON.parse(localStorage.getItem("villalink_session")||"null");if(session?.role!=="admin")return;
 const custom=getCustom(),v=custom.find(x=>Number(x.id)===Number(id));if(!v)return;if(!confirm("Supprimer définitivement « "+v.title+" » ?"))return;
 localStorage.setItem("villalink_villas",JSON.stringify(custom.filter(x=>Number(x.id)!==Number(id))));render();showAdmin();
}
adminBtn?.addEventListener("click",showAdmin);closeAdmin?.addEventListener("click",()=>adminPanel?.classList.add("hidden"));
function showFavorites(){
 const s=JSON.parse(localStorage.getItem("villalink_session")||"null");if(!s?.email){alert("Connectez-vous pour utiliser vos favoris.");return}
 const ids=getFavorites(),mine=allVillas().filter(v=>ids.includes(Number(v.id)));
 if(favoritesGrid){favoritesGrid.innerHTML="";if(!mine.length){favoritesGrid.innerHTML='<div class="empty-favorites"><div>❤️</div><h3>Aucun favori pour le moment</h3><p>Cliquez sur le cœur d’une villa pour la retrouver ici.</p><a class="btn primary" href="#villas">Découvrir les villas</a></div>'}else{mine.forEach(v=>{const el=document.createElement("article");el.className="my-villa-card";el.innerHTML=`<div class="my-villa-img" style="background-image:url('${safe(v.image)}')"></div><div class="my-villa-body"><div class="eyebrow">${safe(v.location)}</div><h4>${safe(v.title)}</h4><p>🛏 ${safe(v.rooms)} chambres · ${price(v.price)}</p><div class="amenities">${(v.amenities||[]).slice(0,3).map(a=>`<span>${safe(a)}</span>`).join("")}</div><div class="favorite-actions"><button class="btn outline" data-favorite-view="${v.id}">Voir l’annonce</button><button class="btn favorite-remove" data-remove-favorite="${v.id}">Retirer ❤️</button></div></div>`;favoritesGrid.appendChild(el)})}
  favoritesGrid.querySelectorAll("[data-favorite-view]").forEach(b=>b.onclick=()=>openVilla(Number(b.dataset.favoriteView)));favoritesGrid.querySelectorAll("[data-remove-favorite]").forEach(b=>b.onclick=()=>{saveFavorites(getFavorites().filter(id=>id!==Number(b.dataset.removeFavorite)));showFavorites();render()})
 }
 myVillasPanel?.classList.add("hidden");favoritesPanel?.classList.remove("hidden");favoritesPanel?.scrollIntoView({behavior:"smooth",block:"start"});
}
document.getElementById("favoritesBtn")?.addEventListener("click",showFavorites);if(closeFavorites)closeFavorites.addEventListener("click",()=>favoritesPanel?.classList.add("hidden"));
document.getElementById("searchesBtn")?.addEventListener("click",()=>{document.getElementById("villas")?.scrollIntoView({behavior:"smooth"})});
function restoreSession(){try{const session=JSON.parse(localStorage.getItem("villalink_session")||"null");if(session)showDashboard(session)}catch(e){}}
restoreSession();

// Connexion / inscription : gestion centralisée et fiable
function bindAuthButtons(){
  const login=document.getElementById("openLogin");
  const signup=document.getElementById("openSignup");
  if(login){
    login.onclick=function(){
      const session=JSON.parse(localStorage.getItem("villalink_session")||"null");
      if(session){dashboard?.scrollIntoView({behavior:"smooth",block:"start"});return}
      authMode="login";
      updateAuth();
      authModal?.classList.remove("hidden");
    };
  }
  if(signup){
    signup.onclick=function(){
      authMode="signup";
      updateAuth();
      authModal?.classList.remove("hidden");
    };
  }
}
bindAuthButtons();
