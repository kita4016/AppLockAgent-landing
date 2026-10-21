/**
 * ヒーロー内のスマホ画面スライダー（静的 LP 用）
 */
(function () {
  const root = document.querySelector("[data-phone-carousel]");
  if (!root) return;

  const track = root.querySelector("[data-carousel-track]");
  const slides = Array.from(root.querySelectorAll("[data-carousel-slide]"));
  const dots = Array.from(root.querySelectorAll("[data-carousel-dot]"));
  const caption = root.querySelector("[data-carousel-caption]");
  const prevBtn = root.querySelector("[data-carousel-prev]");
  const nextBtn = root.querySelector("[data-carousel-next]");
  const lockMock = root.querySelector("[data-mock-lock]");
  const countdownEl = root.querySelector("[data-mock-countdown]");

  let index = 0;
  let touchStartX = 0;
  let lockRemaining = lockMock
    ? Number(lockMock.dataset.lockRemaining || 0)
    : 0;
  const lockTotal = lockMock ? Number(lockMock.dataset.lockTotal || 1) : 1;

  function formatCountdown(seconds) {
    const total = Math.max(0, Math.ceil(seconds));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function updateLockMock() {
    if (!lockMock || !countdownEl) return;
    const elapsed = Math.max(0, lockTotal - lockRemaining);
    const progress = lockTotal > 0 ? elapsed / lockTotal : 0;
    lockMock.style.setProperty("--ring-progress", String(progress));
    countdownEl.textContent = formatCountdown(lockRemaining);
  }

  function tickLockMock() {
    if (index !== 0 || !lockMock) return;
    if (lockRemaining > 0) lockRemaining -= 1;
    updateLockMock();
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, j) => {
      dot.classList.toggle("is-active", j === index);
      dot.setAttribute("aria-selected", j === index ? "true" : "false");
    });
    if (caption && slides[index].dataset.caption) {
      caption.textContent = slides[index].dataset.caption;
    }
    if (index === 0) updateLockMock();
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

  root.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  root.addEventListener(
    "touchend",
    (e) => {
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) < 40) return;
      goTo(delta < 0 ? index + 1 : index - 1);
    },
    { passive: true }
  );

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    }
  });

  updateLockMock();
  setInterval(tickLockMock, 1000);
  goTo(0);
})();
