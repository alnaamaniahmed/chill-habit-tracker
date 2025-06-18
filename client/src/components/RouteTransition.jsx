import React, { useEffect } from "react";
import { motion } from "framer-motion";

const transitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeInOut" },
  },

  slideUp: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  scale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const RouteTransition = ({ children, type = "slideUp", className = "" }) => {
  const transition = transitions[type] || transitions.slideUp;
  useEffect(() => {
    document.body.classList.add("page-transitioning");

    const timer = setTimeout(() => {
      document.body.classList.remove("page-transitioning");
    }, transition.transition.duration * 1000 + 100);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("page-transitioning");
    };
  }, [transition.transition.duration]);
  return (
    <motion.div
      className={`${className} min-h-screen`}
      initial={transition.initial}
      animate={transition.animate}
      exit={transition.exit}
      transition={transition.transition}
    >
      {children}
    </motion.div>
  );
};

export default RouteTransition;
