// ScrollFloat.js - Componente para animaciones de scroll
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registramos el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  className = '',
}) => {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Seleccionamos los elementos hijos directos para la animación
    const elements = containerRef.current.children;
    
    // Configuramos la animación con GSAP y ScrollTrigger
    gsap.fromTo(
      elements,
      { 
        y: 30, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: animationDuration,
        ease: ease,
        stagger: stagger,
        scrollTrigger: {
          trigger: containerRef.current,
          start: scrollStart,
          end: scrollEnd,
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Limpieza al desmontar el componente
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollFloat; 