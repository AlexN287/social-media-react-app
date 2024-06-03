import { useEffect, useState } from 'react';

const useSwipe = (onSwipeLeft, onSwipeRight) => {
  const [touchStartX, setTouchStartX] = useState(0);

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      setTouchStartX(touch.clientX);
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const touchEndX = touch.clientX;

      if (touchStartX - touchEndX > 100) {
        onSwipeLeft(); // Swipe left
      } else if (touchEndX - touchStartX > 100) {
        onSwipeRight(); // Swipe right
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [touchStartX, onSwipeLeft, onSwipeRight]);

  return {};
};

export default useSwipe;
