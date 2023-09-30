import React, { useState, useEffect } from 'react';

function KeyPressCounter() {
  const [counters, setCounters] = useState({ arrow: 0, space: 0 });

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if the key is an arrow key or the space bar
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        setCounters(prevCounters => ({
        ...prevCounters,
        [e.key === ' ' ? 'space' : 'arrow']: prevCounters[e.key === ' ' ? 'space' : 'arrow'] + 1
        }))
      }
    }

    window.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div>
      <h2>Key Press Counter</h2>
      <p>Arrow keys pressed: {counters.arrow}</p>
      <p>Space bar pressed: {counters.space}</p>
    </div>
  );
}

export default KeyPressCounter;