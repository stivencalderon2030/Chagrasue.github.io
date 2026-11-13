/* =========================================================
   Chagra Sué — comportamiento del sitio (JavaScript puro)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- DATOS ---------- */
  var cycle = [
    {
      label: "Apiario en El Castillo",
      title: "1. APIARIO EN EL CASTILLO, META",
      text: "Ubicación origen del lote. Apiario sostenible protegido con floración natural y sin pesticidas.",
      image: "https://i.ibb.co/zH7zqsXs/PASO-1.jpg",
      alt: "Apicultor inspeccionando un panal",
    },
    {
      label: "Polinización Natural",
      title: "2. POLINIZACIÓN & FLORACIÓN",
      text: "Las abejas polinizan cultivos locales de maracuyá, uchuva y guayaba, recolectando el néctar más puro.",
      image: "https://i.ibb.co/7NSmjRXv/PASO-2.jpg",
      alt: "Flores silvestres durante la hora dorada",
    },
    {
      label: "Fermentación Múcura",
      title: "3. FERMENTACIÓN ANCESTRAL EN MÚCURA",
      text: "Miel, agua limpia y tiempo. 180 días de reposo en vasijas que honran la tradición Muisca.",
      image: "https://i.ibb.co/v7X4dQt/PASO-3.jpg",
      alt: "Recipiente artesanal sobre una mesa",
    },
    {
      label: "Brindis & Abono Vivo",
      title: "4. EL BRINDIS SOSTENIBLE & ABONO",
      text: "Los residuos orgánicos se compostan para sembrar nuevas flores. El ciclo se completa.",
      image: "https://i.ibb.co/C5YQJFBW/PASO-4.jpg",
      alt: "Campo de flores visto desde la tierra",
    },
  ];

  var products = [
    {
      id: "sue",
      name: "SUÉ",
      variant: "Original",
      type: "Hidromiel Tradicional",
      description: "Pura miel silvestre, seca, elegante y profundamente aromática.",
      note: "Miel floral · Vainilla · Final seco",
      ingredients: "Miel multifloral, agua pura y levaduras.",
      pairing: "Quesos semimaduros, frutos secos y carnes blancas.",
      color: "#d89b2b",
      price: 58000,
      bottleImage: "https://i.ibb.co/Q7R611T7/SABOR-ORIGINAL.png",
      exploreImage: "https://i.ibb.co/211X6fWj/EXPLORA-SABOR-ORIGINAL.png",
    },
    {
      id: "chia",
      name: "CHÍA",
      variant: "Café",
      type: "Infusión de Origen",
      description: "Infusión con granos de café colombiano. Notas tostadas y dulzor equilibrado.",
      note: "Cacao · Café tostado · Caramelo",
      ingredients: "Miel, agua pura y café colombiano.",
      pairing: "Chocolate oscuro, tiramisú y quesos maduros.",
      color: "#86583d",
      price: 62000,
      bottleImage: "https://i.ibb.co/q3kZgQmQ/SABOR-CH-A.png",
      exploreImage: "https://i.ibb.co/G4K6GShp/EXPLORA-SABOR-CH-A.png",
    },
    {
      id: "bachue",
      name: "BACHUÉ",
      variant: "Guayaba",
      type: "Perfil Frutal",
      description: "Frutal, vibrante y refrescante. Tributo a la madre de la estirpe muisca.",
      note: "Guayaba madura · Flores · Miel clara",
      ingredients: "Miel, agua pura y guayaba.",
      pairing: "Ceviches suaves, quesos frescos y postres frutales.",
      color: "#b35f4b",
      price: 62000,
      bottleImage: "https://i.ibb.co/9HpZqQd3/SABOR-BACHU.png",
      exploreImage: "https://i.ibb.co/6c2j4mZp/EXPLORA-SABOR-BACHU.png",
    },
    {
      id: "nemqueteba",
      name: "NEMQUETEBA",
      variant: "Lulo / Maracuyá",
      type: "Perfil Cítrico Exótico",
      description: "Notas cítricas y vibrantes que despiertan los sentidos.",
      note: "Maracuyá · Lulo · Acidez brillante",
      ingredients: "Miel, agua pura, lulo y maracuyá.",
      pairing: "Mariscos, cocina picante y ensaladas tropicales.",
      color: "#c67c26",
      price: 64000,
      bottleImage: "https://i.ibb.co/hFCwsJyC/SABOR-NEMQUETEBA.png",
      exploreImage: "https://i.ibb.co/YTtbnRbx/EXPLORA-SABOR-NEMQUETEBA.png",
    },
  ];

  var checkoutItems = products
    .map(function (p) {
      return { id: p.id, name: p.name + " · " + p.variant, price: p.price };
    })
    .concat([{ id: "pack", name: "Pack Trilogía", price: 168000 }]);

  var FREE_SHIPPING_FROM = 180000;
  var SHIPPING_COST = 12000;
  var MAX_PER_ITEM = 12;
  var ICON_URL = "https://i.ibb.co/8LKg1wPn/ICONO-MARRON.png";

  /* ---------- ESTADO ---------- */
  var state = {
    cycleStep: 0,
    selectedProduct: null,
    menuOpen: false,
    quantities: { sue: 1, chia: 0, bachue: 0, nemqueteba: 0, pack: 0 },
  };

  /* ---------- UTILIDADES ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var money = function (v) { return "$ " + v.toLocaleString("es-CO"); };
  var pad2 = function (n) { return String(n).padStart(2, "0"); };
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- MENÚ MÓVIL + SCROLL LOCK ---------- */
  var navLinks = $("#nav-links");
  var menuToggle = $("#menu-toggle");

  function updateScrollLock() {
    document.body.style.overflow = state.selectedProduct || state.menuOpen ? "hidden" : "";
  }

  function setMenu(open) {
    state.menuOpen = open;
    navLinks.classList.toggle("nav-links--open", open);
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    updateScrollLock();
  }

  menuToggle.addEventListener("click", function () { setMenu(!state.menuOpen); });
  $$("a", navLinks).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  $(".brand-link").addEventListener("click", function () { setMenu(false); });
  $(".button--nav").addEventListener("click", function () { setMenu(false); });

  /* ---------- SECCIÓN ACTIVA EN EL NAV ---------- */
  var navAnchors = $$("[data-nav]");
  var frame = 0;

  function updateActiveSection() {
    frame = 0;
    var probe = 76 + (window.innerHeight - 76) * 0.28;
    var current = "";
    $$("main > section[id]").forEach(function (section) {
      var b = section.getBoundingClientRect();
      if (!current && b.top <= probe && b.bottom > probe) current = section.id;
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-nav") === current);
    });
  }
  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(updateActiveSection);
  }
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  updateActiveSection();

  /* ---------- CICLO SAGRADO ---------- */
  var timeline = $("#timeline");
  var cyclePanel = $("#cycle-panel");

  function renderTimeline() {
    var html = '<div class="timeline-line"></div>';
    cycle.forEach(function (step, i) {
      var cls = (state.cycleStep === i ? "active" : "") + " " + (state.cycleStep + 1 === i ? "next" : "");
      html +=
        '<button class="' + cls.trim() + '" data-step="' + i + '" role="tab" aria-selected="' + (state.cycleStep === i) + '">' +
        "<span>" + pad2(i + 1) + "</span><strong>" + esc(step.label) + "</strong></button>";
    });
    timeline.innerHTML = html;
  }

  function renderCyclePanel() {
    var s = cycle[state.cycleStep];
    // Se reconstruye el panel completo para reiniciar las animaciones de entrada
    cyclePanel.innerHTML =
      '<div class="cycle-image"><img src="' + s.image + '" alt="' + esc(s.alt) + '" />' +
      "<span>LOTE CS — 00" + (state.cycleStep + 1) + "</span></div>" +
      '<div class="cycle-copy"><span class="cycle-number">' + pad2(state.cycleStep + 1) + "</span>" +
      "<div><h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></div>" +
      '<button class="round-next" aria-label="Siguiente paso">→</button></div>';
  }

  function setCycleStep(i) {
    state.cycleStep = i;
    renderTimeline();
    renderCyclePanel();
  }

  timeline.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-step]");
    if (btn) setCycleStep(Number(btn.getAttribute("data-step")));
  });
  cyclePanel.addEventListener("click", function (e) {
    if (e.target.closest(".round-next")) setCycleStep((state.cycleStep + 1) % cycle.length);
  });

  /* ---------- CATÁLOGO DE PRODUCTOS ---------- */
  var productGrid = $("#product-grid");

  productGrid.innerHTML = products
    .map(function (p, i) {
      return (
        '<article class="product-card" style="--accent:' + p.color + '">' +
        '<div class="product-index">0' + (i + 1) + "</div>" +
        '<div class="product-visual"><div class="ingredient-halo"></div>' +
        '<img class="product-bottle-image" src="' + p.bottleImage + '" alt="Botella de hidromiel ' + esc(p.name) + '" /></div>' +
        '<div class="product-copy"><small>' + esc(p.type) + "</small>" +
        "<h3>" + esc(p.name) + " <em>(" + esc(p.variant) + ")</em></h3>" +
        "<p>" + esc(p.description) + "</p>" +
        '<button class="text-button" data-product="' + p.id + '">Explorar sabor <span aria-hidden="true">↗</span></button></div>' +
        "</article>"
      );
    })
    .join("");

  productGrid.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-product]");
    if (!btn) return;
    var p = products.filter(function (x) { return x.id === btn.getAttribute("data-product"); })[0];
    if (p) openModal(p);
  });

  /* ---------- MODAL ---------- */
  var backdrop = $("#modal-backdrop");
  var modal = $("#product-modal");
  var modalVisual = $("#modal-visual");
  var lastFocus = null;

  function openModal(p) {
    state.selectedProduct = p;
    lastFocus = document.activeElement;
    modal.classList.add("product-modal--artwork");
    modalVisual.classList.add("modal-visual--artwork");
    modalVisual.style.setProperty("--accent", p.color);
    modalVisual.style.backgroundImage =
      "linear-gradient(180deg, transparent, rgba(24,13,8,.5)), url(" + p.exploreImage + ")";
    modalVisual.style.backgroundPosition = p.id === "bachue" || p.id === "chia" ? "center 58%" : "";
    $("#modal-title").textContent = p.name;
    $("#modal-subtitle").textContent = p.variant + " · " + p.type;
    $("#modal-description").textContent = p.description;
    $("#modal-note").textContent = p.note;
    $("#modal-ingredients").textContent = p.ingredients;
    $("#modal-pairing").textContent = p.pairing;
    $("#modal-price").textContent = money(p.price);
    backdrop.hidden = false;
    updateScrollLock();
    $("#modal-close").focus();
  }

  function closeModal() {
    if (!state.selectedProduct) return;
    state.selectedProduct = null;
    backdrop.hidden = true;
    updateScrollLock();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $("#modal-close").addEventListener("click", closeModal);
  // Cierra al hacer clic fuera de la tarjeta
  backdrop.addEventListener("mousedown", function (e) {
    if (e.target === backdrop) closeModal();
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
  $("#modal-add").addEventListener("click", function () {
    if (!state.selectedProduct) return;
    var id = state.selectedProduct.id;
    changeQuantity(id, 1);
    closeModal();
    var checkout = document.getElementById("checkout");
    if (checkout) checkout.scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- CONTADORES DE IMPACTO ---------- */
  function animateCounter(node) {
    var value = Number(node.getAttribute("data-counter"));
    var suffix = node.getAttribute("data-suffix") || "";
    var duration = 1500;
    var start = 0;
    function tick(time) {
      if (!start) start = time;
      var progress = Math.min((time - start) / duration, 1);
      var current = Math.floor(value * (1 - Math.pow(1 - progress, 3)));
      node.textContent = current.toLocaleString("es-CO") + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counters = $$("[data-counter]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- PEDIDO / CHECKOUT ---------- */
  var orderRows = $("#order-rows");
  var successMessage = $("#success-message");
  var checkoutBtn = $("#checkout-btn");

  orderRows.innerHTML = checkoutItems
    .map(function (item) {
      return (
        '<div class="order-row" data-id="' + item.id + '">' +
        '<div class="mini-swatch mini-swatch--' + item.id + '"><img src="' + ICON_URL + '" alt="" aria-hidden="true" /></div>' +
        "<div><strong>" + esc(item.name) + "</strong><small>" + money(item.price) + "</small></div>" +
        '<div class="quantity" aria-label="Cantidad de ' + esc(item.name) + '">' +
        '<button type="button" data-delta="-1" aria-label="Restar">−</button>' +
        '<strong data-qty>0</strong>' +
        '<button type="button" data-delta="1" aria-label="Sumar">+</button></div>' +
        "</div>"
      );
    })
    .join("");

  orderRows.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-delta]");
    if (!btn) return;
    var row = btn.closest(".order-row");
    changeQuantity(row.getAttribute("data-id"), Number(btn.getAttribute("data-delta")));
  });

  function changeQuantity(id, delta) {
    var next = (state.quantities[id] || 0) + delta;
    state.quantities[id] = Math.max(0, Math.min(MAX_PER_ITEM, next));
    successMessage.hidden = true;
    renderOrder();
  }

  function renderOrder() {
    var subtotal = 0;
    checkoutItems.forEach(function (item) {
      var qty = state.quantities[item.id] || 0;
      subtotal += item.price * qty;
      var row = $('.order-row[data-id="' + item.id + '"]');
      $("[data-qty]", row).textContent = qty;
    });
    var shipping = subtotal >= FREE_SHIPPING_FROM || subtotal === 0 ? 0 : SHIPPING_COST;
    $("#subtotal").textContent = money(subtotal);
    $("#shipping").textContent = shipping === 0 ? "Gratis" : money(shipping);
    $("#total").textContent = money(subtotal + shipping);
    checkoutBtn.disabled = subtotal === 0;
  }

  $("#checkout-form").addEventListener("submit", function (e) {
    e.preventDefault();
    successMessage.hidden = false;
  });

  /* ---------- INICIO ---------- */
  setCycleStep(0);
  renderOrder();
})();
