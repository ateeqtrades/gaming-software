// ==== EDIT THESE: business details used across the page ====
const KARTZ = {
  whatsapp: "923000000000",            // international format, no + or spaces
  phoneDisplay: "+92 300 0000000",
  address: "Venue address, City, Pakistan",
  instagram: "#",
  facebook: "#",
  tiktok: "#",
  prices: { single: 2500, triple: 6500, gp: 5000, junior: 1800, birthday: null, corporate: null }
};

if (!/^92\d{10}$/.test(KARTZ.whatsapp)) console.warn("KARTZ.whatsapp should be 92 followed by 10 digits");
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

$("#yr").textContent = new Date().getFullYear();
$$('[data-ph="phone"]').forEach(el => el.textContent = KARTZ.phoneDisplay);
$$('[data-ph="address"]').forEach(el => el.textContent = KARTZ.address);
["instagram", "facebook", "tiktok"].forEach(k => $$(`[data-ph="${k}"]`).forEach(a => a.href = KARTZ[k]));
$("#waFloat").href = `https://wa.me/${KARTZ.whatsapp}?text=${encodeURIComponent("Hi Kartz PK, I'd like to book a race.")}`;

// Mobile menu
const menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
$$("#navLinks a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// Leaderboard (sample data until connected to real lap timing)
const boards = {
  week:  [["Hamza R.", "Kart 07", 31.482], ["Ayesha K.", "Kart 03", 31.917], ["Bilal S.", "Kart 11", 32.204], ["Zain M.", "Kart 07", 32.611], ["Sana T.", "Kart 02", 32.955]],
  month: [["Usman A.", "Kart 05", 30.874], ["Hamza R.", "Kart 07", 31.482], ["Fatima N.", "Kart 09", 31.610], ["Ayesha K.", "Kart 03", 31.917], ["Ali H.", "Kart 01", 32.040]],
  all:   [["Usman A.", "Kart 05", 30.874], ["Danish F.", "Kart 12", 30.991], ["Fatima N.", "Kart 09", 31.610], ["Hamza R.", "Kart 07", 31.482], ["Mariam J.", "Kart 04", 31.733]]
};
function renderBoard(key) {
  const body = $("#lbBody");
  const rows = boards[key].slice().sort((a, b) => a[2] - b[2]);
  body.replaceChildren(...rows.map(([name, kart, time], i) => {
    const tr = document.createElement("tr");
    const pos = document.createElement("td"); pos.className = "pos"; pos.textContent = i + 1;
    const who = document.createElement("td"); who.textContent = name;
    const k = document.createElement("span"); k.className = "kart-sub"; k.textContent = kart;
    who.append(document.createElement("br"), k);
    const t = document.createElement("td"); t.className = "time"; t.textContent = time.toFixed(3) + "s";
    tr.append(pos, who, t);
    return tr;
  }));
}
$$(".lb-tabs button").forEach(b => b.addEventListener("click", () => {
  $$(".lb-tabs button").forEach(x => x.classList.toggle("on", x === b));
  renderBoard(b.dataset.board);
}));
renderBoard("week");

// Booking form
const form = $("#bookForm"), pkg = $("#f-pkg"), drivers = $("#f-drivers"), est = $("#estimate");
const dateInput = $("#f-date");
dateInput.min = new Date().toISOString().slice(0, 10);
function updateEstimate() {
  const p = KARTZ.prices[pkg.value];
  const n = Math.max(1, parseInt(drivers.value, 10) || 1);
  est.textContent = p ? `PKR ${(p * n).toLocaleString("en-PK")}` : "We'll send a quote";
}
pkg.addEventListener("change", updateEstimate);
drivers.addEventListener("input", updateEstimate);
$$("[data-pkg]").forEach(a => a.addEventListener("click", () => { pkg.value = a.dataset.pkg; updateEstimate(); }));
updateEstimate();

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const d = Object.fromEntries(new FormData(form));
  const msg = [
    "Hi Kartz PK, I'd like to book:",
    `Name: ${clean(d.name, 60)}`,
    `Phone: ${clean(d.phone, 16)}`,
    `Package: ${clean(pkg.options[pkg.selectedIndex].text, 60)}`,
    `Date: ${clean(d.date, 10)} at ${clean(d.time, 5)}`,
    `Drivers: ${Math.min(40, Math.max(1, parseInt(d.drivers, 10) || 1))}`,
    `Estimate: ${est.textContent}`,
    d.notes ? `Notes: ${String(d.notes).trim().slice(0, 300)}` : ""
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/${KARTZ.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  form.reset();
  updateEstimate();
});

// Scroll reveal
const io = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: .12 }) : null;
$$(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));
