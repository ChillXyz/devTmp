import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    const handleScroll = () => {
      // Background parallax effect with easing
      const background = document.querySelector('.background-image') as HTMLElement;
      if (background) {
        const scrolled = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const maxScroll = docHeight - windowHeight;
        const scrollProgress = Math.min(1, scrolled / maxScroll);
        
        // Custom easing function for smoother animation
        const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
        const easedProgress = easeOutQuart(scrollProgress);
        
        // Apply parallax effect with easing
        const scale = 1 + (easedProgress * 0.1); // 10% max scale
        const yOffset = -(scrolled * 0.15); // 15% of scroll distance
        const opacity = Math.max(0.3, 1 - (easedProgress * 0.7));
        
        background.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale})`;
        background.style.opacity = opacity.toString();
      }

      // Project items animation with intersection observer
      const projectItems = document.querySelectorAll('.project-item');
      projectItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;
        const distanceFromCenter = Math.abs(elementCenter - windowCenter);
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        item.setAttribute('data-visible', isVisible.toString());
        
        if (isVisible) {
          const scale = 1 - (distanceFromCenter / (window.innerHeight * 0.8)) * 0.1;
          (item as HTMLElement).style.transform = `scale(${Math.max(0.9, scale)})`;
        }
      });
    };

    // Initial check
    handleScroll();

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add scroll listener with RAF for performance
    let rafId: number;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
};

export default useScrollAnimation;
