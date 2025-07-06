import confetti from "canvas-confetti";

const defaultConfettiOptions = {
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
};

function createConfettiCanvas() {
  const canvas = document.createElement("canvas");

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "1000";
  canvas.setAttribute("data-confetti", "true");

  document.body.appendChild(canvas);

  return confetti.create(canvas, {
    resize: true,
    useWorker: true,
  });
}

export function celebrateImageGeneration() {
  const confettiInstance = createConfettiCanvas();

  confettiInstance({
    ...defaultConfettiOptions,
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.65 },
    colors: ["#ff9800", "#ff5722", "#f44336"],
  });

  setTimeout(() => {
    confettiInstance({
      ...defaultConfettiOptions,
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ["#4caf50", "#8bc34a", "#cddc39"],
    });
  }, 100);

  setTimeout(() => {
    confettiInstance({
      ...defaultConfettiOptions,
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.55 },
      colors: ["#3f51b5", "#2196f3", "#03a9f4", "#00bcd4"],
    });
  }, 250);

  setTimeout(() => {
    const canvases = document.querySelectorAll('canvas[data-confetti="true"]');
    canvases.forEach((canvas) => {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    });
  }, 5000);
}
