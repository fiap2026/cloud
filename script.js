const translations = {
  en: {
    title: "FIAP",
    subtitle: "The International Federation of Photographic Art",
    pfiap: "FIAP Portfolio",
    mfiap: "Master FIAP",
    distinctions_title: "FIAP Distinctions",
    distinctions_desc: "Coming soon",
    biennials_title: "FIAP Biennials",
    biennials_desc: "Biennials",
    worldcup_title: "FIAP World Cup",
    worldcup_desc: "for Clubs",
    allfolders_title: "All FIAP Folders",
    allfolders_desc: "Complete archive",
    footer: "FIAP Cloud Collections Service 2026"
  },

  es: {
    title: "FIAP",
    subtitle: "Federación Internacional del Arte Fotográfico",
    pfiap: "Portfolio FIAP",
    mfiap: "Maestro FIAP",
    distinctions_title: "Distinciones FIAP",
    distinctions_desc: "Próximamente",
    biennials_title: "Bienales FIAP",
    biennials_desc: "Bienales",
    worldcup_title: "Copa del Mundo FIAP",
    worldcup_desc: "para Clubes",
    allfolders_title: "Todas las Carpetas FIAP",
    allfolders_desc: "Archivo completo",
    footer: "FIAP Cloud Collections Service 2026"
  },

  fr: {
    title: "FIAP",
    subtitle: "Fédération Internationale de l'Art Photographique",
    pfiap: "Portfolio FIAP",
    mfiap: "Maître FIAP",
    distinctions_title: "Distinctions FIAP",
    distinctions_desc: "Bientôt disponible",
    biennials_title: "Biennales FIAP",
    biennials_desc: "Biennales",
    worldcup_title: "Coupe du Monde FIAP",
    worldcup_desc: "pour Clubs",
    allfolders_title: "Tous les Dossiers FIAP",
    allfolders_desc: "Archive complète",
    footer: "FIAP Cloud Collections Service 2026"
  }
};

// elementos
const langButtons = document.querySelectorAll(".lang-btn");
const elements = document.querySelectorAll("[data-i18n]");

// función principal
function setLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.documentElement.lang = lang;

  elements.forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  langButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  localStorage.setItem("fiap_lang", lang);
}

// eventos botones
langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setLanguage(btn.dataset.lang);
  });
});

// idioma inicial
const saved = localStorage.getItem("fiap_lang") || "en";
setLanguage(saved);
