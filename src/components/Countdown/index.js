import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Button, Popup } from "semantic-ui-react";
import Swal from "sweetalert2";

import { timeConverter } from "../../utils";
import { setPauseCountDown } from "../../store/exam/examlSlice";

//

// const stopTime = () => {};

//

const Countdown = ({ countdownTime, timeOver, setTimeTaken, pause }) => {
  let { numberOfPausesLeft, examIsPaused } = useSelector((s) => s?.exam);

  const totalTime = countdownTime * 1000;
  const [timerTime, setTimerTime] = useState(totalTime);
  const { hours, minutes, seconds } = timeConverter(timerTime);

  useEffect(() => {
    const { hours: h, minutes: m, seconds: s } = timeConverter(timerTime);
    setPauseCountDown({ hours: h, minutes: m, seconds: s });
    if (+h == 0 && +m == 0 && +s == 0) {
      timeOver();
    }
  }, [timerTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!examIsPaused || pause) {
        const newTime = timerTime - 1000;
        if (newTime >= 0) {
          setTimerTime(newTime);
        } else {
          clearInterval(timer);
          if (!pause) {
            Swal.fire({
              icon: "info",
              title: `Oops! Time's up.`,
              text: "See how you did!",
              confirmButtonText: "Check Results",
              timer: 5000,
              willClose: () => timeOver(totalTime - timerTime),
            });
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (typeof setTimeTaken == `function`) {
        setTimeTaken(totalTime - timerTime + 1000);
      }
    };

    // eslint-disable-next-line
  }, [timerTime, examIsPaused]);

  return (
    <Button.Group size="massive" basic floated="right" className="  dir-ltr">
      <Popup content="Hours" trigger={<Button active>{hours}</Button>} position="bottom left" />
      <Popup content="Minutes" trigger={<Button active>{minutes}</Button>} position="bottom left" />
      <Popup content="Seconds" trigger={<Button active>{seconds}</Button>} position="bottom left" />
    </Button.Group>
  );
};

// Countdown.propTypes = {
//   countdownTime: PropTypes.number.isRequired,
//   timeOver: PropTypes.func.isRequired,
//   setTimeTaken: PropTypes.func.isRequired,
// };

export default Countdown;
