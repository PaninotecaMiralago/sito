const languageButton = document.getElementById('languageButton');
const languageMenu = document.getElementById('languageMenu');
const currentFlag = document.getElementById('currentFlag');


document.getElementById('languageButton').addEventListener('click', function () {
  const menu = document.getElementById('languageMenu');
  menu.classList.toggle('vis');
});

document.addEventListener('click', function (e) {
  const button = document.getElementById('languageButton');
  const menu = document.getElementById('languageMenu');

  if (!button.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('vis');
  }
});



// Cambio lingua
document.querySelectorAll('#languageMenu div').forEach(el => {
  el.addEventListener('click', function() {
    const selectedLang = this.getAttribute('data-lang');
    const selectedImg = this.querySelector('img').src;

    // Cambia bandiera visibile
    currentFlag.src = selectedImg;

    // Chiude menu
    //languageMenu.style.display = 'none';

    //Setta la flag in flex
    const prevlang = localStorage.getItem('preferredLang');
    console.log("lingua precendente: ",prevlang)

    if (prevlang) {
      const langElement = document.querySelector(`#languageMenu div[data-lang="${prevlang}"]`);
      if (langElement) {
        langElement.style.display = 'flex';
        }
      }

    // Salva lingua
    localStorage.setItem('preferredLang', selectedLang);
    loadLanguage(selectedLang);
  });
});

// Caricamento lingua
function getBrowserLang() {
  const lang = navigator.language || navigator.userLanguage;
  if (lang.startsWith('it')) {
    return 'it';
  } else if (lang.startsWith('en')) {
    return 'en';
  } else if (lang.startsWith('fr')) {
    return 'fr';
  } else if (lang.startsWith('de')) {
    return 'de';
  } else {
    return 'en';
  }
}

function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then(response => response.json())
    .then(translations => {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
          el.textContent = translations[key];
        }
      });
      // Aggiorna bandiera anche all'avvio
      const selectedOption = document.querySelector(`#languageMenu div[data-lang="${lang}"]`);
      if (selectedOption) {
        currentFlag.src = selectedOption.querySelector('img').src;
        selectedOption.style.display = 'none';
      }
    })
    .catch(error => console.error("Errore caricamento lingua:", error));
}

document.getElementById('languageMenu').addEventListener('click', function () {
  const menu = document.getElementById('languageMenu');
  menu.classList.remove('vis');
});

// All'avvio
const savedLang = localStorage.getItem('preferredLang') || getBrowserLang();
loadLanguage(savedLang);

//Intro e Cards
const intro = document.getElementById('intro');
const content = document.querySelector('.container');
const hiddenCards = document.querySelectorAll('.hidden');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

hiddenCards.forEach(card => observer.observe(card));

// Funzione per nascondere l'intro
function hideIntro() {
  intro.classList.add('hidden');
  document.body.style.overflow = 'auto'; // Rendi scrollabile
  setTimeout(() => {
    content.classList.remove('hidden-content');
  }, 100); // Match alla durata della transizione
}

// Gestire lo swipe up
let startY = 0;
document.addEventListener('touchstart', (e) => {
  startY = e.touches[0].clientY;
});
document.addEventListener('touchend', (e) => {
  const endY = e.changedTouches[0].clientY;
  if (startY - endY > 50) {
    hideIntro();
  }
});

// Gestire lo scroll con mouse
document.addEventListener('wheel', (e) => {
  if (e.deltaY > 20) {
    hideIntro();
  }
});

// All'inizio reset completo
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  intro.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Blocca lo scroll
  content.classList.add('hidden-content');
});

// Gestire il click su una card per aprire il menu a tendina
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('active');
  });
});
