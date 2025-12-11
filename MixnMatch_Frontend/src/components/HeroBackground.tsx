import { useEffect, useRef } from "react";

export const HeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationId: number;
    let observer: IntersectionObserver;

    // Use requestAnimationFrame to defer layout read and avoid forced reflow
    const initId = requestAnimationFrame(() => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 800;
      const height = rect.height || 600;

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Draw static particles once and exit
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = width;
        canvas.height = height;
        const colors = ["#d8b4fe", "#fbbf24", "#fb923c", "#fca5a5", "#86efac"];
        for (let i = 0; i < 15; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 20 + 10,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)] + "15";
          ctx.fill();
        }
        return;
      }

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;

      // Reduced particle count for better performance (15 instead of 30)
      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
      }> = [];

      const colors = ["#d8b4fe", "#fbbf24", "#fb923c", "#fca5a5", "#86efac"];

      for (let i = 0; i < 15; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 20 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      let lastTime = 0;
      const targetFPS = 30;
      const frameInterval = 1000 / targetFPS;

      // Use Intersection Observer to pause animation when not visible
      observer = new IntersectionObserver(
        (entries) => {
          isVisibleRef.current = entries[0].isIntersecting;
        },
        { threshold: 0.1 }
      );
      observer.observe(canvas);

      const animate = (currentTime: number) => {
        animationId = requestAnimationFrame(animate);

        // Skip frames to maintain target FPS
        const deltaTime = currentTime - lastTime;
        if (deltaTime < frameInterval) return;
        lastTime = currentTime - (deltaTime % frameInterval);

        // Skip if not visible
        if (!isVisibleRef.current) return;

        ctx.clearRect(0, 0, width, height);

        particles.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color + "15";
          ctx.fill();
        });
      };

      animationId = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(initId);
      if (animationId) cancelAnimationFrame(animationId);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full will-change-transform"
      style={{ filter: "blur(40px)" }}
      aria-hidden="true"
    />
  );
};
