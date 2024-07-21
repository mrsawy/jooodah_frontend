import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Layout from "../Layout";
import Loader from "../Loader";
import Main from "../Main";
import Quiz from "../Quiz";
import Result from "../Result";
import Spinner from "../Spinner";
import ReCAPTCHA from "react-google-recaptcha";

import { getExamData } from "../../store/exam/examlSlice";
import {
  createUser,
  setCapatcha,
  setResultData as setResultDataRedux,
  setIsCaptchaExpired,
} from "./../../store/user/userSlice";

// import { setCapatcha, setIsCaptchaExpired } from "./../../store/user/userSlice";

const App = () => {
  const dispatch = useDispatch();
  let { isCaptchaExpired } = useSelector((s) => s?.users);

  function onReCAPTCHAChange(value) {
    // setCaptchaIsChanged(!!value);
    if (value) {
      dispatch(setIsCaptchaExpired(false));
      dispatch(setCapatcha(value));
    }
    return value;
  }
  // }

  const { i18n, t } = useTranslation();
  const currentLang = i18n?.language;

  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
    
    document.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
    document.addEventListener("selectstart", function (event) {
      event.preventDefault();
    });
  }, [i18n.language]);

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [data, setData] = useState(null);
  const [countdownTime, setCountdownTime] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isQuite, setIsQuite] = useState(null);

  const onQuite = () => {
    setIsQuite(true);
  };
  const { currentLevel, isLoading: examDataIsLoading } = useSelector((s) => s?.exam);
  const { user, capatcha } = useSelector((s) => s?.users);

  useEffect(() => {
    dispatch(getExamData());
  }, []);
  useEffect(() => {
    if (isQuizStarted) {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // For Chrome
        return ""; // For other browsers
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [isQuizStarted]);
  const startQuiz = (data, countdownTime) => {
    setLoadingMessage({
      title: t("Loading your quiz..."),
      message: t("It won't be long!"),
    });
    setCountdownTime(countdownTime);
    setData(data);
    setIsQuizStarted(true);
  };

  const endQuiz = async (resultData, options) => {
    if (
      resultData?.questionsAndAnswers?.length !== resultData?.totalQuestions &&
      !options?.timeOver &&
      !options?.quite
    ) {
      Swal.fire({
        icon: "error",
        title: `${t(`Error`)}!`,
        text: t("Please Answer All Questions."),
      });
      return;
    }

    let editedCaptcha = capatcha;
    let newCapatcha;
    if (isCaptchaExpired) {
      let result = await withReactContent(Swal).fire({
        text: `${t(`Your Token Expired`)}!`,
        title: (
          <div className="text-center w-full flex justify-center items-center">
            <ReCAPTCHA
              sitekey="6LcRtKQpAAAAAA2gfaEUKIn6AQoj-GPVQk4wgNyH"
              onChange={(a) => {
                newCapatcha = onReCAPTCHAChange(a);
                editedCaptcha = newCapatcha;
              }}
            />
          </div>
        ),
      });
      if (!options?.timeOver) {
        return; //close
      }
      if (options?.timeOver && result?.isConfirmed) {
        if (isCaptchaExpired && !newCapatcha) {
          endQuiz(resultData, options);
          return;
        }

        dispatch(setResultDataRedux({ level: currentLevel, ...resultData }));
        dispatch(createUser({ level: currentLevel, ...resultData, user, capatcha: editedCaptcha }));
        setLoading(true);
        setLoadingMessage({
          title: t("Fetching your results..."),
          message: t("Just a moment!"),
        });
        setTimeout(() => {
          setIsQuizStarted(false);
          setIsQuizCompleted(true);
          setResultData(resultData);
          setLoading(false);
        }, 2000);
        return;
      }

      if (options.timeOver && !result?.isConfirmed) {
        endQuiz(resultData, options);
        return;
      }
    }

    dispatch(setResultDataRedux({ level: currentLevel, ...resultData }));
    dispatch(createUser({ level: currentLevel, ...resultData, user, capatcha: editedCaptcha }));
    setLoading(true);
    setLoadingMessage({
      title: t("Fetching your results..."),
      message: t("Just a moment!"),
    });
    setTimeout(() => {
      setIsQuizStarted(false);
      setIsQuizCompleted(true);
      setResultData(resultData);
      setLoading(false);
    }, 2000);
  };

  return examDataIsLoading ? (
    <Spinner className=" h-screen" />
  ) : (
    <Layout isQuizStarted={isQuizStarted} isQuizCompleted={isQuizCompleted} isQuite={isQuite}>
      {loading && <Loader {...loadingMessage} />}
      {!loading && !isQuizStarted && !isQuizCompleted && <Main startQuiz={startQuiz} />}
      {!loading && isQuizStarted && !isQuite && (
        <Quiz onQuite={onQuite} data={data} countdownTime={countdownTime} endQuiz={endQuiz} />
      )}
      {((!loading && isQuizCompleted) || isQuite) && <Result {...resultData} />}
    </Layout>
  );
};

export default App;
