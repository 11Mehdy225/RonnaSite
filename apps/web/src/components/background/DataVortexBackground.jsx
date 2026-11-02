import { useEffect, useRef } from "react";

export default function DataVortexBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = Array.from({ length: 64 }, (_, i) => ({
      angle: (i / 64) * Math.PI * 2 + Math.random() * 0.35,
      radius: 0.1 + Math.random() * 0.9,
      speed: 0.045 + Math.random() * 0.07,
      size: 0.7 + Math.random() * 1.6,
      depth: 0.4 + Math.random() * 0.6,
    }));
    const streams = Array.from({ length: 8 }, (_, i) => ({
      offset: i / 8,
      speed: 0.04 + Math.random() * 0.03,
      side: i % 2 === 0 ? -1 : 1,
      bend: -0.6 + Math.random() * 1.2,
    }));

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pointOnCurve = (stream, progress) => {
      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const startX = stream.side < 0 ? -30 : width + 30;
      const startY = height * (0.14 + ((stream.offset * 1.7) % 0.72));
      const controlX = width * (stream.side < 0 ? 0.28 : 0.72);
      const controlY = centerY + stream.bend * height * 0.34;
      const inverse = 1 - progress;

      return {
        x: inverse * inverse * startX + 2 * inverse * progress * controlX + progress * progress * centerX,
        y: inverse * inverse * startY + 2 * inverse * progress * controlY + progress * progress * centerY,
      };
    };

    const draw = (time) => {
      const elapsed = reduceMotion ? 0 : (time - startTime) / 1000;
      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const maxRadius = Math.min(width, height) * 0.55;

      context.clearRect(0, 0, width, height);
      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 1.25);
      glow.addColorStop(0, "rgba(71,143,255,0.20)");
      glow.addColorStop(0.38, "rgba(31,79,216,0.09)");
      glow.addColorStop(1, "rgba(3,10,26,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const positions = particles.map((particle) => {
        const rotation = particle.angle + elapsed * particle.speed * (1.35 - particle.radius);
        const radius = maxRadius * particle.radius;
        return {
          x: centerX + Math.cos(rotation) * radius * 1.6,
          y: centerY + Math.sin(rotation) * radius * 0.7,
          size: particle.size * particle.depth,
          depth: particle.depth,
        };
      });

      for (let i = 0; i < positions.length; i += 1) {
        for (let j = i + 1; j < positions.length; j += 1) {
          const distance = Math.hypot(positions[i].x - positions[j].x, positions[i].y - positions[j].y);
          if (distance > 82) continue;
          context.strokeStyle = `rgba(95,183,255,${0.11 * (1 - distance / 82)})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(positions[i].x, positions[i].y);
          context.lineTo(positions[j].x, positions[j].y);
          context.stroke();
        }
      }

      positions.forEach((point) => {
        context.fillStyle = `rgba(147,197,253,${0.42 + point.depth * 0.4})`;
        context.shadowColor = "rgba(95,183,255,0.8)";
        context.shadowBlur = 8;
        context.beginPath();
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 0;
      streams.forEach((stream) => {
        const progress = reduceMotion ? 0.68 : (stream.offset + elapsed * stream.speed) % 1;
        const point = pointOnCurve(stream, progress);
        const tail = pointOnCurve(stream, Math.max(0, progress - 0.09));
        const gradient = context.createLinearGradient(tail.x, tail.y, point.x, point.y);
        gradient.addColorStop(0, "rgba(95,183,255,0)");
        gradient.addColorStop(1, "rgba(125,211,252,0.88)");
        context.strokeStyle = gradient;
        context.lineWidth = 1.35;
        context.beginPath();
        context.moveTo(tail.x, tail.y);
        context.lineTo(point.x, point.y);
        context.stroke();
        context.fillStyle = "rgba(191,219,254,0.94)";
        context.shadowColor = "rgba(59,130,246,0.88)";
        context.shadowBlur = 11;
        context.beginPath();
        context.arc(point.x, point.y, 2.1, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 18;
      context.fillStyle = "rgba(147,197,253,0.88)";
      context.beginPath();
      context.arc(centerX, centerY, 3.4, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      if (!reduceMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      if (reduceMotion) draw(performance.now());
    };
    window.addEventListener("resize", onResize, { passive: true });
    resize();
    startTime = performance.now();
    draw(startTime);

    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="rg-data-vortex" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="rg-data-vortex-shade" />
    </div>
  );
}
