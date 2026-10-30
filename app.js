/* TRATTORIA EL BAMBINO — Sitio estático sin pagos, inventario ni reservas automáticas.
   Fuente del contenido: ver INVESTIGACION.md. Precios y disponibilidad: consultar al local. */
(() => {
  "use strict";

  const CONFIG = Object.freeze({
    whatsapp: "51902690387",
    name: "Trattoria El Bambino",
    map: "https://maps.app.goo.gl/NRtoktkUXYtA2wF58",
    assets: {
      pasta: "assets/hero-pasta.webp",
      pizza: "assets/pizza-artesanal.webp",
      fusion: "assets/risotto-fusion.webp"
    }
  });

  /* Nombres documentados en publicaciones del restaurante, reseñas y carta de 2024.
     Las descripciones son editoriales, no especificaciones oficiales. */
  const MENU = {
    pastas: [
      { id: "p1", name: "Gnocchi de papa en salsa mixtura", desc: "Una especialidad de pasta y salsa presente en la carta virtual del restaurante.", label: "Carta referencial", image: "pasta" },
      { id: "p2", name: "Pappardelle al pesto con pollo al panko", desc: "Pasta larga, pesto y pechuga empanizada al panko; combinación recogida en la carta de 2024.", label: "Inspiración italiana", image: "pasta" },
      { id: "p3", name: "Tortelloni relleno de salmón", desc: "Preparación anunciada con salsa de pulpa de cangrejo y trucha a la plancha.", label: "Mencionado en 2025", image: "pasta" }
    ],
    fusion: [
      { id: "f1", name: "Risotto a la huancaína con baby saltado", desc: "Una mezcla ítalo-peruana destacada entre las recomendaciones del chef en la carta virtual.", label: "Recomendación de carta", image: "fusion" },
      { id: "f2", name: "Tacu tacu a lo pobre con picaña", desc: "Un encuentro entre el tacu tacu peruano y la parrilla, mencionado en la carta del restaurante.", label: "Fusión con carácter", image: "fusion" },
      { id: "f3", name: "Risotto con cuy a la parrilla", desc: "Una propuesta que el restaurante presentó públicamente como ejemplo de su fusión de sabores.", label: "Mencionado en 2025", image: "fusion" }
    ],
    pizzas: [
      { id: "z1", name: "Pizza familiar de dos sabores", desc: "Una pizza para compartir que permite combinar dos sabores, anunciada por el restaurante.", label: "Para compartir", image: "pizza" },
      { id: "z2", name: "Pizza Caprese", desc: "Tomate y hojas de albahaca fresca, según una versión histórica de la carta.", label: "Carta histórica", image: "pizza" },
      { id: "z3", name: "Pizza Full Meat", desc: "Variante de pizza mencionada en fotografías y comentarios públicos del restaurante.", label: "Mencionada en reseñas", image: "pizza" }
    ],
    parrillas: [
      { id: "g1", name: "Lomo fino", desc: "Corte de carne incluido entre las propuestas de parrilla y recomendaciones en la carta histórica.", label: "Selección de carnes", image: "fusion" },
      { id: "g2", name: "Ossobuco", desc: "Preparación de carne mencionada en las recomendaciones del chef de una carta anterior.", label: "Carta histórica", image: "fusion" },
      { id: "g3", name: "Carnes a la parrilla", desc: "La parrilla es parte de la propuesta gastronómica divulgada por el restaurante.", label: "Especialidad de la casa", image: "fusion" }
    ]
  };

  const CATEGORY_NAMES = { pastas: "Pastas", fusion: "Fusión peruana", pizzas: "Pizzas", parrillas: "Parrillas" };
  const byId = (id) => document.getElementById(id);
  const selected = new Map();
  const liveRegion = document.createElement("div");
  liveRegion.className = "sr-only";
  liveRegion.setAttribute("role", "status");
  liveRegion.setAttribute("aria-live", "polite");
  document.body.appendChild(liveRegion);

  function announce(message) {
    liveRegion.textContent = "";
    window.setTimeout(() => { liveRegion.textContent = message; }, 20);
  }

  function whatsappUrl(text) {
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  function openWhatsApp(text) {
    const anchor = document.createElement("a");
    anchor.href = whatsappUrl(text);
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  // Navegación fija + menú móvil
  const header = byId("siteHeader");
  const menuToggle = byId("menuToggle");
  const mobileNav = byId("mobileNav");
  let lastMenuFocus = null;

  function setMobileMenu(isOpen) {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    mobileNav.hidden = !isOpen;
    document.body.classList.toggle("menu-open", isOpen);
    if (isOpen) {
      lastMenuFocus = document.activeElement;
      mobileNav.querySelector("a")?.focus();
    } else if (mobileNav.contains(document.activeElement)) {
      (lastMenuFocus || menuToggle).focus();
    }
  }
  function updateHeader() { header.classList.toggle("is-sticky", window.scrollY > 80); }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  menuToggle.addEventListener("click", () => setMobileMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
  mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMobileMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) setMobileMenu(false);
    if (event.key === "Tab" && !mobileNav.hidden) {
      const focusable = [menuToggle, ...mobileNav.querySelectorAll("a")];
      const index = focusable.indexOf(document.activeElement);
      if (event.shiftKey && index === 0) { focusable.at(-1).focus(); event.preventDefault(); }
      if (!event.shiftKey && index === focusable.length - 1) { focusable[0].focus(); event.preventDefault(); }
    }
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 900 && !mobileNav.hidden) setMobileMenu(false); });

  // Menú interactivo accesible
  const menuGrid = byId("menuPanel");
  const menuTabs = [...document.querySelectorAll(".menu-tab")];

  function renderMenu(category) {
    const fragment = document.createDocumentFragment();
    MENU[category].forEach((dish) => {
      const article = createElement("article", "menu-card");
      const imageFrame = createElement("div", "menu-card-image");
      const img = document.createElement("img");
      img.src = CONFIG.assets[dish.image];
      img.alt = `Imagen gastronómica conceptual para la sección ${CATEGORY_NAMES[category]}; no es fotografía del plato ${dish.name}.`;
      img.loading = "lazy";
      img.width = 900;
      img.height = 650;
      imageFrame.append(img, createElement("span", "menu-tag", dish.label));

      const body = createElement("div", "menu-card-body");
      body.append(createElement("span", "menu-category", CATEGORY_NAMES[category]));
      body.append(createElement("h3", "", dish.name));
      body.append(createElement("p", "", dish.desc));
      const actionRow = createElement("div", "menu-card-action");
      actionRow.append(createElement("small", "", "Consultar disponibilidad"));
      const add = createElement("button", "add-dish", "+");
      add.type = "button";
      add.dataset.dish = dish.id;
      add.setAttribute("aria-label", `Añadir ${dish.name} a mi consulta`);
      add.title = "Añadir a mi selección para consultar";
      actionRow.append(add);
      body.append(actionRow);
      article.append(imageFrame, body);
      fragment.append(article);
    });
    menuGrid.replaceChildren(fragment);
  }

  function selectMenuTab(tab, moveFocus = false) {
    menuTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    menuGrid.setAttribute("aria-labelledby", tab.id);
    renderMenu(tab.dataset.category);
    if (moveFocus) tab.focus();
  }
  menuTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectMenuTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight") next = (index + 1) % menuTabs.length;
      else if (event.key === "ArrowLeft") next = (index + menuTabs.length - 1) % menuTabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = menuTabs.length - 1;
      if (next !== null) { event.preventDefault(); selectMenuTab(menuTabs[next], true); }
    });
  });
  selectMenuTab(menuTabs[0]);

  // Mi selección: lista sin precios ni checkout ficticio.
  const selectionDialog = byId("selectionDialog");
  const selectionFab = byId("selectionFab");
  const selectionList = byId("selectionList");
  const findDish = (id) => Object.values(MENU).flat().find((dish) => dish.id === id);

  function updateSelection() {
    const count = [...selected.values()].reduce((sum, qty) => sum + qty, 0);
    selectionFab.hidden = count === 0;
    byId("selectionCount").textContent = String(count);
    selectionList.replaceChildren();
    if (count === 0) selectionList.append(createElement("li", "", "Aún no agregaste platos."));
    selected.forEach((qty, id) => {
      const dish = findDish(id);
      if (!dish) return;
      const row = createElement("li");
      row.append(createElement("span", "", `${qty} × ${dish.name}`));
      const remove = createElement("button", "", "Quitar");
      remove.type = "button";
      remove.dataset.removeDish = id;
      remove.setAttribute("aria-label", `Quitar ${dish.name} de mi selección`);
      row.append(remove);
      selectionList.append(row);
    });
    byId("sendSelection").disabled = count === 0;
  }
  menuGrid.addEventListener("click", (event) => {
    const add = event.target.closest("button[data-dish]");
    if (!add) return;
    const dish = findDish(add.dataset.dish);
    if (!dish) return;
    selected.set(dish.id, (selected.get(dish.id) || 0) + 1);
    updateSelection();
    announce(`${dish.name} añadido a la selección. No se ha realizado ningún pedido.`);
  });
  function showSelection() { updateSelection(); selectionDialog.showModal(); }
  byId("openSelection").addEventListener("click", showSelection);
  selectionFab.addEventListener("click", showSelection);
  selectionList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-remove-dish]");
    if (!button) return;
    selected.delete(button.dataset.removeDish);
    updateSelection();
  });
  byId("clearSelection").addEventListener("click", () => { selected.clear(); updateSelection(); announce("Selección vaciada"); });
  selectionDialog.querySelector("[data-close-dialog]").addEventListener("click", () => selectionDialog.close());
  byId("sendSelection").addEventListener("click", () => {
    if (!selected.size) return;
    const lines = [...selected].map(([id, qty]) => `• ${qty} x ${findDish(id).name}`);
    openWhatsApp(`Hola, Trattoria El Bambino. Quisiera consultar disponibilidad y precios de estos platos:\n\n${lines.join("\n")}\n\nMuchas gracias.`);
    selectionDialog.close();
  });
  selectionDialog.addEventListener("click", (event) => { if (event.target === selectionDialog) selectionDialog.close(); });
  updateSelection();

  // Reservas: se prepara un mensaje, sin grabar datos ni prometer confirmación.
  const bookingForm = byId("bookingForm");
  const bookingDate = byId("bookingDate");
  const localNow = new Date();
  const today = [localNow.getFullYear(), String(localNow.getMonth() + 1).padStart(2, "0"), String(localNow.getDate()).padStart(2, "0")].join("-");
  bookingDate.min = today;
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const data = new FormData(bookingForm);
    const name = String(data.get("nombre") || "").trim();
    const people = String(data.get("personas") || "").trim();
    const date = String(data.get("fecha") || "").trim();
    const time = String(data.get("hora") || "").trim();
    const notes = String(data.get("notas") || "").trim();
    if (!name || !people || !date || !time || date < today) {
      announce("Por favor, completa los campos y elige una fecha válida.");
      return;
    }
    const [year, month, day] = date.split("-");
    const friendlyDate = `${day}/${month}/${year}`;
    let message = `Hola, Trattoria El Bambino. Quisiera consultar disponibilidad para una reserva.\n\nNombre: ${name}\nPersonas: ${people}\nFecha: ${friendlyDate}\nHora aproximada: ${time}`;
    if (notes) message += `\nComentario: ${notes}`;
    message += "\n\nQuedo atento/a a su confirmación. ¡Gracias!";
    openWhatsApp(message);
    announce("Se preparó tu solicitud para WhatsApp. La reserva necesita confirmación del restaurante.");
  });

  // Galería: todas las imágenes son conceptuales.
  const galleryDialog = byId("galleryDialog");
  const galleryItems = [
    { src: CONFIG.assets.pasta, caption: "Pasta artesanal · Fotografía gastronómica conceptual." },
    { src: CONFIG.assets.pizza, caption: "Pizza artesanal · Fotografía gastronómica conceptual." },
    { src: CONFIG.assets.fusion, caption: "Fusión ítalo-peruana · Fotografía gastronómica conceptual." }
  ];
  document.querySelectorAll("[data-gallery]").forEach((button) => button.addEventListener("click", () => {
    const item = galleryItems[Number(button.dataset.gallery)];
    if (!item) return;
    const img = byId("galleryLargeImage");
    img.src = item.src;
    img.alt = item.caption;
    byId("galleryCaption").textContent = item.caption;
    galleryDialog.showModal();
  }));
  byId("closeGallery").addEventListener("click", () => galleryDialog.close());
  galleryDialog.addEventListener("click", (event) => { if (event.target === galleryDialog) galleryDialog.close(); });

  // Entrada sutil de las secciones, desactivada cuando se prefiere menos movimiento.
  const reveals = document.querySelectorAll(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("in-view"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .1, rootMargin: "0px 0px -25px 0px" });
    reveals.forEach((element) => observer.observe(element));
  }

  byId("year").textContent = String(new Date().getFullYear());
})();
