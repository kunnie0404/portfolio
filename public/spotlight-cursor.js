(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (reducedMotion || coarsePointer) return;

  document.querySelectorAll("[data-spotlight-cursor]").forEach((canvas) => {
    const context = canvas.getContext("2d");
    if (!context) return;

    const radius = Number(canvas.dataset.radius || 200);
    const brightness = Number(canvas.dataset.brightness || 0.14);
    const smoothing = Number(canvas.dataset.smoothing || 0.12);
    let frame = 0;
    let active = false;
    let initialized = false;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const move = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      active = true;
      if (!initialized) {
        currentX = targetX;
        currentY = targetY;
        initialized = true;
      }
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      currentX += (targetX - currentX) * smoothing;
      currentY += (targetY - currentY) * smoothing;

      if (active) {
        const gradient = context.createRadialGradient(currentX, currentY, 0, currentX, currentY, radius);
        gradient.addColorStop(0, `rgba(255,255,255,${brightness})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      }

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", () => {
      active = false;
    });
    frame = window.requestAnimationFrame(draw);

    window.addEventListener("pagehide", () => window.cancelAnimationFrame(frame), { once: true });
  });
})();
