import React, { useEffect, useState } from "react";

const Meteors = () => {
  const [meteorStyles, setMeteorStyles] = useState([]);

  useEffect(() => {
    const styles = Array.from({ length: 30 }).map(() => ({
      top: `${Math.random() * window.innerHeight - 200}px`,
      left: `${Math.random() * window.innerWidth - 200}px`,
      animationDelay: `${Math.random() * 1 + 0.2}s`,
      animationDuration: `${Math.random() * 10 + 2}s`,
    }));
    setMeteorStyles(styles);
  }, []);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span key={idx} className="meteor-animation overflow-hidden" style={style}>
          <div className="meteor-tail" />
        </span>
      ))}
    </>
  );
};

export default Meteors;
