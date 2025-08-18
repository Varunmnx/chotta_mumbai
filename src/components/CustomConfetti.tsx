import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  decay: number;
  shape: 'circle' | 'square' | 'triangle';
}

interface CustomConfettiProps {
  isActive: boolean;
}

const CustomConfetti: React.FC<CustomConfettiProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  
  // Vibrant party colors
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF9F1C', '#6A0572', '#1A936F', '#11827', '#FBBF24'];

  const createParticle = useCallback((x: number, y: number) => {
    // Check if we're in a browser environment
    if (typeof window === undefined) {
      return null;
    }

    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 15, // Increased velocity spread
      vy: -(Math.random() * 12 + 3), // Increased upward velocity
      size: Math.random() * 15 + 8, // Larger particles
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15, // Faster rotation
      life: 1,
      decay: Math.random() * 0.008 + 0.002, // Slower decay for longer visibility
      shape: Math.random() > 0.3 ? 'circle' : Math.random() > 0.5 ? 'square' : 'triangle'
    } as Particle;
  }, [colors]);

  // Draw a triangle shape
  const drawTriangle = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath();
    ctx.moveTo(0, -size / 2);
    ctx.lineTo(-size / 2, size / 2);
    ctx.lineTo(size / 2, size / 2);
    ctx.closePath();
    ctx.fill();
  };

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if we're in a browser environment
    if (typeof window === undefined) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isActive) {
      // Add 3x more particles at multiple points across the screen
      if (particlesRef.current.length < 450) { // 3x increase (was 150)
        // Add particles at the bottom
        if (Math.random() > 0.3) { // More frequent particle generation
          const newParticle = createParticle(
            Math.random() * window.innerWidth,
            window.innerHeight
          );
          if (newParticle) particlesRef.current.push(newParticle);
        }
        
        // Add particles from the sides for more spread
        if (Math.random() > 0.7) {
          // Left side particles
          const leftParticle = createParticle(
            0,
            Math.random() * window.innerHeight
          );
          if (leftParticle) particlesRef.current.push(leftParticle);
          
          // Right side particles
          const rightParticle = createParticle(
            window.innerWidth,
            Math.random() * window.innerHeight
          );
          if (rightParticle) particlesRef.current.push(rightParticle);
        }
        
        // Add particles from the top occasionally
        if (Math.random() > 0.9) {
          const topParticle = createParticle(
            Math.random() * window.innerWidth,
            0
          );
          if (topParticle) particlesRef.current.push(topParticle);
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.97; // Slight air resistance
        particle.vy += 0.2; // Gravity
        particle.rotation += particle.rotationSpeed;
        particle.life -= particle.decay;

        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);

        ctx.fillStyle = particle.color;
        
        if (particle.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.shape === 'square') {
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        } else { // triangle
          drawTriangle(ctx, particle.size);
        }
        
        ctx.restore();

        // Particles are removed when life ends or they go off-screen
        return particle.life > 0 && 
               particle.y < window.innerHeight + 100 && 
               particle.y > -100 &&
               particle.x > -100 && 
               particle.x < window.innerWidth + 100;
      });
    } else {
      particlesRef.current = [];
    }

    animationRef.current = requestAnimationFrame(updateParticles);
  }, [isActive, createParticle]);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== undefined) {
      updateParticles();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateParticles]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === undefined) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
        zIndex: 10
      }}
    />
  );
};

export default CustomConfetti;