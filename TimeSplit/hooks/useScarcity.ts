import { useState, useEffect } from 'react';

const STORAGE_KEY = 'timeSplit_scarcity';
const START_PERCENTAGE = 87;
const MAX_PERCENTAGE = 98.5;

export const useScarcity = () => {
  // Initialize from storage or default to 87%
  const [percentage, setPercentage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseFloat(saved) : START_PERCENTAGE;
    }
    return START_PERCENTAGE;
  });

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runLoop = () => {
      // Random delay between 15s (15000ms) and 45s (45000ms) to simulate organic sales
      const delay = Math.floor(Math.random() * (45000 - 15000 + 1)) + 15000;

      timeoutId = setTimeout(() => {
        setPercentage((prev) => {
          if (prev >= MAX_PERCENTAGE) return prev;

          // Random increment between 0.5% and 1.5%
          const increment = Math.random() * 1.0 + 0.5;
          const next = Math.min(prev + increment, MAX_PERCENTAGE);
          
          // Persist to keep consistency across refreshes
          localStorage.setItem(STORAGE_KEY, next.toFixed(2));
          
          // Trigger visual flash/pulse
          setIsUpdating(true);
          setTimeout(() => setIsUpdating(false), 1500);

          return next;
        });
        
        runLoop(); // Schedule next tick
      }, delay);
    };

    runLoop();

    return () => clearTimeout(timeoutId);
  }, []);

  return { percentage, isUpdating };
};