import React, { useEffect, useState } from 'react';
import './Counter.css';

function KeyPressCounter() {
  const defaultCounters = {
    ArrowLeft: { count: 0, img: '/good.png', emoji: '😊', text: "Good", thankYou: "We're happy you enjoyed your experience" },
    ArrowUp: { count: 0, img: '/fine.png', emoji: '😐', text: "Okay", thankYou: "We hope you enjoyed your experience" },
    ArrowRight: { count: 0, img: '/poor.png', emoji: '😞', text: "Poor", thankYou: "We're sorry you didn't enjoy your experience" },
    ArrowDown: { count: 0, img: '', emoji: '', text: "" },
    ' ': { count: 0, img: '', emoji: '', text: "" },
  };

  const [isLocked, setIsLocked] = useState(false);
  const [flicker, setFlicker] = useState('');
  const [thankYou, setThankYou] = useState('');
  const [reset, setResetScreen] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [counters, setCounters] = useState(
    JSON.parse(localStorage.getItem('counters')) || defaultCounters,
  );

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        setShowResults(false);
        setResetScreen('');
        setIsLocked(false);
      }
      if (event.key === 'ArrowDown') {
        if (showResults) return;
        setShowResults(true);
        setIsLocked(true);
        setTimeout(() => {
          setShowResults(false)
          setIsLocked(false);
        }, 3000);
      }

      if(event.key === ' ') {
        // Store pre-reset counters with current date and time
        const dateTime = new Date().toLocaleString().replaceAll('/', '-').replaceAll(',', '').replaceAll(':', '.');
        localStorage.setItem(`${dateTime} Counters`, JSON.stringify(counters));
  
        // Reset counters
        setCounters(defaultCounters);
        localStorage.setItem('counters', JSON.stringify(defaultCounters));
        setResetScreen(`${dateTime} Counters`);
        setIsLocked(true);
        setTimeout(() => {
          setResetScreen('');
          setIsLocked(false);
        }, 3000);
        return;
      }
  

      // still exit early if it's locked and the key isn't ArrowDown or Space
      if (isLocked && event.key !== 'ArrowDown' && event.key !== ' ') return;
  
      if (Object.keys(counters).includes(event.key)) {
        // Only Lock on key press if key is not ArrowDown or Space
        if (event.key !== 'ArrowDown' && event.key !== ' ') setIsLocked(true);
        
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
          if (event.key !== ' ' && event.key !== 'ArrowDown') {
            setFlicker(event.key);
            setTimeout(() => {
              setFlicker('');
              setTimeout(() => setThankYou(event.key), 100);
              setTimeout(() => {
                setThankYou('');
                setIsLocked(false); // Unlock after thank you screen is cleared
              }, 1500);
            }, 100);
          }
          return newCounters;
        });
      }
    };
    

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [counters, isLocked]);


  return (
    <div className="container">
      {
        thankYou !== '' ? (
          <div className="thank-you">
            <h2 className="header" style={{marginTop: 0}}>Thank you for providing your feedback!</h2>
            <h4 className="sub">
              {counters[thankYou].thankYou}
            </h4>
          </div>
        ) : 
        reset !== '' ? (
          <div className="reset">
            <h2 className="header" style={{marginTop: 0}}>Votes Reset!</h2>
            <h4 className="sub">
              Previous votes are stored at <i>{reset}</i>
            </h4>
          </div>
        ) :
        (
          <div className="rate">
          <h2 className="header">Rate Us!</h2>
      <h4 className="sub">Tell us your experience</h4>
      <div className="main">
      {Object.entries(counters).map(([key, value]) =>
  key !== " " && key !== "ArrowDown" ? (
    <div key={key} className="face-wrap">
      <img
        src={value.img}
        alt=""
        style={{
          opacity: flicker === key ? "0" : "1",
          transition: "opacity .1s",
        }}
        className="face"
      />{" "}
      <span className="face-text">{value.text}</span>
      {/* {showResults && ( */}
        <span className="face-count" style={{ opacity: showResults ? 1 : 0 }}>Total: <b>{value.count}</b> ({(counters.ArrowUp.count + counters.ArrowLeft.count + counters.ArrowRight.count) === 0 ? 0 : Math.round((value.count / (counters.ArrowUp.count + counters.ArrowLeft.count + counters.ArrowRight.count)) * 100)}%)</span>
      {/* )} */}
      {/* {value.emoji} Pressed: {value.count} */}
    </div>
  ) : null
)}
      </div>
      </div>
        )
      }
      
    </div>
  );
}

export default KeyPressCounter;