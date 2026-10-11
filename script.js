const services = [
  {id:"ac",name:"AC repair & service",category:"Appliances",icon:"❄️",tag:"Popular",price:"₹299 onwards",desc:"Cooling issues, servicing, installation and maintenance.",color:"#e9f3ff"},
  {id:"electrician",name:"Electrician",category:"Home",icon:"⚡",tag:"Home essential",price:"₹149 onwards",desc:"Switches, wiring, lights, fans and electrical faults.",color:"#fff2d9"},
  {id:"plumbing",name:"Plumbing",category:"Home",icon:"🚿",tag:"Home essential",price:"₹149 onwards",desc:"Leaking taps, blocked drains, pipes and bathroom fittings.",color:"#e8f6f5"},
  {id:"fridge",name:"Fridge repair",category:"Appliances",icon:"🧊",tag:"Appliances",price:"₹249 onwards",desc:"Cooling problems, unusual noise and refrigerator servicing.",color:"#e9f3ff"},
  {id:"washing",name:"Washing machine",category:"Appliances",icon:"🫧",tag:"Appliances",price:"₹249 onwards",desc:"Repair, installation, drainage and spin-cycle issues.",color:"#f1edff"},
  {id:"tv",name:"TV repair & setup",category:"Appliances",icon:"📺",tag:"Appliances",price:"₹249 onwards",desc:"Screen diagnosis, installation and connection setup.",color:"#f4eaff"},
  {id:"fan",name:"Fan & appliance repair",category:"Appliances",icon:"🌀",tag:"Appliances",price:"₹149 onwards",desc:"Fans, mixer grinders, microwaves and small appliances.",color:"#e9f7ec"},
  {id:"car",name:"Car repair & care",category:"Vehicle",icon:"🚗",tag:"Vehicle care",price:"₹399 onwards",desc:"General inspection, battery help and maintenance requests.",color:"#fff0e6"},
  {id:"bike",name:"Bike & scooter repair",category:"Vehicle",icon:"🛵",tag:"Vehicle care",price:"₹199 onwards",desc:"Routine servicing, punctures and common repair requests.",color:"#fff0e6"},
  {id:"cleaning",name:"Home deep cleaning",category:"Cleaning",icon:"🧹",tag:"Fresh spaces",price:"₹499 onwards",desc:"Kitchen, bathroom, full-home and move-in cleaning.",color:"#e9f7ec"},
  {id:"pest",name:"Pest control",category:"Cleaning",icon:"🛡️",tag:"Home care",price:"₹399 onwards",desc:"Help with common household pests and preventive treatment.",color:"#f4f5df"},
  {id:"ro",name:"RO & water purifier",category:"Appliances",icon:"💧",tag:"Appliances",price:"₹199 onwards",desc:"Filter changes, servicing, leakage and installation.",color:"#e8f6ff"},
  {id:"carpenter",name:"Carpenter",category:"Home",icon:"🪚",tag:"Home",price:"₹199 onwards",desc:"Furniture assembly, door fixes, shelves and small repairs.",color:"#f8eee1"},
  {id:"painting",name:"Painting & touch-ups",category:"Home",icon:"🖌️",tag:"Home",price:"Quote required",desc:"Wall touch-ups, repainting and minor paint jobs.",color:"#f4eaff"},
  {id:"laundry",name:"Laundry & ironing",category:"Other",icon:"👕",tag:"Everyday help",price:"₹99 onwards",desc:"Laundry, ironing and clothing-care requests.",color:"#e9f3ff"},
  {id:"salon",name:"Salon at home",category:"Other",icon:"✂️",tag:"Personal care",price:"₹199 onwards",desc:"Convenient grooming and personal-care appointments.",color:"#fcecf2"},
  {id:"packers",name:"Packers & movers",category:"Other",icon:"📦",tag:"Moving help",price:"Quote required",desc:"Packing, local shifting and moving assistance.",color:"#fff2d9"},
  {id:"computer",name:"Laptop & computer",category:"Appliances",icon:"💻",tag:"Tech support",price:"₹299 onwards",desc:"Device troubleshooting, setup and common technical issues.",color:"#f1edff"},
  {id:"water",name:"Water tank cleaning",category:"Cleaning",icon:"🪣",tag:"Home care",price:"₹499 onwards",desc:"Tank cleaning requests for household water storage.",color:"#e8f6ff"},
  {id:"lock",name:"Locksmith",category:"Home",icon:"🔑",tag:"Home essential",price:"₹199 onwards",desc:"Lock repair, replacement and door-lock assistance.",color:"#f4f5df"}
];

