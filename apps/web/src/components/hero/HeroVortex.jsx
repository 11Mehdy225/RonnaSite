import { useEffect, useRef, useState } from "react";

const WORDS = [
  "Tech & Innovation",
  "L’Afrique en avant",
  "Solutions numériques",
  "Vision • Impact • Performance",
];

export default function HeroVortex() {
  const canvasRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = Array.from({ length: 72 }, (_, i) => ({
      angle: (i / 72) * Math.PI * 2 + Math.random() * 0.35,
      radius: 0.12 + Math.random() * 0.86,
      speed: 0.055 + Math.random() * 0.08,
      size: 0.7 + Math.random() * 1.8,
      depth: 0.45 + Math.random() * 0.55,
    }));
    const streams = Array.from({ length: 9 }, (_, i) => ({
      offset: i / 9,
      speed: 0.045 + Math.random() * 0.035,
      side: i % 2 === 0 ? -1 : 1,
      bend: -0.6 + Math.random() * 1.2,
    }));

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let startTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pointOnCurve = (stream, progress) => {
      const cx = width * 0.5;
      const cy = height * 0.5;
      const startX = stream.side < 0 ? -30 : width + 30;
      const startY = height * (0.18 + ((stream.offset * 1.7) % 0.64));
      const controlX = width * (stream.side < 0 ? 0.28 : 0.72);
      const controlY = cy + stream.bend * height * 0.34;
      const inverse = 1 - progress;

      return {
        x: inverse * inverse * startX + 2 * inverse * progress * controlX + progress * progress * cx,
        y: inverse * inverse * startY + 2 * inverse * progress * controlY + progress * progress * cy,
      };
    };

    const draw = (time) => {
      const elapsed = reduceMotion ? 0 : (time - startTime) / 1000;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const maxRadius = Math.min(width, height) * 0.56;

      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      glow.addColorStop(0, "rgba(71, 143, 255, 0.18)");
      glow.addColorStop(0.35, "rgba(31, 79, 216, 0.08)");
      glow.addColorStop(1, "rgba(3, 10, 26, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const positions = particles.map((particle) => {
        const rotation = particle.angle + elapsed * particle.speed * (1.35 - particle.radius);
        const spiral = maxRadius * particle.radius;
        return {
          x: centerX + Math.cos(rotation) * spiral * 1.55,
          y: centerY + Math.sin(rotation) * spiral * 0.66,
          size: particle.size * particle.depth,
          depth: particle.depth,
        };
      });

      for (let i = 0; i < positions.length; i += 1) {
        for (let j = i + 1; j < positions.length; j += 1) {
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance > 76) continue;
          context.strokeStyle = `rgba(95, 183, 255, ${0.12 * (1 - distance / 76)})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(positions[i].x, positions[i].y);
          context.lineTo(positions[j].x, positions[j].y);
          context.stroke();
        }
      }

      positions.forEach((point) => {
        context.fillStyle = `rgba(147, 197, 253, ${0.5 + point.depth * 0.42})`;
        context.shadowColor = "rgba(95, 183, 255, 0.85)";
        context.shadowBlur = 8;
        context.beginPath();
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 0;
      streams.forEach((stream) => {
        const progress = reduceMotion ? 0.68 : (stream.offset + elapsed * stream.speed) % 1;
        const point = pointOnCurve(stream, progress);
        const tail = pointOnCurve(stream, Math.max(0, progress - 0.08));
        const streamGradient = context.createLinearGradient(tail.x, tail.y, point.x, point.y);
        streamGradient.addColorStop(0, "rgba(95, 183, 255, 0)");
        streamGradient.addColorStop(1, "rgba(125, 211, 252, 0.9)");
        context.strokeStyle = streamGradient;
        context.lineWidth = 1.4;
        context.beginPath();
        context.moveTo(tail.x, tail.y);
        context.lineTo(point.x, point.y);
        context.stroke();
        context.fillStyle = "rgba(191, 219, 254, 0.95)";
        context.shadowColor = "rgba(59, 130, 246, 0.9)";
        context.shadowBlur = 12;
        context.beginPath();
        context.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 18;
      context.fillStyle = "rgba(147, 197, 253, 0.92)";
      context.beginPath();
      context.arc(centerX, centerY, 3.5, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      if (!reduceMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(performance.now());
    });
    observer.observe(canvas);
    resize();
    startTime = performance.now();
    draw(startTime);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 220);
    }, 3800);

    return () => clearInterval(timer);
  }, []);

  return (
    <section style={styles.hero} className="rg-hero-vortex">
      <canvas ref={canvasRef} style={styles.canvas} aria-hidden="true" />

      {/* OVERLAY POUR LISIBILITÉ */}
      <div style={styles.overlay} />

      {/* CONTENU */}
      <div style={styles.content}>
        <h1 style={styles.title}>
          <span
            style={{
              ...styles.word,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
            }}
          >
            {WORDS[index]}
          </span>
        </h1>
        <div style={styles.heroText}>
          <p style={styles.p}>
            Groupe digital et innovation. Solutions numériques, services web,
            médias et accompagnement.
          </p>
          <p style={styles.p}>
            Ronna Group accompagne la transformation digitale et l’innovation en
            Afrique.
          </p>
        </div>

        <div style={styles.actions}>
          <a href="#univers" style={styles.primary}>
            Découvrir nos univers
          </a>
          <a href="#contact" style={styles.secondary}>
            Demander un devis
          </a>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    position: "relative",
    height: "55vh",
    minHeight: 380,
    width: "85vw",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  canvas: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at 50% 45%, rgba(10, 31, 68, 0.78), rgba(3, 10, 26, 0.98) 68%)",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(3,10,26,0.55) 0%, rgba(3,10,26,0.75) 60%, rgba(3,10,26,0.92) 100%)",
  },
  content: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    padding: "0 20px",
    maxWidth: 900,
  },
  title: {
    fontSize: "clamp(32px, 4.5vw, 56px)",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    marginBottom: 14,
  },
  word: {
    display: "inline-block",
    transition: "opacity .22s ease, transform .22s ease",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 1.6,
  },

  actions: {
    marginTop: 18,
    display: "flex",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  primary: {
    padding: "12px 16px",
    borderRadius: 999,
    background: "rgba(31,79,216,.95)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 10px 26px rgba(31,79,216,.22)",
  },
  secondary: {
    padding: "12px 16px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.18)",
  },
};
