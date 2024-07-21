import React, { useState, useLayoutEffect, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";
import Countdown from "../Countdown";
import { setExamIsPaused } from "../../store/exam/examlSlice";

function PauseModal({ className }) {
  const { i18n, t } = useTranslation();

  const { pauseTime, examIsPaused, pauseCountDown } = useSelector((s) => s.exam);

  const [vis, setVisible] = useState();

  useEffect(() => {
    if (examIsPaused) {
      setVisible(examIsPaused);
    }
  }, [examIsPaused, pauseCountDown]);


  let pauseValue = +pauseTime?.value * 60;

  const timeOver = () => {
    setVisible(false);
  };

  const dispatch = useDispatch();
  return (
    <div className={"card flex justify-content-center mx-auto  " + className}>
      <Dialog
        maximizable={true}
        header={t("Pause timer")}
        visible={vis}
        onHide={() => {
          dispatch(setExamIsPaused(false));
          setVisible(false);
        }}
        className="  w-full md:w-3/5 instructionModalWidth "
      >
        <div className="flex justify-center items-center">
          <Countdown timeOver={timeOver} pause={true} countdownTime={pauseValue} />
        </div>
      </Dialog>
    </div>
  );
}

export default PauseModal;
