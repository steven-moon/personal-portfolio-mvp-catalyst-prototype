
// Page transition animation
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

// Staggered animation for list items
export const staggerContainer = (staggerChildren: number, delayChildren: number = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

// Fade up animation for individual items
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};
