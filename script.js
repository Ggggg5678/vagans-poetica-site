const concerts = [
  {
    date: "13.11",
    time: "20:00",
    city: "Самара",
    place: "Галактионовская 46",
    address: "г. Самара",
    image: "assets/pank.jpg"
  }
];

const showList = document.querySelector("#showList");
const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const dialog = document.querySelector(".ticket-dialog");
const player = document.querySelector(".fake-player");
const trackName = document.querySelector("#trackName");
const playerState = document.querySelector("#playerState");
const tracklistEl = document.querySelector("#tracklist");

const tracks = [
  { title: "Intro", file: "assets/intro.wav" },
  { title: "Аспирин", file: "assets/аспирин.wav" },
  { title: "Меняю сюжет", file: "assets/Меняю сюжет.wav" },
  { title: "Панки не летают", file: "assets/панки не летают.wav" },
  { title: "Свечи", file: "assets/свечи.wav" },
  { title: "Тощий человек", file: "assets/тощий челоdек.wav" },
  { title: "Химик со вкусом", file: "assets/химик со вкусом.wav" }
];

let currentTrackIndex = 0;
let currentAudio = null;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function renderTracklist() {
  if (!tracklistEl) return;
  tracklistEl.innerHTML = tracks.map((track, i) => `
    <div class="track-item${i === currentTrackIndex ? " playing" : ""}" data-track="${i}">
      <span class="track-number">${i + 1}</span>
      <span class="track-title">${track.title}</span>
      <span class="track-duration">--:--</span>
      <button class="track-play" aria-label="${i === currentTrackIndex && player.classList.contains("playing") ? "Остановить" : "Воспроизвести"} ${track.title}">${i === currentTrackIndex && player.classList.contains("playing") ? "■" : "▶"}</button>
    </div>
  `).join("");
}

function loadTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  currentTrackIndex = index;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentAudio = new Audio(tracks[index].file);
  currentAudio.addEventListener("loadedmetadata", () => {
    const el = tracklistEl.querySelector(`[data-track="${index}"]`);
    if (el) {
      el.querySelector(".track-duration").textContent = formatTime(currentAudio.duration);
    }
  });
  setupEndedHandler();
  renderTracklist();

  trackName.textContent = tracks[index].title;
  playerState.textContent = "готово к шуму";
  player.classList.remove("playing");
}

// Клик по треку в списке — выбрать и начать/остановить воспроизведение.
tracklistEl?.addEventListener("click", (event) => {
  const trackItem = event.target.closest(".track-item");
  if (!trackItem) return;
  const index = Number(trackItem.dataset.track);
  const wasPlaying = player.classList.contains("playing") && currentTrackIndex === index;

  loadTrack(index);

  if (wasPlaying) {
    player.classList.remove("playing");
    playerState.textContent = "на паузе";
    currentAudio?.pause();
  } else {
    currentAudio?.play().catch(() => {});
    player.classList.add("playing");
    trackName.textContent = tracks[currentTrackIndex].title;
    playerState.textContent = "играет";
  }
  renderTracklist();
});

// Авто-переход на следующий трек когда текущий закончился.
function setupEndedHandler() {
  if (currentAudio) {
    currentAudio.onended = () => {
      loadTrack((currentTrackIndex + 1) % tracks.length);
      currentAudio?.play().catch(() => {});
      player.classList.add("playing");
      trackName.textContent = tracks[currentTrackIndex].title;
      playerState.textContent = "играет";
      renderTracklist();
    };
  }
}
function renderConcerts() {
  if (!showList) return;

  showList.innerHTML = concerts.map((concert) => `
    <article class="show-item">
      <div class="show-date">${concert.date} · ${concert.time}</div>
      <div>
        <div class="show-city">${concert.city}</div>
        <span class="show-place">${concert.place} · ${concert.address}</span>
      </div>
      <img class="show-img" src="${concert.image}" alt="${concert.place}">
      <button class="ticket-mini" type="button" data-ticket>БИЛЕТЫ</button>
    </article>
  `).join("");
}


function openTickets() {  
  if (typeof dialog?.showModal === "function") {
    dialog.showModal();
  } else {
    alert("13.11 · 20:00\\nг. Самара\\nГалактионовская 46\\nВход бесплатный");
  }
}

document.addEventListener("click", (event) => {
  const ticketButton = event.target.closest("[data-ticket]");
  if (ticketButton) openTickets();

  const scrollTrigger = event.target.closest("[data-scroll]");
  if (scrollTrigger) {
    document.querySelector(scrollTrigger.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
  }

  const navLink = event.target.closest(".nav a");
  if (navLink) {
    nav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

document.querySelector(".close-dialog")?.addEventListener("click", () => dialog.close());
document.querySelector(".close-action")?.addEventListener("click", () => dialog.close());

dialog?.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right &&
                 event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) dialog.close();
});

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Небольшой эффект появления элементов при прокрутке.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".section, .event-strip, .site-footer").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(18px)";
  el.style.transition = "opacity .6s ease, transform .6s ease";
  observer.observe(el);
});

// Класс добавляется после начала наблюдения.
const styleObserverFix = new MutationObserver((mutations) => {
  mutations.forEach(({ target }) => {
    if (target.classList.contains("visible")) {
      target.style.opacity = "1";
      target.style.transform = "translateY(0)";
    }
  });
});
document.querySelectorAll(".section, .event-strip, .site-footer").forEach((el) => {
  styleObserverFix.observe(el, { attributes: true, attributeFilter: ["class"] });
});

renderConcerts();
renderTracklist();
loadTrack(0);


// Вставь сюда настоящую ссылку на страницу пожертвований.
// Пока ссылка пустая, кнопка открывает подсказку и не принимает платежи.
const DONATION_URL ="https://yoomoney.ru/quickpay/fundraise/button?billNumber=1L0SN9N41JN.261019&";

const donateDialog = document.querySelector(".donate-dialog");
document.querySelector("#donateLink")?.addEventListener("click", (event) => {
  event.preventDefault();
  if (DONATION_URL.trim()) {
    window.open(DONATION_URL, "_blank", "noopener,noreferrer");
  } else if (typeof donateDialog?.showModal === "function") {
    donateDialog.showModal();
  } else {
    alert("Добавь ссылку для пожертвований в переменную DONATION_URL в script.js");
  }
});
document.querySelectorAll(".close-donate, .close-donate-action").forEach((button) => {
  button.addEventListener("click", () => donateDialog?.close());
});
donateDialog?.addEventListener("click", (event) => {
  const rect = donateDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) donateDialog.close();
});
