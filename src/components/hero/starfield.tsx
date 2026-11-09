'use client';

import { useEffect, useRef } from 'react';

const stars = Array.from({ length: 280 }, (_, index) => {
  const fraction = (seed: number) => {
    const wave = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
    return wave - Math.floor(wave);
  };

  return {
    x: fraction(1), y: fraction(2),
    size: 0.45 + fraction(3) ** 3 * 1.25,
    brightness: 0.18 + fraction(4) * 0.61,
    depth: 0.2 + fraction(5) * 0.8,
    phase: fraction(6) * Math.PI * 2,
  };
});

function makeMeteor(start: number, first = false) {
  return {
    start,
    duration: 1050 + Math.random() * 1000,
    x: first ? 0.87 : 0.3 + Math.random() * 0.83,
    y: first ? 0.12 : -0.11 + Math.random() * 0.58,
    length: 110 + Math.random() * 180,
    distance: 210 + Math.random() * 350,
    angle: 0.42 + Math.random() * 0.23,
    color: Math.random() > 0.45 ? '190, 163, 255' : '127, 233, 255',
  };
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const ctx = context;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touch = window.matchMedia('(pointer: coarse)').matches;
    const lowPower = touch || navigator.hardwareConcurrency <= 4;
    const starCount = lowPower ? 155 : stars.length;
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousFrame = 0;
    let active = true;
    let pointerX = 0;
    let pointerY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let meteors: ReturnType<typeof makeMeteor>[] = [];
    let nextMeteor = 0;

    function draw(now: number) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#dedbff';
      offsetX += (pointerX - offsetX) * 0.055;
      offsetY += (pointerY - offsetY) * 0.055;

      for (let index = 0; index < starCount; index++) {
        const star = stars[index];
        const twinkle = media.matches ? 1 : 0.72 + Math.sin(now * 0.0012 * star.depth + star.phase) * 0.28;
        ctx.globalAlpha = star.brightness * twinkle;
        ctx.beginPath();
        ctx.arc(
          star.x * width + offsetX * star.depth,
          star.y * height + offsetY * star.depth,
          star.size, 0, Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (media.matches) return;
      if (now >= nextMeteor) {
        meteors.push(makeMeteor(now));
        nextMeteor = now + 1300 + Math.random() * 3200;
      }
      meteors = meteors.filter((meteor) => now - meteor.start < meteor.duration);

      for (const meteor of meteors) {
        const progress = (now - meteor.start) / meteor.duration;
        if (progress < 0) continue;
        const dx = Math.cos(meteor.angle);
        const dy = Math.sin(meteor.angle);
        const scale = Math.min(1, width / 760);
        const x = meteor.x * width - dx * meteor.distance * scale * progress;
        const y = meteor.y * height + dy * meteor.distance * scale * progress;
        const tail = meteor.length * scale * Math.min(1, progress * 3);
        const tailX = x + dx * tail;
        const tailY = y - dy * tail;
        const gradient = ctx.createLinearGradient(x, y, tailX, tailY);
        gradient.addColorStop(0, 'rgba(' + meteor.color + ', 0.98)');
        gradient.addColorStop(0.21, 'rgba(' + meteor.color + ', 0.55)');
        gradient.addColorStop(1, 'rgba(' + meteor.color + ', 0)');
        ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.89;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.45;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.fillStyle = '#f4f0ff';
        ctx.beginPath();
        ctx.arc(x, y, 1.45, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function tick(now: number) {
      if (now - previousFrame >= (lowPower ? 30 : 15)) {
        draw(now);
        previousFrame = now;
      }
      frame = requestAnimationFrame(tick);
    }

    function resume() {
      cancelAnimationFrame(frame);
      if (!active || document.hidden) return;
      const now = performance.now();
      if (media.matches) {
        offsetX = offsetY = pointerX = pointerY = 0;
        draw(now);
      } else {
        meteors = [makeMeteor(now + 280, true), makeMeteor(now + 1300)];
        nextMeteor = now + 3100;
        frame = requestAnimationFrame(tick);
      }
    }

    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 1.75);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(performance.now());
    });
    const visibility = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      resume();
    });
    function point(event: PointerEvent) {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 17;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 13;
    }

    resize.observe(canvas);
    visibility.observe(canvas);
    media.addEventListener('change', resume);
    document.addEventListener('visibilitychange', resume);
    if (!touch) window.addEventListener('pointermove', point, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      media.removeEventListener('change', resume);
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('pointermove', point);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
