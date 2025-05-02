import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../css/flight.css";

const destinations = [
  { time: "19:35", airline: "xplore", city: "Warsaw", gate: "Gate 5" },
  { time: "21:50", airline: "xplore", city: "London", gate: "Gate 2" },
  { time: "22:40", airline: "xplore", city: "Tokyo", gate: "Gate 1" },
  { time: "13:25", airline: "xplore", city: "Paris", gate: "Gate 3" },
  { time: "11:20", airline: "xplore", city: "Berlin", gate: "Gate 7" },
  { time: "08:15", airline: "xplore", city: "Madrid", gate: "Gate 4" },
  { time: "15:40", airline: "xplore", city: "Rome", gate: "Gate 6" }
];

const FlightBoard = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  const autoScroll = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % destinations.length);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    intervalRef.current = setInterval(autoScroll, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flight-container">
      <AnimatePresence initial={false}>
        {[-2, -1, 0, 1, 2].map((offset) => {
          const index = (currentIndex + offset + destinations.length) % destinations.length;
          const dest = destinations[index];

          const isMovingFromTopToBottom = isTransitioning && offset === -2 && (currentIndex - 1 + destinations.length) % destinations.length === index;
          const isMovingFromBottomToTop = isTransitioning && offset === 2 && (currentIndex + 1) % destinations.length === index;
          const shouldRender = (!isMovingFromTopToBottom && !isMovingFromBottomToTop) || !isTransitioning;

          return shouldRender ? (
            <motion.div key={dest.city + "-" + index} className="flight-item" initial={{
                opacity: (offset === -2 || offset === 2) && isTransitioning ? 0 : (offset === 0 ? 1 : 0.5), y: offset * 20 }}
              animate={{ opacity: offset === 0 ? 1 : 0.5, y: offset * 80, scale: offset === 0 ? 1 : 0.9, filter: offset === 0 ? "blur(0)" : "blur(2px)" }}
              exit={{ opacity: 0, y: offset * 20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="flight-card">{dest.time}</div>
              <div className="flight-card">{dest.airline}</div>
              <div className="flight-card flight-card-city">{dest.city}</div>
              <div className="flight-card">{dest.gate}</div>
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
};

export default FlightBoard;