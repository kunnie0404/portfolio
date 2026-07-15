"use client";

import { useEffect, useRef, type CanvasHTMLAttributes } from "react";

type SpotlightConfig = {
  radius?: number;
  brightness?: number;
  color?: string;
  smoothing?: number;
};

type SpotlightCursorProps = CanvasHTMLAttributes<HTMLCanvasElement> & {
  config?: SpotlightConfig;
};

function hexToRgb(hex: string) {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return `${(value >> 16) & 255},${(value >> 8) & 255},${value & 255}`;
}

export function SpotlightCursor({
  config = {},
  className = "",
  ...props
}: SpotlightCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const radius = config.radius ?? 200;
  const brightness = config.brightness ?? 0.14;
  const color = config.color ?? "#ffffff";
  const smoothing = config.smoothing ?? 0.12;

  useEffect(() => {
    const canvas = canvasRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    if (!canvas || reducedMotion.matches || coarsePointer.matches) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let active = false;
    let initialized = false;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    const rgb = hexToRgb(color);

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const move = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      active = true;
      if (!initialized) {
        currentX = targetX;
        currentY = targetY;
        initialized = true;
      }
    };

    const leave = () => {
      active = false;
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      currentX += (targetX - currentX) * smoothing;
      currentY += (targetY - currentY) * smoothing;

      if (active) {
        const gradient = context.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          radius,
        );
        gradient.addColorStop(0, `rgba(${rgb},${brightness})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      }

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      window.cancelAnimationFrame(frame);
    };
  }, [brightness, color, radius, smoothing]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`spotlight-cursor ${className}`.trim()}
      {...props}
    />
  );
}
