const body = document.body;
const app = document.getElementById("app");
const introOverlay = document.getElementById("introOverlay");
const countdown = document.getElementById("countdown");
const rabbit = document.getElementById("rabbit");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const btnZone = document.getElementById("btnZone");
const question = document.getElementById("question");
const confettiCanvas = document.getElementById("confetti");

const ctx = confettiCanvas.getContext("2d");
let confettiPieces = [];
let burstParticles = [];
let confettiAnimating = false;
let introAnimating = false;
let yesScale = 1;
let sadTimeout;

body.classList.add("intro-active");

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
  triggerSadRabbit();
  yesScale = Math.min(2.1, yesScale + 0.12);
  yesBtn.style.setProperty("--yes-scale", yesScale.toFixed(2));
  moveNoButton();
}

function triggerSadRabbit() {
  if (app.classList.contains("celebrate")) {
    return;
  }

  app.classList.remove("rabbit-happy");
  app.classList.add("rabbit-sad");
  clearTimeout(sadTimeout);
  sadTimeout = setTimeout(() => {
    app.classList.remove("rabbit-sad");
  }, 900);
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

function createBurstParticle(cx, cy) {
  const themes = ["heart", "spark", "dot"];
  const choice = themes[Math.floor(Math.random() * themes.length)];
  const angle = Math.random() * Math.PI * 2;
  const speed = 2.2 + Math.random() * 7.2;

  return {
    x: cx,
    y: cy,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 38 + Math.random() * 26,
    maxLife: 38 + Math.random() * 26,
    size: 4 + Math.random() * 8,
    gravity: 0.06 + Math.random() * 0.09,
    drag: 0.984,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: -0.12 + Math.random() * 0.24,
    hue: 330 + Math.random() * 40,
    type: choice
  };
}

function addLoveExplosion() {
  const centerX = confettiCanvas.width / 2;
  const centerY = confettiCanvas.height / 2;
  const count = Math.max(220, Math.floor(confettiCanvas.width * 0.22));

  for (let i = 0; i < count; i += 1) {
    burstParticles.push(createBurstParticle(centerX, centerY));
  }

  if (!introAnimating) {
    introAnimating = true;
    requestAnimationFrame(animateLoveExplosion);
  }
}

function drawHeartParticle(particle) {
  const s = particle.size;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(0, -s * 0.1, -s * 0.55, -s * 0.1, -s * 0.55, s * 0.25);
  ctx.bezierCurveTo(-s * 0.55, s * 0.55, -s * 0.2, s * 0.8, 0, s);
  ctx.bezierCurveTo(s * 0.2, s * 0.8, s * 0.55, s * 0.55, s * 0.55, s * 0.25);
  ctx.bezierCurveTo(s * 0.55, -s * 0.1, 0, -s * 0.1, 0, s * 0.35);
  ctx.fill();
}

function drawSparkParticle(particle) {
  const s = particle.size;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.28, -s * 0.28);
  ctx.lineTo(s, 0);
  ctx.lineTo(s * 0.28, s * 0.28);
  ctx.lineTo(0, s);
  ctx.lineTo(-s * 0.28, s * 0.28);
  ctx.lineTo(-s, 0);
  ctx.lineTo(-s * 0.28, -s * 0.28);
  ctx.closePath();
  ctx.fill();
}

function animateLoveExplosion() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  burstParticles = burstParticles.filter((particle) => particle.life > 0);

  for (const particle of burstParticles) {
    particle.vx *= particle.drag;
    particle.vy = particle.vy * particle.drag + particle.gravity;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.rotation += particle.rotationSpeed;
    particle.life -= 1;

    const alpha = Math.max(0, particle.life / particle.maxLife);
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `hsla(${particle.hue}, 95%, 72%, ${alpha})`;

    if (particle.type === "heart") {
      drawHeartParticle(particle);
    } else if (particle.type === "spark") {
      drawSparkParticle(particle);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, particle.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  if (burstParticles.length > 0) {
    requestAnimationFrame(animateLoveExplosion);
  } else {
    introAnimating = false;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

function celebrateYes() {
  clearTimeout(sadTimeout);
  app.classList.remove("rabbit-sad");
  app.classList.add("rabbit-happy");
  app.classList.add("celebrate");
  question.textContent = "My Forever Valentine 💖✨ LOVE YOU LOTS BABY JAY 🌹";
  yesBtn.textContent = "Forever Us 💞";
  noBtn.style.display = "none";
  launchConfetti();
}

function animateCountdownNumber(number) {
  return new Promise((resolve) => {
    countdown.textContent = String(number);
    countdown.classList.remove("animate");
    void countdown.offsetWidth;
    countdown.classList.add("animate");
    setTimeout(resolve, 700);
  });
}

function finalizeIntro() {
  app.classList.add("app-ready");
  introOverlay.classList.add("done");
  body.classList.remove("intro-active");
}

async function runIntroSequence() {
  await animateCountdownNumber(3);
  await animateCountdownNumber(2);
  await animateCountdownNumber(1);

  addLoveExplosion();
  app.classList.add("app-enter");

  setTimeout(() => {
    app.classList.add("app-pop");
  }, 850);

  setTimeout(() => {
    finalizeIntro();
  }, 1300);
}

noBtn.addEventListener("click", evadeNoButton);
noBtn.addEventListener("mouseenter", triggerSadRabbit);
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
runIntroSequence();
