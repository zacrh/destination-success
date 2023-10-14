import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase";
import "./Counter.css";
import "./Questionnaire.css";

function Questionnaire() {
  

  const defaultCounters = {
    ArrowLeft: {
      count: 0,
      img: "/good.png",
      emoji: "😊",
      text: "Good",
      thankYou: "We're happy you enjoyed your experience",
    },
    ArrowUp: {
      count: 0,
      img: "/fine.png",
      emoji: "😐",
      text: "Okay",
      thankYou: "We hope you enjoyed your experience",
    },
    ArrowRight: {
      count: 0,
      img: "/poor.png",
      emoji: "😞",
      text: "Poor",
      thankYou: "We're sorry you didn't enjoy your experience",
    },
    ArrowDown: { count: 0, img: "", emoji: "", text: "" },
    " ": { count: 0, img: "", emoji: "", text: "" },
  };

  const questions = [
    `How was your experience at \n Destination Success?`,
    "Were you able to complete your \n passport activity?",
    "Did you discover a new CTE \n course at SBISD?",
    "How likely are you to sign up for a \n CTE course at SBISD?",
    "Did you enjoy the hands-on activities \n at each career table?"
  ];


  // const createAnswers = () => {

  //   console.log(hq);
  //   let expressions = {}

  //   if (hq === true) {
  //     expressions = {
  //       good: './good.png',
  //       okay: './fine.png',
  //       poor: './poor.png',
  //       yes: './good.png',
  //       no: './poor.png',
  //     }
  //   } else if (hq === false) {
  //     expressions = {
  //       good: './happy.png',
  //       okay: './meh.png',
  //       poor: './frown.png',
  //       yes: './yes.png',
  //       no: './no.png',
  //     }
  //   }
  //   console.log(expressions.good)

    
  // }
  const expressions = {}

  const [isLocked, setIsLocked] = useState(false);
  const [flicker, setFlicker] = useState("");
  const [thankYou, setThankYou] = useState("");
  const [reset, setResetScreen] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [intro, setIntro] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [votingSessionId, setVotingSessionId] = useState(null);
  
  const hq = false;

  const answerChoicesHQ = [
    {
      ArrowLeft: {
        count: 0,
        img: './good.png',
        emoji: "😊",
        text: "Good",
        thankYou: "We're happy you enjoyed your experience",
      },
      ArrowUp: {
        count: 0,
        img: './fine.png',
        emoji: "😐",
        text: "Okay",
        thankYou: "We hope you enjoyed your experience",
      },
      ArrowRight: {
        count: 0,
        img: './poor.png',
        emoji: "😞",
        text: "Poor",
        thankYou: "We're sorry you didn't enjoy your experience",
      },
    },
    {
      ArrowLeft: {
        count: 0,
        img: './good.png',
        emoji: "😊",
        text: "Yes",
        thankYou: "We're happy you enjoyed your experience",
      },
      ArrowRight: {
        count: 0,
        img: './poor.png',
        emoji: "😞",
        text: "No",
        thankYou: "We're sorry you didn't enjoy your experience",
      },
    },
    {
      ArrowLeft: {
        count: 0,
        img: './good.png',
        emoji: "😊",
        text: "Yes",
        thankYou: "We're happy you enjoyed your experience",
      },
      ArrowRight: {
        count: 0,
        img: './poor.png',
        emoji: "😞",
        text: "No",
        thankYou: "We're sorry you didn't enjoy your experience",
      },
    },
    {
      ArrowLeft: {
        count: 0,
        img: './good.png',
        emoji: "😊",
        text: "Very Likely",
        thankYou: "We're happy you enjoyed your experience",
      },
      ArrowUp: {
        count: 0,
        img: './fine.png',
        emoji: "😐",
        text: "Somewhat Likely",
        thankYou: "We hope you enjoyed your experience",
      },
      ArrowRight: {
        count: 0,
        img: './poor.png',
        emoji: "😞",
        text: "Not Likely",
        thankYou: "We're sorry you didn't enjoy your experience",
      },
    },
    {
      ArrowLeft: {
        count: 0,
        img: "/good.png",
        emoji: "😊",
        text: "Yes",
        thankYou: "We're happy you enjoyed your experience",
      },
      ArrowRight: {
        count: 0,
        img: "/poor.png",
        emoji: "😞",
        text: "No",
        thankYou: "We're sorry you didn't enjoy your experience",
      },
    }
  ]

  const answerChoices = [
    {
      ArrowLeft: {
        count: 0,
        img: './happy.png',
        emoji: "😊",
        text: "Good",
        thankYou: "We're happy you enjoyed your experience",
      },
      ArrowUp: {
        count: 0,
        img: './meh.png',
        emoji: "😐",
        text: "Okay",
        thankYou: "We hope you enjoyed your experience",
      },
      ArrowRight: {
        count: 0,
        img: './frown.png',
        emoji: "😞",
        text: "Poor",
        thankYou: "We're sorry you didn't enjoy your experience",
      },
    },
    {
      ArrowLeft: {
        count: 0,
        img: './yes.png',
        emoji: "😊",
        text: "Yes",
        thankYou: "We're happy you enjoyed your experience",
      },
      ArrowRight: {
        count: 0,
        img: './no.png',
        emoji: "😞",
        text: "No",
        thankYou: "We're sorry you didn't enjoy your experience",
      },
    },
    {
      ArrowLeft: {
        count: 0,
        img: './yes.png',
        emoji: "😊",
        text: "Yes",
        thankYou: "We're happy you enjoyed your experience",
      },
      ArrowRight: {
        count: 0,
        img: './no.png',
        emoji: "😞",
        text: "No",
        thankYou: "We're sorry you didn't enjoy your experience",
      },
    },
    {
      ArrowLeft: {
        count: 0,
        img: './happy.png',
        emoji: "😊",
        text: "Very Likely",
        thankYou: "We're happy you enjoyed your experience",
      },
      ArrowUp: {
        count: 0,
        img: './meh.png',
        emoji: "😐",
        text: "Somewhat Likely",
        thankYou: "We hope you enjoyed your experience",
      },
      ArrowRight: {
        count: 0,
        img: './frown.png',
        emoji: "😞",
        text: "Not Likely",
        thankYou: "We're sorry you didn't enjoy your experience",
      },
    },
    {
      ArrowLeft: {
        count: 0,
        img: "/yes.png",
        emoji: "😊",
        text: "Yes",
        thankYou: "We're happy you enjoyed your experience",
      },
      ArrowRight: {
        count: 0,
        img: "/no.png",
        emoji: "😞",
        text: "No",
        thankYou: "We're sorry you didn't enjoy your experience",
      },
    }
  ]


  const [counters, setCounters] = useState(
    JSON.parse(localStorage.getItem("counters")) ||
      (hq ? answerChoicesHQ : answerChoices)
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  console.log(counters);

  const startVotingSession = async () => {
    const { error: licenseError} = await supabase
    .from("voting_session")
    .insert({
      session_id: votingSessionId,
      voter: localStorage.getItem("licenseKey"),
      event: eventData?.id,
    })
    if (licenseError) {
      console.error(licenseError)
      return
    }
  }

  const submitVote = async (vote_info) => {
    const { error: voteError } = await supabase
    .from("votes")
    .insert({
      voting_session: vote_info.voting_session_id,
      rating: vote_info.rating,
      question: vote_info.question_id,
      question_text: vote_info.question_text,
      event: eventData?.id,
      rating_text: vote_info.rating_text,
      voter: localStorage.getItem("licenseKey"),
    })
    if (voteError) {
      console.error(voteError)
      return
    }
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (intro && Object.keys(counters[currentQuestion]).includes(event.key)) {
        setCurrentQuestion(0);
        setIntro(false);
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
        }, 100);
        const votingSessionId = uuidv4();
        setVotingSessionId(votingSessionId);
        startVotingSession();
        return;
      }
      if (event.key === "Escape") {
        setShowResults(false);
        setResetScreen("");
        // setThankYou('');
        setIsLocked(false);
      }

      if (event.key === "ArrowDown" && showResults) {
        setShowResults(false);
        setIsLocked(false);
      }

      // if is locked don't reset or show results
      if (isLocked) return;

      if (event.key === "ArrowDown") {
        if (showResults) return;
        setShowResults(true);
        setIsLocked(true);
        setTimeout(() => {
          setShowResults(false);
          setIsLocked(false);
        }, 3000);
      }

      if (event.key === " ") {
        // Store pre-reset counters with current date and time
        const dateTime = new Date()
          .toLocaleString()
          .replaceAll("/", "-")
          .replaceAll(",", "")
          .replaceAll(":", ".");
        localStorage.setItem(`${dateTime} Counters`, JSON.stringify(counters));

        // Reset counters
        setCounters(defaultCounters);
        localStorage.setItem("counters", JSON.stringify(defaultCounters));
        setResetScreen(`${dateTime} Counters`);
        setIsLocked(true);
        setTimeout(() => {
          setResetScreen("");
          setIsLocked(false);
        }, 3000);
        return;
      }

      // still exit early if it's locked and the key isn't ArrowDown or Space
      if (isLocked && event.key !== "ArrowDown" && event.key !== " ") return;

      if (Object.keys(counters[currentQuestion]).includes(event.key)) {
        // Only Lock on key press if key is not ArrowDown or Space
        if (event.key !== "ArrowDown" && event.key !== " ") setIsLocked(true);

        setCounters((prevCounters) => {
          let newCounters = [...prevCounters];
          newCounters[currentQuestion] = {
            ...prevCounters[currentQuestion],
            [event.key]: {
              ...prevCounters[currentQuestion][event.key],
              count: prevCounters[currentQuestion][event.key].count + 1,
            },
          };



          const rating_text = prevCounters[currentQuestion][event.key].text.toLowerCase();
          const rating = rating_text === "good" ? 1 : rating_text === "okay" ? 2 : 3;
          const voting_session_id = votingSessionId;
          const question_text = questions[currentQuestion];
          const question_id = currentQuestion + 1;
          const vote_info = {
            rating: rating,
            voting_session_id: voting_session_id,
            question_text: question_text,
            question_id: question_id,
            rating_text: rating_text,
          };
          console.log(vote_info)
          if (vote_info) {
            submitVote(vote_info);
          }


          localStorage.setItem("counters", JSON.stringify(newCounters));

          // Display flicker effect
          if (event.key !== " " && event.key !== "ArrowDown") {
            setFlicker(event.key);
            setTimeout(() => {
              setFlicker("");
              if (currentQuestion === questions.length - 1) {
                // last question, show thank you screen
                setTimeout(() => {
                  setThankYou(event.key)
                }, 100);
                setTimeout(() => {
                  setThankYou("");
                  setIsLocked(false); // Unlock after thank you screen is cleared
                  setCurrentQuestion(0);
                  setVotingSessionId(null);
                  setIntro(true);
                }, 3000);
              } else {
                // next question
                setTimeout(() => {
                  setCurrentQuestion(currentQuestion + 1);
                  setIsLocked(false);
                }, 100);
              }
            }, 100);
          }
          return newCounters;
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [counters, isLocked]);

  useEffect(() => {
    if (!localStorage.getItem("licenseKey")) return;
    const licenseKey = localStorage.getItem("licenseKey");
    const deviceId = localStorage.getItem("deviceId");

    const fetchEvent = async () => {
      const { data, error: licenseError } = await supabase
      .from("licenses")
      .select(`
        event_id (
          id,
          name,
          date,
          location
        )
        `)
      .eq("license_key", licenseKey)
      .single()
      if (licenseError) {
        console.error(licenseError)
        return
      }
      if (!data) {
        console.error("No data returned")
        return
      }
      console.log(data.event_id);
      setEventData(data.event_id);
    }

    fetchEvent();
      // .catch(console.error);

  }, [])

  return (
    <div className={`container ${thankYou ? 'thank-you' : 'question'}`}>
      {thankYou !== "" ? (
        <div className="thank-you">
          <h2 className="header" style={{ marginTop: 0 }}>
            Thank you for providing your feedback!
          </h2>
          <h4 className="sub">
            {/* {counters[currentQuestion][thankYou].thankYou} */}
            We hope you enjoyed your experience
          </h4>
        </div>
      ) : intro ? (
        <div className="thank-you">
          <div className="main">
            <div className="face-wrap">
              <img
                src={hq ? './good.png' : './happy.png'}
                alt=""
                style={{
                  opacity: flicker === "ArrowLeft" ? "0" : "1",
                  transition: "opacity .1s",
                }}
                className="face intro-face"
              />{" "}
            </div>
          </div>
          <h2 className="header" style={{ marginTop: 0 }}>
            Tell Us About Your Experience
          </h2>
          <h4 className="sub">
            Press any button to get started! 
          </h4>
          
        </div>
      ) : reset !== "" ? (
        <div className="reset">
          <h2 className="header" style={{ marginTop: 0 }}>
            Votes Reset!
          </h2>
          <h4 className="sub">
            Previous votes are stored at <i>{reset}</i>
          </h4>
        </div>
      ) : (
        <div className="rate">
          {/* <h2 className="header">Rate Us!</h2> */}
          <h2 className="header question-header">{questions[currentQuestion]}</h2>
          <h4 className="sub question-sub">Question {currentQuestion + 1} of {questions.length}</h4>
          <div className="main">
            {Object.entries(counters[currentQuestion]).map(([key, value]) =>
              key !== " " && key !== "ArrowDown" ? (
                <div key={key} className="face-wrap">
                  <img
                    src={value.img}
                    alt=""
                    style={{
                      opacity: flicker === key ? "0" : "1",
                      transition: "opacity .1s",
                    }}
                    className={`face ${!hq ? 'not-hq' : ''}`}
                  />{" "}
                  <span className="face-text">{value.text}</span>
                  {/* {showResults && ( */}
                  <span
                    className="face-count"
                    style={{ opacity: showResults ? 1 : 0 }}
                  >
                    Total: <b>{value.count}</b> (
                    {counters[currentQuestion].ArrowUp?.count +
                      counters[currentQuestion].ArrowLeft?.count +
                      counters[currentQuestion].ArrowRight?.count ===
                    0
                      ? 0
                      : Math.round(
                          (value.count /
                            (counters[currentQuestion].ArrowUp?.count +
                              counters[currentQuestion].ArrowLeft?.count +
                              counters[currentQuestion].ArrowRight?.count)) *
                            100
                        )}
                    %)
                  </span>
                  {/* )} */}
                  {/* {value.emoji} Pressed: {value.count} */}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
      <span className="event-info">{!eventData ? '' : `${eventData.name} 📍 ${eventData.location}`}</span>
    </div>
  );
}

export default Questionnaire;
