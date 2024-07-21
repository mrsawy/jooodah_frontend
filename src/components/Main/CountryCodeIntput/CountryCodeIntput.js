
import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";

// console.log(countries);
export default function FilterDemo({countries, className, selectedCountry, onChange }) {
  const { i18n, t } = useTranslation();

  let currLang = i18n.language;

  //   const [selectedCountry, setSelectedCountry] = useState(null);

  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center justify-center items-center m-auto ps-3">
          {/* <img
            alt={currLang == `en` ? option["en-name"] : option[`ar-name`]}
            src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
            className={`mr-2 flag flag-${option.code.toLowerCase()}`}
            style={{ width: "18px" }}
          /> */}
          <div>({option["phone-code"]})</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center gap-3">
        <span>({option["phone-code"]})</span>
        <div>{currLang == `en` ? option["en-name"] : option[`ar-name`]}</div>
      </div>
    );
  };

  return (
    <div className={"card flex justify-content-center border-gray-200 " + className}>
      <Dropdown
        value={selectedCountry}
        onChange={onChange}
        options={countries}
        optionLabel={currLang == `en` ? "en-name" : `ar-name`}
        placeholder={t("code")}
        filter
        valueTemplate={selectedCountryTemplate}
        itemTemplate={countryOptionTemplate}
        className="w-full md:w-14rem text-sm text-gray-300"
      />
    </div>
  );
}
