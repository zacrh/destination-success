import React, { useEffect, useState } from 'react';
import './Counter.css';

function KeyPressCounter() {
  const defaultCounters = {
    ArrowLeft: { count: 0, img: '/good.png', emoji: '😊' },
    ArrowUp: { count: 0, img: '/fine.png', emoji: '😐' },
    ArrowRight: { count: 0, img: '/poor.png', emoji: '😞' },
    ' ': { count: 0, img: '', emoji: '' },
  };

  const [flicker, setFlicker] = useState('');
  const [counters, setCounters] = useState(
    JSON.parse(localStorage.getItem('counters')) || defaultCounters,
  );

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (Object.keys(counters).includes(event.key)) {
        setCounters((prevCounters) => {
          let newCounters = {
            ...prevCounters,
            [event.key]: {
              ...prevCounters[event.key],
              count: prevCounters[event.key].count + 1,
            },
          };
          localStorage.setItem('counters', JSON.stringify(newCounters));

          // Display flicker effect
          if (event.key !== ' ') {
            setFlicker(event.key);
            setTimeout(() => setFlicker(''), 1000);
          }
          return newCounters;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener when the component is destroyed
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [counters]);

  return (
    <div className="container">
      <h2 className="header">Rate Us!</h2>
      <h4 className="sub">Tell us your experience</h4>
      <div className="main">
      {Object.entries(counters).map(([key, value]) =>
  key !== " " ? (
    <div key={key}>
      <img
        src={value.img}
        alt=""
        style={{
          opacity: flicker === key ? "0.5" : "1",
          transition: "opacity 1s",
        }}
        className="face"
      />{" "}
      {/* {value.emoji} Pressed: {value.count} */}
    </div>
  ) : null
)}
      </div>
    </div>
  );
}

export default KeyPressCounter;