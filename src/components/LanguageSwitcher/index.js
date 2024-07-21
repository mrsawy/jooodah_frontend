import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";

import EnglishFlag from "./EnglishFlag";
import SaudiArabiaFlag from "./SaudiArabiaFlag";
import { useSelector } from "react-redux";

const countryOptionTemplate = (option) => {
  return (
    <div className="flex align-items-center">
      {option?.code == `ar` ? <SaudiArabiaFlag /> : <EnglishFlag />}
      <div>{option.name}</div>
    </div>
  );
};

const selectedCountryTemplate = (option, props) => {
  if (option) {
    return (
      <div className="flex align-items-center">
        {option?.code == `ar` ? <SaudiArabiaFlag /> : <EnglishFlag />}
        <div>{option.name}</div>
      </div>
    );
  }

  return <span>{props.placeholder}</span>;
};

function LanguageSwitcher({ className }) {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: t("arabic"), code: "ar" },
    { name: t("english"), code: "en" },
  ];

  useEffect(() => {
    if (currentLanguage == `ar`) {
      setSelectedCity({ name: t("arabic"), code: "ar" });
    } else if (currentLanguage == `en`) {
      setSelectedCity({ name: t("english"), code: "en" });
    }
  }, [currentLanguage]);

  let { levels, currentLevel } = useSelector((s) => s.exam);

  return (
    <div className={`card flex justify-content-center ${className}`}>
      <Dropdown
        value={selectedCity}
        onChange={(e) => {
          if (!!levels?.find((level) => level._id == currentLevel?.id)?.disable_ar) return;
          changeLanguage(e.value.code);
          setSelectedCity(e.value);
        }}
        options={cities}
        optionLabel="name"
        placeholder="Select A Language"
        className="w-full md:w-14rem py-1"
        itemTemplate={countryOptionTemplate}
        valueTemplate={selectedCountryTemplate}
      />
    </div>
  );
}

export default LanguageSwitcher;
