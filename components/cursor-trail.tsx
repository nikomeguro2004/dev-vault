"use client";

import { useEffect, useRef } from "react";

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasEl = canvas;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    const ctx = context;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pointerX = width / 2;
    let pointerY = height / 2;
    let headX = pointerX;
    let headY = pointerY;
    let active = false;
    let rafId = 0;
    const trail: Array<{ x: number; y: number; life: number }> = [];

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasEl.width = Math.floor(width * dpr);
      canvasEl.height = Math.floor(height * dpr);
      canvasEl.style.width = `${width}px`;
      canvasEl.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMove(event: PointerEvent) {
      active = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
    }

    function onLeave() {
      active = false;
    }

    resizeCanvas();

    function tick() {
      headX += (pointerX - headX) * 0.28;
      headY += (pointerY - headY) * 0.28;

      trail.unshift({ x: headX, y: headY, life: 1 });
      if (trail.length > 28) {
        trail.length = 28;
      }

      ctx.clearRect(0, 0, width, height);

      if (trail.length > 1) {
        for (let index = 0; index < trail.length; index += 1) {
          trail[index].life *= 0.95;
        }

        const headAlpha = active ? 0.55 : 0.35;
        const tailAlpha = active ? 0.18 : 0.1;
        const gradient = ctx.createLinearGradient(trail[trail.length - 1].x, trail[trail.length - 1].y, headX, headY);
        gradient.addColorStop(0, `rgba(125, 211, 252, ${tailAlpha})`);
        gradient.addColorStop(1, `rgba(186, 230, 253, ${headAlpha})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = active ? 4.5 : 3.2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        for (let index = 1; index < trail.length - 1; index += 1) {
          const current = trail[index];
          const next = trail[index + 1];
          const cx = (current.x + next.x) / 2;
          const cy = (current.y + next.y) / 2;
          ctx.quadraticCurveTo(current.x, current.y, cx, cy);
        }

        const last = trail[trail.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      }

      while (trail.length && trail[trail.length - 1].life < 0.06) {
        trail.pop();
      }

      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-trail-canvas" aria-hidden="true" />;
}
