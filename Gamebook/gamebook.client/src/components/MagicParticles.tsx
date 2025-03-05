import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/ChoosingCharacter.module.css';

interface MagicParticlesProps {
  count?: number;
}

const MagicParticles: React.FC<MagicParticlesProps> = ({ count = 50 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detekce mobilního zařízení pro optimalizaci
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Kontrola při načtení
    checkMobile();
    
    // Kontrola při změně velikosti okna
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Snížení počtu částic na mobilních zařízeních
    const particleCount = isMobile ? Math.floor(count / 2) : count;
    
    const container = containerRef.current;
    const particles: HTMLElement[] = [];

    const colors = [
      'rgba(224, 200, 114, 0.8)', // zlatá
      'rgba(168, 192, 255, 0.8)', // světle modrá
      'rgba(123, 31, 162, 0.6)', // fialová
      'rgba(255, 255, 255, 0.8)', // bílá
      'rgba(116, 207, 249, 0.7)' // azurová
    ];

    // Funkce pro vytvoření nové částice
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add(styles.particle);
      
      // Náhodné vlastnosti částice - menší na mobilních zařízeních
      const size = isMobile 
        ? Math.random() * 4 + 1 
        : Math.random() * 6 + 2;
      
      const colorIdx = Math.floor(Math.random() * colors.length);
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = colors[colorIdx];
      particle.style.boxShadow = `0 0 ${size + 2}px ${colors[colorIdx]}`;
      
      // Náhodná počáteční pozice (dole na obrazovce)
      const startPositionX = Math.random() * 100;
      particle.style.left = `${startPositionX}%`;
      particle.style.bottom = '-10px';
      
      // Náhodná délka animace a zpoždění - rychlejší na mobilních zařízeních
      const animationDuration = isMobile
        ? Math.random() * 10 + 5
        : Math.random() * 15 + 10;
      
      const animationDelay = Math.random() * 5;
      
      particle.style.animationDuration = `${animationDuration}s`;
      particle.style.animationDelay = `${animationDelay}s`;
      
      container.appendChild(particle);
      particles.push(particle);
      
      // Odstranění částice po dokončení animace
      setTimeout(() => {
        if (particle.parentNode === container) {
          container.removeChild(particle);
          const index = particles.indexOf(particle);
          if (index > -1) {
            particles.splice(index, 1);
          }
        }
      }, (animationDuration + animationDelay) * 1000);
    };

    // Vytvoření počátečních částic
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => createParticle(), Math.random() * 2000);
    }

    // Přidání nových částic v čase - méně často na mobilních zařízeních
    const interval = setInterval(() => {
      if (particles.length < particleCount) {
        createParticle();
      }
    }, isMobile ? 3000 : 2000);

    // Přidání magických částic při kliknutí/dotyku
    const handleInteraction = (event: MouseEvent | TouchEvent) => {
      // Získání pozice
      let x, y;
      
      if ('touches' in event) {
        // TouchEvent
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
      } else {
        // MouseEvent
        x = event.clientX;
        y = event.clientY;
      }
      
      // Vytvoření částic v místě interakce - méně na mobilních zařízeních
      const burstCount = isMobile ? 5 : 10;
      
      for (let i = 0; i < burstCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add(styles.particle);
        
        const size = isMobile
          ? Math.random() * 5 + 2
          : Math.random() * 8 + 3;
          
        const colorIdx = Math.floor(Math.random() * colors.length);
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = colors[colorIdx];
        particle.style.boxShadow = `0 0 ${size + 4}px ${colors[colorIdx]}`;
        
        // Nastavení pozice na místo interakce
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Náhodný úhel exploze
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        
        particle.animate(
          [
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform, opacity: 0 }
          ],
          {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)',
            fill: 'forwards'
          }
        );
        
        container.appendChild(particle);
        
        // Odstranění částice po dokončení animace
        setTimeout(() => {
          if (particle.parentNode === container) {
            container.removeChild(particle);
          }
        }, 2000);
      }
    };

    // Přidání posluchače události pro různá zařízení
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      particles.forEach(particle => {
        if (particle.parentNode === container) {
          container.removeChild(particle);
        }
      });
    };
  }, [count, isMobile]);

  return <div ref={containerRef} className={styles.particlesContainer}></div>;
};

export default MagicParticles;