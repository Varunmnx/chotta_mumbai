'use client';

import React, { useState, useEffect, useRef } from 'react';
import ParticleSystem from '../components/ParticleSystem';
import styles from './flashyMusicApp.module.css';

const FlashyMusicApp = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [gifPosition, setGifPosition] = useState({ x: 50, y: 50 }); // percentage positions
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Using pink (#ec4899) as the primary highlighted color
  const colors = ['#ec4899', '#fbbf24', '#ffffff']; // pure pink, yellow, white
  const confettiColors = ['#ec4899', '#fbbf24', '#ffffff', '#f97316', '#8b5cf6', '#ec4899'];
  
  // Handle start button click
  const handleStartClick = async () => {
    setIsRunning(true);
    
    // Play music from public folder
    try {
      if (audioRef.current) {
        audioRef.current.volume = 0.7;
        await audioRef.current.play();
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  };

  // Flash colors effect - much faster and pure colors
  useEffect(() => {
    let colorInterval: NodeJS.Timeout;
    if (isRunning) {
      colorInterval = setInterval(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setCurrentColor(randomColor);
      }, 80); // Very fast flashing
    } else {
      setCurrentColor('#ffffff');
    }

    return () => {
      if (colorInterval) clearInterval(colorInterval);
    };
  }, [isRunning]);

  // Handle gif dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isRunning) return;
    
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isRunning) return;
    
    const newX = ((e.clientX - dragOffset.x) / window.innerWidth) * 100;
    const newY = ((e.clientY - dragOffset.y) / window.innerHeight) * 100;
    
    setGifPosition({
      x: Math.max(0, Math.min(90, newX)), // Keep within bounds
      y: Math.max(0, Math.min(90, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Update body styles when running
  useEffect(() => {
    if (isRunning) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isRunning]);

  return (
    <div 
      className={`${styles.container} ${isDragging ? styles.containerDragging : ''}`}
      style={{ backgroundColor: currentColor }}
    >
      {/* Particle System for Confetti - more particles */}
      <ParticleSystem isActive={isRunning} colors={confettiColors} />

      {/* Start Button - only shows initially */}
      {!isRunning && (
        <button
          className={styles.startButton}
          onClick={handleStartClick}
        >
          🎉 START
        </button>
      )}

      {/* Movable GIF */}
      {isRunning && (
        <div 
          className={`${styles.gifContainer} ${isDragging ? styles.gifContainerDragging : ''}`}
          style={{
            left: `${gifPosition.x}%`,
            top: `${gifPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onMouseDown={handleMouseDown}
        >
          <img 
            src="/lalettan.gif" 
            alt="Dancing Lalettan"
            className={styles.gif}
            draggable={false}
          />
        </div>
      )}

      {/* Audio element for playing music from public folder */}
      <audio 
        ref={audioRef} 
        className={styles.hiddenAudio}
        loop
      >
        <source src="/chettikulangara.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default FlashyMusicApp;