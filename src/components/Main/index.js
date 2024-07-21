import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import Swal from "sweetalert2";
import { setLevel, setPauseTime } from "./../../store/exam/examlSlice";
import { setUserData } from "./../../store/user/userSlice";
import { api_url, base_url } from "./../../utils/base_url";
import { experiences, ages, eduLevels } from "./../../constants/ages";
import genderValues from "./../../constants/gender";
import countries from "./CountryCodeIntput/countries.json";
import ReCAPTCHA from "react-google-recaptcha";
import { validationSchema } from "./../../validation";

import { Input, Segment, Item, Dropdown, Divider, Message } from "semantic-ui-react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { shuffle } from "../../utils";
import formatExam from "../../utils/formatExam";
import NumericInput from "../NumericInput";
import CountryCodeInput from "./CountryCodeIntput/CountryCodeIntput";
import { setCurrentQuestions } from "./../../store/exam/examlSlice";
import { setCapatcha, setIsCaptchaExpired } from "./../../store/user/userSlice";

//
const Main = ({ startQuiz }) => {
  const dispatch = useDispatch();
  const [logo, setLogo] = useState(``);
  const [age, setAge] = useState(20);
  const [captchaIsChanged, setCaptchaIsChanged] = useState(false);
  const [exp, setExp] = useState(1);
  const [eduLevel, setEduLevel] = useState("Preparatory -  إعدادية");

  function onReCAPTCHAChange(value) {
    setCaptchaIsChanged(!!value);
    if (value) {
      dispatch(setIsCaptchaExpired(false));
      dispatch(setCapatcha(value));
    }
    setTimeout(
      () => {
        console.log(`capatcha expired from setTimeout`);
        dispatch(setIsCaptchaExpired(true));
      },
      1000 * 60 * 2
    );
  }
  useEffect(() => {
    (async () => {
      const response = await axios.get(`${api_url}/site`);
      const result = response.data;
      const value = result?.find((item) => item.identifier == "joodah_logo")?.value;
      if (value) {
        setLogo(base_url[base_url.length - 1] == `/` ? base_url + value : base_url + "/" + value);
      }
    })();
  }, []);

  const { i18n, t } = useTranslation();
  let currLang = i18n.language;
  let { levels, currentLevel } = useSelector((s) => s.exam);
  const [category, setCategory] = useState(levels[0]?._id);
  const [name, setName] = useState(``);
  const [firstName, setFirstName] = useState(``);
  const [lastName, setLastName] = useState(``);
  const [phone, setPhone] = useState(null);
  const [fullPhone, setFullPhone] = useState(null);
  //
  const [nationality, setNationality] = useState(null);
  const [gender, setGender] = useState(``);
  const [academicSpecialization, setAcademicSpecialization] = useState(``);
  const [countryOfResidence, setCountryOfResidence] = useState(``);
  const [relatedExperience, setRelatedExperience] = useState(``);
  //

  const [email, setEmail] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [examLang, setExamLang] = useState(currLang);

  let allFieldsSelected = false;
  if (category && examLang) {
    allFieldsSelected = true;
  }
  const fetchData = async () => {
    try {
      const valid = validationSchema.validateSync({
        name,
        email,
        phone,
        fullPhone,
        firstName,
        lastName,
        nationality,
        gender,
        academicSpecialization,
        countryOfResidence,
        relatedExperience,
      });
      if (!allFieldsSelected || !valid) {
        Swal.fire({
          icon: "error",
          title: `${t(`Error`)}!`,
          text: t("All fields must be filled."),
        });
        return;
      }
      setProcessing(true);
      const response = await axios.post(`${api_url}/users/check`, {
        email,
        phone: fullPhone,
        category,
      });
      if (response.status !== 200) {
        Swal.fire({
          icon: "error",
          title: `${t(`Error`)}!`,
          text: t(`User with the same email or phone already exists`),
        });
        return;
      }

      dispatch(
        setUserData({
          nationality,
          gender,
          academicSpecialization,
          countryOfResidence,
          relatedExperience,
          name,
          phone: fullPhone,
          email,
          age,
          experience: exp,
          education: eduLevel,
        })
      );

      const {
        questions: results,
        numberOfMinutes,
        pauseTime,
      } = formatExam({
        levels,
        levelId: category,
        examLang,
      });

      dispatch(setPauseTime(pauseTime));
      results.forEach((element) => {
        element.options = shuffle([element.correct_answer, ...element.incorrect_answers], element);
      });

      setProcessing(false);
      dispatch(setCurrentQuestions(results));
      startQuiz(results, numberOfMinutes * 60);
      i18n.changeLanguage(examLang);
    } catch (e) {
      if (Array.isArray(e?.errors) && e?.errors?.length > 0) {
        Swal.fire({
          icon: "error",
          title: `${t(`Error`)}!`,
          text: e?.errors?.map((err) => t(`${err}`)).join(` - `),
        });
        setProcessing(false);
        return;
      }
      Swal.fire({
        icon: "error",
        title: `${t(`Error`)}!`,
        text: t(`User with the same email or phone already exists`),
      });
      setProcessing(false);
    }
  };

  //
  let [captchaElement, setCaptchaElement] = useState();

  const setCaptchaRef = (ref) => {
    if (ref) {
      setCaptchaElement(ref);
      return;
    }
  };
  // _________________________________________________
  // let { levels, currentLevel } = useSelector((s) => s.exam);

  const [languageOptions, setLanguageOptions] = useState([
    { key: `ar`, text: t(`arabic`), value: `ar` },
    { key: `en`, text: t(`english`), value: `en` },
  ]);

  useEffect(() => {
    if (!!levels?.find((level) => level._id == currentLevel?.id)?.disable_ar) {
      setLanguageOptions([{ key: `en`, text: t(`english`), value: `en` }]);
    } else {
      setLanguageOptions([
        { key: `ar`, text: t(`arabic`), value: `ar` },
        { key: `en`, text: t(`english`), value: `en` },
      ]);
    }
  }, [currentLevel]);

  //
  return (
    <div className="ui  sm:mx-6 xl:mx-32 2xl:mx-60 ">
      <Segment>
        <Item.Group divided>
          <Item>
            <div className="flex flex-col gap-1 justify-center items-center px-4 mb-3 pb-2 max-w-[250px]">
              <Item.Image src={logo} />
            </div>
            <Item.Content>
              <Item.Header>
                <h1>{t(`The_Quiz`)}</h1>
              </Item.Header>
              {error && (
                <Message error onDismiss={() => setError(null)}>
                  <Message.Header>Error!</Message.Header>
                  {error.message}
                </Message>
              )}
              <Divider />

              <div className=" flex flex-col lg:flex-row lg:flex-nowrap gap-10">
                <div className="w-full flex-grow">
                  <p> {t(`First Name`)} </p>
                  <Input
                    value={firstName}
                    onChange={(_, { value }) => {
                      setFirstName(value.trim(``));
                      setName(`${value.trim(``)} ${lastName}`);
                    }}
                    name="fname"
                    className="w-full"
                    placeholder={`${t("First Name")}...`}
                  />
                </div>
                <div className="w-full flex-grow">
                  <p> {t(`Family Name`)} </p>
                  <Input
                    value={lastName}
                    onChange={(_, { value }) => {
                      setLastName(value.trim(``));
                      setName(`${firstName} ${value.trim(``)}`);
                    }}
                    name="lname"
                    placeholder={`${t("Family Name")}...`}
                    className="w-full"
                  />
                </div>
              </div>
              <Divider />

              <div className=" flex flex-col lg:flex-row lg:flex-nowrap gap-10">
                <div className="w-full">
                  <p>{t(`Phone_Number`)} </p>
                  <div className={`flex ${currLang == "ar" ? "flex-row-reverse" : "flex-row"}`}>
                    <CountryCodeInput
                      selectedCountry={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.value);
                        setFullPhone(`${e.value[`phone-code`]} ${phone}`);
                      }}
                      className=" min-w-32  w-16 border border-solid border-gray-300 rounded-md"
                      countries={countries}
                    />
                    <NumericInput
                      value={phone}
                      onChange={({ target }) => {
                        setPhone(target?.value);
                        setFullPhone(`${selectedCountry[`phone-code`]} ${target?.value}`);
                      }}
                      className="w-full numiricPhone"
                      placeholder={`${t("phone")}...`}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <p> {t(`Email_Adress`)} </p>
                  <Input
                    value={email}
                    onChange={(_, { value }) => {
                      setEmail(value);
                    }}
                    className="w-full"
                    placeholder={`${t("email")}...`}
                  />
                </div>
              </div>
              {/* <Divider /> */}
              <Divider />
              {/*  */}
              <div className=" flex flex-col lg:flex-row lg:flex-nowrap gap-10">
                <div className="w-full">
                  <p>{t(`gender`)} </p>
                  <Dropdown
                    fluid
                    selection
                    name="gender"
                    placeholder={t("Select your gender")}
                    header={t("Select your gender")}
                    options={genderValues}
                    value={gender}
                    onChange={(_, e) => {
                      setGender(e?.value);
                    }}
                    disabled={processing}
                  />
                </div>
                <div className="w-full">
                  <p> {t(`nationality`)} </p>
                  <Input
                    value={nationality}
                    onChange={(_, { value }) => {
                      setNationality(value);
                    }}
                    className="w-full"
                    placeholder={`${t("nationality")}...`}
                  />
                </div>
              </div>
              <Divider />
              <div className=" flex flex-col lg:flex-row lg:flex-nowrap gap-10">
                <div className="w-full">
                  <p>{t(`academicSpecialization`)} </p>
                  <Input
                    value={academicSpecialization}
                    onChange={(_, { value }) => {
                      setAcademicSpecialization(value);
                    }}
                    className="w-full"
                    placeholder={`${t("academicSpecialization")}...`}
                  />
                </div>
                <div className="w-full">
                  <p> {t(`countryOfResidence`)} </p>
                  <Input
                    value={countryOfResidence}
                    onChange={(_, { value }) => {
                      setCountryOfResidence(value);
                    }}
                    className="w-full"
                    placeholder={`${t("countryOfResidence")}...`}
                  />
                </div>
              </div>
              <Divider />
              {/* / */}
              {/* <Item.Meta>
                <div className=" flex flex-col lg:flex-row lg:flex-nowrap gap-10">
                  <div className="w-full">
                    <p className="text-zinc-900">{t(`Please Choose Your Related Experience`)}</p>
                    <Dropdown
                      fluid
                      selection
                      name="relatedExperience"
                      placeholder={t("Select your Related Experience")}
                      header={t("Select your Related Experience")}
                      options={experiences}
                      value={relatedExperience}
                      onChange={(_, e) => {
                        setRelatedExperience(e?.value);
                      }}
                      disabled={processing}
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-zinc-900">{t(`Please Choose Your experience in any field`)}</p>
                    <Dropdown
                      fluid
                      selection
                      name="experience"
                      placeholder={t("Select your overall experience")}
                      header={t("Select your overall experience")}
                      options={experiences}
                      value={exp}
                      onChange={(_, e) => {
                        setExp(e?.value);
                      }}
                      disabled={processing}
                    />
                  </div>
                </div>
              </Item.Meta> */}
              <Divider />
              <div className=" flex flex-col lg:flex-row lg:flex-nowrap gap-10">
                <div className="w-full">
                  <p>{t(`Please Select Your Highest Education Level`)}</p>
                  <Dropdown
                    fluid
                    selection
                    name="eduLevel"
                    placeholder={t("Education level")}
                    header={t("Select Education Level")}
                    options={eduLevels}
                    value={eduLevel}
                    onChange={(e, { value }) => setEduLevel(value)}
                    disabled={processing}
                  />
                </div>
                <div className="w-full">
                  <p>{t(`Please_select_the_language_of_the_exam`)}</p>
                  <Dropdown
                    fluid
                    selection
                    name="language"
                    placeholder={t("Select Language")}
                    header={t("Select Language")}
                    options={languageOptions}
                    value={examLang}
                    onChange={(e, { value }) => {
                      if (!!currentLevel?.disable_ar) {
                        setExamLang(`en`);
                        i18n.changeLanguage(`en`);
                        return;
                      }
                      setExamLang(value);
                    }}
                    disabled={processing}
                  />
                </div>
              </div>
              <Divider />

              <div className=" flex flex-col lg:flex-row lg:flex-nowrap gap-10">
                <div className="w-full">
                  <p>{t(`Please Choose Your age`)}</p>
                  <Dropdown
                    fluid
                    selection
                    name="age"
                    placeholder={t("Select your age")}
                    header={t("Select your age")}
                    options={ages}
                    value={age}
                    onChange={(_, e) => {
                      setAge(e?.value);
                    }}
                    disabled={processing}
                  />
                </div>
                <div className="w-full">
                  <ReCAPTCHA
                    ref={(r) => setCaptchaRef(r)}
                    sitekey="6LcRtKQpAAAAAA2gfaEUKIn6AQoj-GPVQk4wgNyH"
                    onChange={(a) => {
                      onReCAPTCHAChange(a);
                    }}
                    onExpired={() => {
                      dispatch(setIsCaptchaExpired(true));
                    }}
                  />
                  <br />
                </div>
              </div>

              {/* <Divider /> */}
              {/* Google Recaptcha */}

              {/* end Google Recaptcha */}
              <Divider />
              <Item.Extra>
                <Button
                  onClick={fetchData}
                  disabled={processing || !captchaIsChanged}
                  variant="contained"
                  endIcon={currLang == `ar` ? null : <SendIcon />}
                  startIcon={currLang == `en` ? null : <SendIcon />}
                  className={currLang == `ar` && "flex gap-3"}
                >
                  {processing ? t("Processing") : t("Start_Now")}
                </Button>
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <br />
    </div>
  );
};

export default Main;
