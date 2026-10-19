import React, { useEffect, useRef } from 'react';

export default function CherryBlossoms() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Petal configuration
    const PETAL_COUNT = 38;
    const petals = [];

    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 7,
        speedY: Math.random() * 0.9 + 0.6,
        speedX: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.45 + 0.35,
        swayAmplitude: Math.random() * 30 + 15,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayOffset: Math.random() * Math.PI * 2,
        colorType: Math.random() > 0.3 ? 'pink' : 'lightBlush'
      });
    }

    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      petals.forEach((petal) => {
        petal.y += petal.speedY;
        petal.x += Math.sin(time * petal.swaySpeed + petal.swayOffset) * 0.8 + petal.speedX;
        petal.rotation += petal.rotationSpeed;

        // Reset if off bottom or sides
        if (petal.y > height + 20) {
          petal.y = -20;
          petal.x = Math.random() * width;
        }
        if (petal.x > width + 20) petal.x = -20;
        if (petal.x < -20) petal.x = width + 20;

        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate((petal.rotation * Math.PI) / 180);
        ctx.globalAlpha = petal.opacity;

        // Draw delicate organic petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          -petal.size / 2,
          -petal.size,
          petal.size / 2,
          -petal.size * 1.4,
          petal.size * 0.8,
          0
        );
        ctx.bezierCurveTo(
          petal.size * 0.5,
          petal.size * 0.6,
          -petal.size * 0.2,
          petal.size * 0.4,
          0,
          0
        );

        const grad = ctx.createRadialGradient(0, -petal.size * 0.5, 0, 0, 0, petal.size);
        if (petal.colorType === 'pink') {
          grad.addColorStop(0, '#ffe5ec');
          grad.addColorStop(0.6, '#ffb3c1');
          grad.addColorStop(1, '#ff758f');
        } else {
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.7, '#ffe5ec');
          grad.addColorStop(1, '#ffc2d1');
        }

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(255, 175, 190, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5
      }}
    />
  );
}
