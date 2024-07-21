import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Container, Segment, Item, Divider, Icon, Message, Menu, Header } from "semantic-ui-react";
import he from "he";
import { useTranslation } from "react-i18next";
import { Button as PrimeButton } from "primereact/button";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import Swal from "sweetalert2";

import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlined from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

import Button from "@mui/material/Button";

import Countdown from "../Countdown";
import { getLetter } from "../../utils";
import { pauseExam, setExamIsPaused, setCurrentQuestion } from "../../store/exam/examlSlice";
import PauseModal from "../PauseModal";

const Quiz = ({ data, countdownTime, endQuiz, onQuite }) => {
  const [currQState, setCurrQState] = useState(null);

  let { numberOfPausesLeft, examIsPaused, pauseTime, currentQuestions, currentQuestion } =
    useSelector((s) => s?.exam);
  useEffect(() => {
    if (currentQuestions) {
      setCurrQState(currentQuestions[0]);
    }
  }, [currentQuestions]);

  const { i18n, t } = useTranslation();

  let currentLang = i18n.language;

  let screenWidth = window.innerWidth;

  const dispatch = useDispatch();

  let pauseSeconds = pauseTime?.value > 0 ? pauseTime?.value * 60 : 0;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userSlectedAns, setUserSlectedAns] = useState([]);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(null);

  // Function to handle user selected answer

  useEffect(() => {
    if (questionIndex > 0) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [questionIndex]);

  const handleItemClick = (e, ansData) => {
    try {
      let { name } = ansData;
      let totalPoints = 0;
      let point = 0;
      if (name === he?.decode(data[questionIndex].correct_answer)) {
        point = 1;
      }
      setQuestionsAndAnswers((p) => {
        // let id =  he.decode(data[questionIndex]?._id);
        let qData = [
          ...p?.filter((ele) => ele?._id !== he?.decode(data[questionIndex]?._id)),
          {
            _id: he?.decode(data[questionIndex]?._id),
            question: he?.decode(data[questionIndex]?.question),
            user_answer: name,
            correct_answer: he?.decode(data[questionIndex]?.correct_answer),
            point,
          },
        ];
        setUserSlectedAns(
          qData?.map((d) => ({
            name: d?.user_answer,
            id: d?._id,
            _id: d?._id,
            question: d?.question,
          }))
        );
        totalPoints = qData.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.point;
        }, 0);

        setCorrectAnswers(totalPoints);
        return qData;
      });
      console.log({ correctAns: correctAnswers, qData: totalPoints });
    } catch (err) {
      console.log(err);
    }
  };

  const handleNext = () => {
    let newIndex = questionIndex + 1;
    // console.log(newIndex, userSlectedAns, currentQuestion);
    if (!userSlectedAns.map((e) => e.id).includes(currQState._id)) {
      Swal.fire({
        icon: "error",
        title: `${t(`Error`)}!`,
        text: t(`You Need To Choose An Answer First`),
      });
      return;
    }

    if (questionIndex === data?.length - 1) {
      return endQuiz({
        totalQuestions: data?.length,
        correctAnswers,
        timeTaken,
        questionsAndAnswers: questionsAndAnswers.filter((e) => e),
        fullTime: countdownTime,
      });
    }
    setCurrentQuestion(currentQuestions[newIndex]);
    setCurrQState(currentQuestions[newIndex]);
    setQuestionIndex(newIndex);
  };

  const handleSkip = (e) => {
    let newIndex = questionIndex + 1;

    setQuestionsAndAnswers((p) => p.filter((ele, i) => ele?._id != currQState?._id));
    setUserSlectedAns((p) => p.filter((ele, i) => ele?._id != currQState?._id));

    setCurrentQuestion(currentQuestions[newIndex]);
    setQuestionIndex(newIndex);
    setCurrQState(currentQuestions[newIndex]);
  };
  const handlePrev = () => {
    let newIndex = questionIndex - 1;

    if (questionIndex > 0) {
      setCurrentQuestion(currentQuestions[newIndex]);
      setQuestionIndex(newIndex);
      setCurrQState(currentQuestions[newIndex]);
    }
  };
  const timeOver = (timeTaken) => {
    return endQuiz(
      {
        totalQuestions: data?.length,
        correctAnswers,
        timeTaken,
        fullTime: countdownTime,
        questionsAndAnswers,
      },
      { timeOver: true }
    );
  };
  const uniqueOptions = {};
  const handleQuite = () => {
    Swal.fire({
      icon: "question",
      title: t(`Are you sure you want to quit ?`),
      iconHtml: "؟",
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
      showCancelButton: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(
        //   {
        //     totalQuestions: data?.length,
        //     correctAnswers: 0,
        //     timeTaken,
        //     questionsAndAnswers: questionsAndAnswers.filter((e) => e),
        //     fullTime: countdownTime,
        //   },
        //   { quite: true }
        // );
        endQuiz(
          {
            totalQuestions: data?.length,
            correctAnswers: 0,
            timeTaken,
            questionsAndAnswers: questionsAndAnswers.filter((e) => e),
            fullTime: countdownTime,
          },
          { quite: true }
        );
        // onQuite();
      }
    });
  };

  // }
  return (
    <Item.Header>
      <Container className="quiz-container unselectable">
        <Segment>
          <Item.Group divided>
            <Item>
              <Item.Content>
                <Item.Extra className="text-center flex justify-between items-center flex-wrap  flex-row-reverse">
                  <div className="m-auto flex justify-center items-center  mb-3 lg:mb-0">
                    <Header as="h3" block floated="left" className="m-auto">
                      <Icon name="info circle" />
                      <Header.Content className="m-auto">
                        {`${t(`Question No`)} .${questionIndex + 1} ${t(`of`)} ${data.length}`}
                      </Header.Content>
                    </Header>
                  </div>

                  <div className="m-auto  mb-3 lg:mb-0 flex flex-col justify-center items-center gap-4">
                    <label className="text-lg">
                      {t(`pauses_left`)}: {numberOfPausesLeft}
                    </label>
                    {numberOfPausesLeft > 0 && (
                      <Button
                        onClick={() => {
                          if (examIsPaused) {
                            Swal.fire({
                              icon: "error",
                              title: `${t(`Error`)}!`,
                              text: t("Exam Is Paused"),
                            });
                            return;
                          }
                          dispatch(pauseExam());
                          if (typeof pauseSeconds == `number`) {
                            setTimeout(() => {
                              dispatch(setExamIsPaused(false));
                            }, pauseSeconds * 1000);
                          }
                        }}
                        sx={{ backgroundColor: `rgb(203 215 225 / var(--tw-bg-opacity))` }}
                        variant="outlined"
                        endIcon={currentLang == `en` ? null : <PauseCircleOutlineRoundedIcon />}
                        startIcon={currentLang == `ar` ? null : <PauseCircleOutlineRoundedIcon />}
                        className={` float-right ${currentLang == `ar` && "flex gap-3"} mx-3`}
                      >
                        {t(`Pause`)}
                      </Button>
                    )}
                  </div>
                  <div className="m-auto flex gap-6 items-end justify-center flex-wrap items-center ">
                    <Countdown
                      countdownTime={countdownTime}
                      timeOver={timeOver}
                      setTimeTaken={setTimeTaken}
                    />
                    <button onClick={handleQuite} class="ui inverted red button transition-all">
                      {t(`Quite`)}
                    </button>
                  </div>
                  <PauseModal />
                </Item.Extra>
                <br />
                <Item.Meta>
                  <Message size={`${screenWidth > 500 ? "huge" : "large"}`} floating>
                    <b
                      style={{ fontWeight: screenWidth < 500 ? 700 : 500 }}
                    >{`${t(`Q`)}. ${he.decode(data[questionIndex]?.question)}`}</b>
                  </Message>
                  <br />
                  <Item.Description>
                    <h3>{t(`Please choose one of the following answers:`)}</h3>
                  </Item.Description>
                  <Divider />
                  <Menu vertical fluid size={`${screenWidth > 500 ? "massive" : "large"}`}>
                    {data[questionIndex].options.map((option, i) => {
                      try {
                        const letter = getLetter(i, currentLang);
                        const decodedOption = option ? option : ``;

                        return (
                          <Menu.Item
                            key={decodedOption}
                            name={decodedOption}
                            className="font-bold"
                            style={{ fontWeight: screenWidth < 500 ? 700 : 400 }}
                            active={userSlectedAns.find(
                              (e) =>
                                e.question === data[questionIndex].question &&
                                e.name === decodedOption
                            )}
                            onClick={handleItemClick}
                          >
                            <b style={{ marginRight: "8px" }}>{letter}</b>
                            {decodedOption}
                          </Menu.Item>
                        );
                      } catch (e) {
                        console.log(e);
                        return (
                          <Menu.Item
                            key={`decodedOption`}
                            name={`Undefined !`}
                            className="font-bold"
                            style={{ fontWeight: screenWidth < 500 ? 700 : 400 }}

                            // onClick={handleItemClick}
                          >
                            <b style={{ marginRight: "8px" }}>{`letter`}</b>
                            {`Undefined`}
                          </Menu.Item>
                        );
                      }
                    })}
                  </Menu>
                </Item.Meta>
                <Divider />
                <Item.Extra
                  className={
                    "flex flex-nowrap justify-between " + currentLang == `ar`
                      ? `flex flex-row flex-nowrap justify-between dir-rtl rtl`
                      : `flex flex-row flex-nowrap justify-between dir-rtl rtl`
                  }
                >
                  {!(questionIndex + 1 == data?.length) ? (
                    <div className="flex justify-center flex-wrap gap-y-5 items-end translate-x-8 sm:translate-x-0 sm:gap-3">
                      <Button
                        onClick={handleNext}
                        variant="contained"
                        endIcon={currentLang == `ar` ? null : <ArrowCircleRightOutlinedIcon />}
                        startIcon={currentLang == `en` ? null : <ArrowCircleRightOutlinedIcon />}
                        className={` float-right ${currentLang == `ar` && "flex gap-3"}  gap-3 mx-3`}
                      >
                        {t("Next")}
                      </Button>
                      <Button
                        onClick={handleSkip}
                        variant="contained"
                        endIcon={currentLang == `ar` ? null : <ArrowCircleRightOutlinedIcon />}
                        startIcon={currentLang == `en` ? null : <ArrowCircleRightOutlinedIcon />}
                        className={` float-right ${currentLang == `ar` && "flex gap-3"}  gap-3`}
                      >
                        {t("Skip")}
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={
                        "ml-auto flex  gap-3 " + currentLang == `ar` && "justify-content-start"
                      }
                    >
                      <Button
                        onClick={handleNext}
                        variant="contained"
                        endIcon={currentLang == `ar` ? null : <CheckCircleOutlineRoundedIcon />}
                        startIcon={currentLang == `en` ? null : <CheckCircleOutlineRoundedIcon />}
                        className={`${currentLang == `ar` && "flex gap-3"} gap-3`}
                      >
                        {t("Finish")}
                      </Button>
                    </div>
                  )}
                  {questionIndex > 0 && (
                    <div
                      className={"flex " + currentLang == `ar` ? "justify-start" : "justify-end"}
                    >
                      <Button
                        onClick={handlePrev}
                        variant="contained"
                        endIcon={currentLang == `en` ? null : <ArrowCircleLeftOutlined />}
                        startIcon={currentLang == `ar` ? null : <ArrowCircleLeftOutlined />}
                        className={`  float-left mr-auto ${currentLang == `ar` && "flex gap-3"} gap-3`}
                        disable={questionIndex}
                      >
                        {t("Previous")}
                      </Button>
                    </div>
                  )}
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <br />
      </Container>
    </Item.Header>
  );
};

// Quiz.propTypes = {
//   data: PropTypes.array.isRequired,
//   countdownTime: PropTypes.number.isRequired,
//   endQuiz: PropTypes.func.isRequired,
// };

export default Quiz;
