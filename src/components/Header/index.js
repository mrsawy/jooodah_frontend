import React, { useState } from "react";
import { Menu, Button } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import InstructionModal from "./../../components/InstructionModal";
import LanguageSwitcher from "./../../components/LanguageSwitcher";

const Header = ({ isQuizStarted, isQuite, isQuizCompleted }) => {
  const { i18n, t } = useTranslation();

  let currLang = i18n.language.toLowerCase();
  // console.log(`h currLang`,currLang)

  return (
    <Menu stackable inverted>
      {!isQuizStarted && (
        <Menu.Item header>
          <h1>{isQuite || isQuizCompleted ? t(`Quiz_End`) : t(`Quiz_Beginning`)}</h1>
        </Menu.Item>
      )}
      <div
        className={`flex justify-center items-center ${currLang == `en` ? `ml-auto mr-9` : `mr-auto ml-5`} mb-4 gap-8 mt-4 `}
      >
        <InstructionModal isQuizStarted={isQuizStarted} className="m-auto" />
        {/* {!isQuizStarted && !isQuite && !isQuizCompleted && <LanguageSwitcher />} */}
        <LanguageSwitcher />
      </div>
    </Menu>
  );
};

export default Header;
