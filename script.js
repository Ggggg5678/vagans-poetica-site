/*const concerts = [
  {
    date: "25.09",
    city: "Ваш город",
    place: "«Зелёная Дама»",
    address: "ул. Некрасовская 63",
  }
];
*/
const showList = document.querySelector("#showList");
const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const dialog = document.querySelector(".ticket-dialog");
const player = document.querySelector(".fake-player");
const trackName = document.querySelector("#trackName");
const playerState = document.querySelector("#playerState");

function renderConcerts() {
  if (!showList) return;

  showList.innerHTML = concerts.map((concert) => `
    <article class="show-item">
      <div class="show-date">${concert.date}</div>
      <div>
        <div class="show-city">${concert.city}</div>
        <span class="show-place">${concert.place} · ${concert.address}</span>
      </div>
      <button class="ticket-mini" type="button" data-ticket>БИЛЕТЫ</button>
    </article>
  `).join("");
}

function openTickets() {  
  if (typeof dialog?.showModal === "function") {
    dialog.showModal();
  } else {
    alert("25.09 · 19:00\\nул. Некрасовская 63\\n«Зелёная Дама»");
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

document.querySelector("[data-player]")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  const isPlaying = player.classList.toggle("playing");

  if (isPlaying) {
    trackName.textContent = "Vagans Poetica — живьём";
    playerState.textContent = "демо включено · громкость на максимум";
    button.innerHTML = "■ Остановить";
  } else {
    trackName.textContent = "Vagans Poetica — Demo";
    playerState.textContent = "готово к шуму";
    button.innerHTML = "▶ Включить демо";
  }
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
