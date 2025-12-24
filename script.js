// copy contract address
const copyBtn = document.querySelector("[data-copy]");
const addressEl = document.querySelector("[data-address]");

if (copyBtn && addressEl) {
  copyBtn.addEventListener("click", () => {
    const text = addressEl.textContent.trim();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showCopiedState(),
        () => fallbackCopy(text)
      );
    } else {
      fallbackCopy(text);
    }
  });
}

function fallbackCopy(text) {
  const temp = document.createElement("textarea");
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  try {
    document.execCommand("copy");
  } catch (e) {
    console.error("Copy failed", e);
  }
  document.body.removeChild(temp);
  showCopiedState();
}

function showCopiedState() {
  const original = copyBtn.textContent;
  copyBtn.textContent = "copied!";
  copyBtn.disabled = true;

  setTimeout(() => {
    copyBtn.textContent = original;
    copyBtn.disabled = false;
  }, 1500);
}

// dynamic year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

//parallax effect
const layers = document.querySelectorAll(".parallax-layer");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  layers.forEach((layer) => {
    const speed = parseFloat(layer.dataset.speed) || 0;
    const translateY = scrollY * speed;

    layer.style.transform = `translateY(${translateY}px)`;
  });
});

// starfield background
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
let width, height, centerX, centerY;
const numStars = 100;
const speed = 0.002; // hoe hoger, hoe sneller ze naar je toe komen

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  centerX = width / 2;
  centerY = height / 2;
}

window.addEventListener("resize", resize);
resize();

function createStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
    });
  }
}

createStars();

function draw() {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#f6faea";
  for (let i = 0; i < numStars; i++) {
    const star = stars[i];

    // perspectief-projectie (van 3D naar 2D)
    const k = 128 / star.z;
    const x = star.x * k + centerX;
    const y = star.y * k + centerY;

    // alleen tekenen als zichtbaar
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const size = (1.2 - star.z / width) * 4; // dichterbij = groter
      const alpha = 1 - star.z / width;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // beweeg ster naar "viewer" toe
    star.z -= speed * width;

    // reset als hij "achter ons" is
    if (star.z <= 1) {
      star.x = (Math.random() - 0.5) * width * 2;
      star.y = (Math.random() - 0.5) * height * 2;
      star.z = width;
    }
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

draw();

document.addEventListener("DOMContentLoaded", function () {
  const intro = document.getElementById("intro-overlay");
  if (!intro) return;

  // duur van de intro-animatie (moet matchen met CSS ~3s)
  const INTRO_DURATION = 3000;

  setTimeout(() => {
    intro.classList.add("intro-hidden");
    // optioneel: na fade-out het element verwijderen
    setTimeout(() => {
      if (intro && intro.parentNode) {
        intro.parentNode.removeChild(intro);
      }
    }, 600);
  }, INTRO_DURATION);
});
