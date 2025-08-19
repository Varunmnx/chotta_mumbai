'use client';

import React, { useState, useEffect, useRef } from 'react';
import CustomConfetti from '../components/CustomConfetti';
import Button from '../components/Button';
import styles from './flashyMusicApp.module.css';

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Chotta Mumbai Vibe",
  "applicationCategory": "EntertainmentApplication",
  "operatingSystem": "Any",
  "description": "An interactive music experience that brings the vibrant energy of Mumbai to life",
  "url": "https://vibe.varunnarayananwrites.site",
  "creator": {
    "@type": "Person",
    "name": "Varun Narayanan",
    "url": "https://www.varunnarayananwrites.site",
    "sameAs": [
      "https://twitter.com/Varun_Narayana1"
    ]
  }
};

const FlashyMusicApp = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ffffff'); // White background initially
  const [gifPosition, setGifPosition] = useState({ x: 50, y: 50 }); // percentage positions
  const [secondGifPosition, setSecondGifPosition] = useState({ x: 70, y: 50 }); // second GIF position (start on right)
  const [isDragging, setIsDragging] = useState(false);
  const [isSecondGifDragging, setIsSecondGifDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showStartButton, setShowStartButton] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showSecondGif, setShowSecondGif] = useState(false); // State for showing second GIF
  const audioRef = useRef<HTMLAudioElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number>(0);
  const mouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null);
  const touchMoveRef = useRef<((e: TouchEvent) => void) | null>(null);

  // Using pink (#ec4899) as the primary highlighted color
  const colors = ['#ec4899', '#fbbf24', '#f8e1f4']; // pure pink, yellow, light pink
  
  // Handle start button click
  const handleStartClick = async () => {
    setIsRunning(true);
    setShowStartButton(false);
    setTimeElapsed(0);
    setShowSecondGif(false); // Reset second GIF
    // Reset positions to center
    setGifPosition({ x: 50, y: 50 });
    setSecondGifPosition({ x: 70, y: 50 }); // Will appear to the right when shown
    if (window?.innerWidth < 600) {
      setSecondGifPosition({ x: 90, y: 50 }); 
    }
    startTimeRef.current = Date.now();
    
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

  // Track time elapsed and change colors after 6 seconds
  useEffect(() => {
    if (!isRunning) return;

    const updateTimer = () => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeElapsed(elapsed);
        
        // Change colors only after 6 seconds
        if (elapsed >= 6) {
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          setCurrentColor(randomColor);
        } else {
          setCurrentColor('#ffffff'); // White background initially
        }
        
        // Show second GIF after 7 seconds
        if (elapsed >= 7) {
          setShowSecondGif(true);
        }
      }
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    animationFrameRef.current = requestAnimationFrame(updateTimer);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  // Handle gif dragging for first GIF (mouse events)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isRunning) return;
    
    setIsDragging(true);
    setIsSecondGifDragging(false); // Ensure only one is dragging
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate offset to position the GIF center at the mouse point
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });
    
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle gif dragging for second GIF (mouse events)
  const handleSecondGifMouseDown = (e: React.MouseEvent) => {
    if (!isRunning) return;
    
    setIsSecondGifDragging(true);
    setIsDragging(false); // Ensure only one is dragging
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate offset to position the GIF center at the mouse point
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });
    
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle gif dragging for first GIF (touch events)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isRunning) return;
    
    setIsDragging(true);
    setIsSecondGifDragging(false); // Ensure only one is dragging
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate offset to position the GIF center at the touch point
    // This reduces the distance between touch point and GIF during drag
    setDragOffset({
      x: e.touches[0].clientX - rect.left - rect.width / 2,
      y: e.touches[0].clientY - rect.top - rect.height / 2
    });
    
    // Prevent default behavior to stop scrolling and other touch actions
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle gif dragging for second GIF (touch events)
  const handleSecondGifTouchStart = (e: React.TouchEvent) => {
    if (!isRunning) return;
    
    setIsSecondGifDragging(true);
    setIsDragging(false); // Ensure only one is dragging
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate offset to position the GIF center at the touch point
    // This reduces the distance between touch point and GIF during drag
    setDragOffset({
      x: e.touches[0].clientX - rect.left - rect.width / 2,
      y: e.touches[0].clientY - rect.top - rect.height / 2
    });
    
    // Prevent default behavior to stop scrolling and other touch actions
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isRunning) return;
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    const newX = ((e.clientX - dragOffset.x) / window.innerWidth) * 100;
    const newY = ((e.clientY - dragOffset.y) / window.innerHeight) * 100;
    
    if (isDragging) {
      setGifPosition({
        x: Math.max(0, Math.min(90, newX)), // Keep within bounds
        y: Math.max(0, Math.min(90, newY))
      });
    } else if (isSecondGifDragging) {
      setSecondGifPosition({
        x: Math.max(0, Math.min(90, newX)), // Keep within bounds
        y: Math.max(0, Math.min(90, newY))
      });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isRunning) return;
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    const newX = ((e.touches[0].clientX - dragOffset.x) / window.innerWidth) * 100;
    const newY = ((e.touches[0].clientY - dragOffset.y) / window.innerHeight) * 100;
    
    if (isDragging) {
      setGifPosition({
        x: Math.max(0, Math.min(90, newX)), // Keep within bounds
        y: Math.max(0, Math.min(90, newY))
      });
    } else if (isSecondGifDragging) {
      setSecondGifPosition({
        x: Math.max(0, Math.min(90, newX)), // Keep within bounds
        y: Math.max(0, Math.min(90, newY))
      });
    }
    
    // Prevent scrolling while dragging
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsSecondGifDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsSecondGifDragging(false);
  };

  useEffect(() => {
    if (isDragging || isSecondGifDragging) {
      // Throttle mouse move events for smoother dragging
      let ticking = false;
      
      const throttledMouseMove = (e: MouseEvent) => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleMouseMove(e);
            ticking = false;
          });
          ticking = true;
        }
      };
      
      const throttledTouchMove = (e: TouchEvent) => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleTouchMove(e);
            ticking = false;
          });
          ticking = true;
        }
      };
      
      document.addEventListener('mousemove', throttledMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', throttledTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      // Store references for cleanup
      mouseMoveRef.current = throttledMouseMove;
      touchMoveRef.current = throttledTouchMove;
    }
    
    return () => {
      if (mouseMoveRef.current) {
        document.removeEventListener('mousemove', mouseMoveRef.current);
      }
      if (touchMoveRef.current) {
        document.removeEventListener('touchmove', touchMoveRef.current);
      }
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isSecondGifDragging]);

  // Handle audio end event
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleAudioEnd = () => {
      setIsRunning(false);
      setShowStartButton(true);
      setCurrentColor('#ffffff');
    };

    audioElement.addEventListener('ended', handleAudioEnd);
    
    return () => {
      audioElement.removeEventListener('ended', handleAudioEnd);
    };
  }, []);

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
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Custom confetti effect */}
      <CustomConfetti isActive={isRunning} />

      {/* Start Button - shows initially and after song ends */}
      {(showStartButton || !isRunning) && (
        <Button
          className={styles.startButton}
          onClick={handleStartClick}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/doge.png" alt="Doge" style={{ width: '30px', height: '30px' }} />
            <span>START</span>
          </div>
        </Button>
      )}

      {/* Movable GIF - show doge-flip for first 7 seconds (centered initially) */}
      {isRunning && (
        <div 
          className={`${styles.gifContainer} ${isDragging ? styles.gifContainerDragging : ''}`}
          style={{
            left: `${gifPosition.x}%`,
            top: `${gifPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <img 
            src="/doge-flip.gif" 
            alt="Doge Flip"
            className={styles.gif}
            draggable={false}
          />
        </div>
      )}

      {/* Second GIF - show lalettan after 7 seconds (to the right of first GIF) */}
      {isRunning && showSecondGif && (
        <div 
          className={`${styles.gifContainer} ${isSecondGifDragging ? styles.gifContainerDragging : ''}`}
          style={{
            left: `${secondGifPosition.x}%`,
            top: `${secondGifPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onMouseDown={handleSecondGifMouseDown}
          onTouchStart={handleSecondGifTouchStart}
        >
          <img 
            src="/lalettan.gif" 
            alt="Dancing Lalettan"
            className={styles.largerGif}
            draggable={false}
          />
        </div>
      )}

      {/* Audio element for playing music from public folder */}
      <audio 
        ref={audioRef} 
        className={styles.hiddenAudio}
      >
        <source src="/chettikulangara.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default FlashyMusicApp;