const serviceGrid = document.getElementById("serviceGrid");
const categoryFilters = document.getElementById("categoryFilters");
const heroSearch = document.getElementById("heroSearch");
const bookingModal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const toast = document.getElementById("toast");
let activeCategory = "All";
let searchTerm = "";
let selectedService = null;
let toastTimer;

function renderServices() {
  const filtered = services.filter(service => {
    const matchesCategory = activeCategory === "All" || service.category === activeCategory;
    const haystack = `${service.name} ${service.category} ${service.desc} ${service.tag}`.toLowerCase();
    return matchesCategory && haystack.includes(searchTerm.toLowerCase().trim());
  });
  document.getElementById("visibleCount").textContent = filtered.length;
  serviceGrid.innerHTML = filtered.map(service => `
    <article class="service-card">
      <div class="service-card-top">
        <span class="service-icon" style="--icon-bg:${service.color}">${service.icon}</span>
        <span class="service-tag">${service.tag}</span>
      </div>
      <h3>${escapeHTML(service.name)}</h3>
      <p>${escapeHTML(service.desc)}</p>
      <div class="service-card-bottom">
        <span class="service-price">Starting at<strong>${escapeHTML(service.price)}</strong></span>
        <button class="add-service" type="button" data-book="${service.id}" aria-label="Book ${escapeHTML(service.name)}">Book +</button>
      </div>
    </article>`).join("");
  document.getElementById("noResults").classList.toggle("hidden", filtered.length > 0);
  serviceGrid.classList.toggle("hidden", filtered.length === 0);
  document.getElementById("showMoreBtn").textContent = activeCategory === "All" && !searchTerm ? "Explore all services ↓" : "Clear filters ×";
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function setCategory(category) {
  activeCategory = category;
  categoryFilters.querySelectorAll(".category-chip").forEach(button => button.classList.toggle("active", button.dataset.category === category));
  renderServices();
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}
function openBooking(service) {
  selectedService = service;
  document.getElementById("selectedServiceName").textContent = service.name;
  document.getElementById("selectedServicePrice").textContent = `Indicative price: ${service.price}`;
  document.querySelector("#selectedServiceBox > span").textContent = service.icon;
  const dateInput = document.getElementById("serviceDate");
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  dateInput.min = localToday;
  dateInput.value = localToday;
  bookingModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("customerName").focus(), 100);
}
function closeBooking() {
  bookingModal.classList.add("hidden");
  document.body.style.overflow = "";
}
function getBookings() {
  try { return JSON.parse(localStorage.getItem("clickfixBookings") || "[]"); }
  catch { return []; }
}
function saveBookings(bookings) {
  try { localStorage.setItem("clickfixBookings", JSON.stringify(bookings)); return true; }
  catch { showToast("Could not save in this browser. Please try again."); return false; }
}
function updateBookingCount() {
  document.getElementById("bookingCount").textContent = getBookings().length;
}
function showBookings() {
  const bookings = getBookings();
  const modal = document.querySelector(".modal");
  const original = modal.innerHTML;
  modal.innerHTML = `<button class="modal-close" id="closeBookings" aria-label="Close bookings">×</button>
    <div class="modal-kicker">YOUR SERVICE REQUESTS</div><h2>My bookings</h2>
    <p class="modal-subtitle">Requests saved on this device in this demo.</p>
    ${bookings.length ? `<div class="booking-list">${bookings.slice().reverse().map(b => `<article class="booking-item"><strong>${escapeHTML(b.service)}</strong><small>Request ID: ${escapeHTML(b.id)}<br>${escapeHTML(b.date)} · ${escapeHTML(b.time)}<br>${escapeHTML(b.address)}<br>Contact: ${escapeHTML(b.phone)}</small><span class="booking-status">Demo request saved</span></article>`).join("")}</div>` : `<div class="no-results"><span>▤</span><h3>No bookings yet</h3><p>Your service requests will appear here.</p></div>`}
    <button class="button button-dark full-width" id="backToServices" style="margin-top:20px">Browse services <span>→</span></button>`;
  bookingModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("closeBookings").addEventListener("click", () => { modal.innerHTML = original; wireModalClose(); closeBooking(); });
  document.getElementById("backToServices").addEventListener("click", () => { modal.innerHTML = original; wireModalClose(); closeBooking(); document.getElementById("services").scrollIntoView({behavior:"smooth"}); });
}
function wireModalClose() {
  const close = document.getElementById("closeModal");
  if (close) close.addEventListener("click", closeBooking);
}
categoryFilters.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});
serviceGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-book]");
  if (button) {
    const service = services.find(item => item.id === button.dataset.book);
    if (service) openBooking(service);
  }
});
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = heroSearch.value;
  setCategory("All");
  document.getElementById("services").scrollIntoView({behavior:"smooth"});
});
heroSearch.addEventListener("input", () => {
  if (!heroSearch.value.trim()) { searchTerm = ""; renderServices(); }
});
document.getElementById("showMoreBtn").addEventListener("click", () => {
  if (activeCategory !== "All" || searchTerm) {
    activeCategory = "All"; searchTerm = ""; heroSearch.value = "";
    setCategory("All");
  } else {
    showToast("You're viewing all available service categories.");
    serviceGrid.scrollIntoView({behavior:"smooth", block:"start"});
  }
});
document.getElementById("showAllBtn").addEventListener("click", () => {
  activeCategory = "All"; searchTerm = ""; heroSearch.value = ""; setCategory("All");
});
document.getElementById("closeModal").addEventListener("click", closeBooking);
bookingModal.addEventListener("click", event => { if (event.target === bookingModal) closeBooking(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeBooking(); });
bookingForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!selectedService) return;
  const data = new FormData(bookingForm);
  const booking = {
    id: "FX" + Date.now().toString().slice(-8),
    service: selectedService.name,
    name: data.get("customerName").trim(),
    phone: data.get("customerPhone").trim(),
    date: data.get("serviceDate"),
    time: data.get("serviceTime"),
    address: data.get("customerAddress").trim(),
    notes: data.get("jobNotes").trim(),
    createdAt: new Date().toISOString()
  };
  const bookings = getBookings();
  bookings.push(booking);
  if (!saveBookings(bookings)) return;
  updateBookingCount();
  bookingForm.reset();
  closeBooking();
  showToast(`Request ${booking.id} saved on this device. No provider has been notified.`);
});
document.getElementById("myBookingsBtn").addEventListener("click", showBookings);
document.getElementById("mobileBookingsBtn").addEventListener("click", () => {
  document.getElementById("mobileNav").classList.remove("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
  showBookings();
});
document.getElementById("menuToggle").addEventListener("click", () => {
  const nav = document.getElementById("mobileNav");
  const open = nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("[data-jump]").forEach(link => link.addEventListener("click", () => {
  const match = services.find(s => s.name.toLowerCase().includes(link.dataset.jump.toLowerCase()));
  if (match) { searchTerm = match.name; heroSearch.value = match.name; setCategory("All"); }
}));
document.getElementById("year").textContent = new Date().getFullYear();
updateBookingCount();
renderServices();
