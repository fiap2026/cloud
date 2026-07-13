const translations = {
  en: {
    title: "FIAP",
    subtitle: "The International Federation of Photographic Art",
    pfiap: "FIAP Portfolio",
    mfiap: "Master FIAP",
    biennials_title: "FIAP Biennials",
    biennials_desc: "Biennials",
    worldcup_title: "FIAP World Cup",
    worldcup_desc: "for Clubs",
    news_title: "FIAP News",
    news_desc: "News and publications",
    distinctions_title: "FIAP Distinctions",
    distinctions_desc: "Coming soon",
    archive_title: "FIAP Archive",
    archive_desc: "FIAP Archive",
    congress_title: "FIAP Congress",
    congress_desc: "FIAP Congress",
    exhibition_centers_title: "FIAP Exhibition Centers",
    exhibition_centers_desc: "FIAP Exhibition Centers",
    board_meetings_title: "FIAP Board Meetings",
    board_meetings_desc: "FIAP Board Meetings",
    best_of_best_title: "Best of the Best",
    best_of_best_desc: "Best of the Best",
    allfolders_title: "All FIAP Folders",
    allfolders_desc: "Complete archive",
    footer: "FIAP Cloud Collections Service 2026"
  },

  es: {
    title: "FIAP",
    subtitle: "Federación Internacional del Arte Fotográfico",
    pfiap: "Portfolio FIAP",
    mfiap: "Maestro FIAP",
    biennials_title: "Bienales FIAP",
    biennials_desc: "Bienales",
    worldcup_title: "Copa del Mundo FIAP",
    worldcup_desc: "para Clubes",
    news_title: "Noticias FIAP",
    news_desc: "Noticias y publicaciones",
    distinctions_title: "Distinciones FIAP",
    distinctions_desc: "Próximamente",
    archive_title: "Archivo FIAP",
    archive_desc: "Archivo FIAP",
    congress_title: "Congreso FIAP",
    congress_desc: "Congreso FIAP",
    exhibition_centers_title: "Centros de Exposiciones FIAP",
    exhibition_centers_desc: "Centros de Exposiciones FIAP",
    board_meetings_title: "Reuniones de la Junta FIAP",
    board_meetings_desc: "Reuniones de la Junta FIAP",
    best_of_best_title: "Lo Mejor de lo Mejor",
    best_of_best_desc: "Lo Mejor de lo Mejor",
    allfolders_title: "Todas las Carpetas FIAP",
    allfolders_desc: "Archivo completo",
    footer: "FIAP Cloud Collections Service 2026"
  },

  fr: {
    title: "FIAP",
    subtitle: "Fédération Internationale de l'Art Photographique",
    pfiap: "Portfolio FIAP",
    mfiap: "Maître FIAP",
    biennials_title: "Biennales FIAP",
    biennials_desc: "Biennales",
    worldcup_title: "Coupe du Monde FIAP",
    worldcup_desc: "pour Clubs",
    news_title: "Actualités FIAP",
    news_desc: "Actualités et publications",
    distinctions_title: "Distinctions FIAP",
    distinctions_desc: "Bientôt disponible",
    archive_title: "Archive FIAP",
    archive_desc: "Archive FIAP",
    congress_title: "Congrès FIAP",
    congress_desc: "Congrès FIAP",
    exhibition_centers_title: "Centres d'Exposition FIAP",
    exhibition_centers_desc: "Centres d'Exposition FIAP",
    board_meetings_title: "Réunions du Conseil FIAP",
    board_meetings_desc: "Réunions du Conseil FIAP",
    best_of_best_title: "Le Meilleur du Meilleur",
    best_of_best_desc: "Le Meilleur du Meilleur",
    allfolders_title: "Tous les Dossiers FIAP",
    allfolders_desc: "Archive complète",
    footer: "FIAP Cloud Collections Service 2026"
  }
};

// elementos
const languageStorageKey = "fiap_selected_language";
const langButtons = document.querySelectorAll(".lang-btn");
const elements = document.querySelectorAll("[data-i18n]");
const defaultLanguage = "en";

function getValidLanguage(lang) {
  return translations[lang] ? lang : defaultLanguage;
}

// función principal
function setLanguage(lang, savePreference = true) {
  const selectedLang = getValidLanguage(lang);
  const dict = translations[selectedLang];

  document.documentElement.lang = selectedLang;

  elements.forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  langButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === selectedLang);
  });

  if (savePreference) {
    localStorage.setItem(languageStorageKey, selectedLang);
    localStorage.setItem("fiap_lang", selectedLang);
  }
}

// eventos botones
langButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    setLanguage(btn.dataset.lang, true);
  });
});

// idioma inicial: siempre prevalece la elección guardada por las banderas
const savedLanguage =
  localStorage.getItem(languageStorageKey) ||
  localStorage.getItem("fiap_lang") ||
  defaultLanguage;

setLanguage(savedLanguage, false);
