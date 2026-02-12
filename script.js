const app = document.getElementById("app");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const btnZone = document.getElementById("btnZone");
const question = document.getElementById("question");
const confettiCanvas = document.getElementById("confetti");

const ctx = confettiCanvas.getContext("2d");
let confettiPieces = [];
let confettiAnimating = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function placeNoNearYes() {
  const zoneRect = btnZone.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const noWidth = noBtn.offsetWidth;
  const noHeight = noBtn.offsetHeight;
  const pad = 10;
  const maxX = Math.max(pad, zoneRect.width - noWidth - pad);
  const maxY = Math.max(pad, zoneRect.height - noHeight - pad);

  const x = clamp((yesRect.right - zoneRect.left) + 18, pad, maxX);
  const y = clamp((yesRect.top - zoneRect.top) + (yesRect.height - noHeight) / 2, pad, maxY);
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function moveNoButton() {
  const noWidth = noBtn.offsetWidth;
  const noHeight = noBtn.offsetHeight;
  const pad = 10;
  const maxX = Math.max(pad, btnZone.clientWidth - noWidth - pad);
  const maxY = Math.max(pad, btnZone.clientHeight - noHeight - pad);

  const randomX = Math.floor(Math.random() * (maxX - pad + 1)) + pad;
  const randomY = Math.floor(Math.random() * (maxY - pad + 1)) + pad;

  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
}

function evadeNoButton(event) {
  event.preventDefault();
  moveNoButton();
}

function createConfettiPiece() {
  const colors = ["#ff4d88", "#ff7cab", "#ffd166", "#7bdff2", "#b892ff", "#ffffff"];
  return {
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * -confettiCanvas.height,
    w: 6 + Math.random() * 8,
    h: 9 + Math.random() * 10,
    speedY: 2 + Math.random() * 4,
    speedX: -1.5 + Math.random() * 3,
    rotation: Math.random() * Math.PI,
    rotationSpeed: -0.16 + Math.random() * 0.32,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 0.65 + Math.random() * 0.35
  };
}

function launchConfetti(count = 220) {
  confettiPieces = Array.from({ length: count }, createConfettiPiece);
  if (!confettiAnimating) {
    confettiAnimating = true;
    requestAnimationFrame(animateConfetti);
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (const piece of confettiPieces) {
    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.rotation += piece.rotationSpeed;

    if (piece.y > confettiCanvas.height + 24) {
      piece.y = -20;
      piece.x = Math.random() * confettiCanvas.width;
    }

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.globalAlpha = piece.opacity;
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
    ctx.restore();
  }

  requestAnimationFrame(animateConfetti);
}

function celebrateYes() {
  app.classList.add("celebrate");
  question.textContent = "My Forever Valentine 💖✨ LOVE YOU LOTS BABY JAY 🌹";
  yesBtn.textContent = "Forever Us 💞";
  noBtn.style.display = "none";
  launchConfetti();
}

noBtn.addEventListener("click", evadeNoButton);
noBtn.addEventListener("focus", () => {
  noBtn.blur();
});
yesBtn.addEventListener("click", celebrateYes);

window.addEventListener("resize", () => {
  resizeCanvas();
  if (noBtn.style.display !== "none") {
    placeNoNearYes();
  }
});

resizeCanvas();
placeNoNearYes();
