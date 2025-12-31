import React, { useEffect, useRef } from 'react';

export type ParticleVariant = 'trail_fire' | 'trail_ice' | 'trail_matrix' | 'trail_rainbow' | 'trail_default' | string;

interface ParticleSystemProps {
  variant?: ParticleVariant;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ variant = 'trail_default' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- CONFIGURATION BASED ON VARIANT ---
    let particleCount = 100;
    
    // FIRE
    const isFire = variant === 'trail_fire';
    const fireColors = ['#FF4500', '#FF8C00', '#FFD700', '#FFFFFF']; // Red, Orange, Gold, White
    
    // ICE
    const isIce = variant === 'trail_ice';
    const iceColors = ['#A5F2F3', '#E0F7FA', '#FFFFFF', '#00BCD4'];
    
    // MATRIX
    const isMatrix = variant === 'trail_matrix';
    
    // RAINBOW
    const isRainbow = variant === 'trail_rainbow';

    if (isMatrix) particleCount = 60; // Fewer particles for text rendering performance
    if (isFire) particleCount = 120;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      decay: number;
      rotation: number;
      rotationSpeed: number;
      char: string; // For Matrix

      constructor() {
        this.x = canvas!.width / 2;
        this.y = canvas!.height / 2;
        this.life = 1.0;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        
        // Matrix Characters
        const chars = "01ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ12345789:.<+*";
        this.char = chars.charAt(Math.floor(Math.random() * chars.length));

        // --- PHYSICS INIT ---
        if (isFire) {
            // Rise up
            const angle = -Math.PI / 2 + (Math.random() - 0.5); // Upward cone
            const speed = Math.random() * 8 + 2;
            this.vx = Math.cos(angle) * speed * 0.5; // Narrow spread
            this.vy = Math.sin(angle) * speed; 
            this.size = Math.random() * 20 + 10;
            this.color = fireColors[Math.floor(Math.random() * fireColors.length)];
            this.decay = Math.random() * 0.03 + 0.01;
        } 
        else if (isIce) {
            // Fall fast like shards
            this.x = (canvas!.width / 2) + (Math.random() - 0.5) * 200; // Wider start
            this.y = (canvas!.height / 2) - 100;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = Math.random() * 10 + 5; // Heavy gravity
            this.size = Math.random() * 10 + 5;
            this.color = iceColors[Math.floor(Math.random() * iceColors.length)];
            this.decay = Math.random() * 0.02 + 0.01;
            this.rotationSpeed = (Math.random() - 0.5) * 20; // Fast spin
        }
        else if (isMatrix) {
            // Vertical rain
            this.x = (canvas!.width / 2) + (Math.random() - 0.5) * 300;
            this.y = (canvas!.height / 2) - 150 + (Math.random() * 100);
            this.vx = 0; // No horizontal movement
            this.vy = Math.random() * 15 + 5;
            this.size = Math.random() * 16 + 12; // Font size
            this.color = '#0F0';
            this.decay = Math.random() * 0.02 + 0.005;
        }
        else if (isRainbow) {
            // Radial Explosion High Energy
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 20 + 5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.size = Math.random() * 8 + 4;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            this.decay = Math.random() * 0.015 + 0.005;
        }
        else {
            // Default Confetti
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 15 + 5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.size = Math.random() * 8 + 4;
            this.color = ['#FFD700', '#FF6347', '#4CAF50', '#00BFFF', '#9370DB'][Math.floor(Math.random() * 5)];
            this.decay = Math.random() * 0.015 + 0.005;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.rotation += this.rotationSpeed;

        if (isFire) {
            this.vy -= 0.1; // Negative gravity (rise)
            this.size *= 0.96; // Shrink smoke
        } else if (isIce) {
            this.vy += 0.2; // Heavy gravity
        } else if (isMatrix) {
            // Constant speed, no gravity change
        } else {
            // Default gravity
            this.vy += 0.25;
            this.vx *= 0.96; // Friction
            this.vy *= 0.96;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life;
        
        if (isFire) {
            ctx.globalCompositeOperation = 'lighter'; // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        } 
        else if (isIce) {
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#fff';
            // Draw Diamond/Shard
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        else if (isMatrix) {
            ctx.fillStyle = (Math.random() > 0.9) ? '#FFF' : this.color; // Flicker white
            ctx.font = `bold ${this.size}px monospace`;
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#0F0';
            ctx.fillText(this.char, this.x, this.y);
        }
        else {
            // Default & Rainbow
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            if (isRainbow) {
                // Shift hue slightly every frame for rainbow effect
                const currentHue = parseFloat(this.color.split('(')[1]);
                this.color = `hsl(${(currentHue + 5) % 360}, 100%, 50%)`;
            }
            // Square confetti
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }

        ctx.restore();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const animate = () => {
      // Clear canvas (Special trail effect for Matrix?)
      if (isMatrix) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Fade out for trail
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
          // Clean finish
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant]); // Re-run if variant changes

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[60]" />;
};