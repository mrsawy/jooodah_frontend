import React from "react";
import { Container, Message, Icon } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

const Loader = ({ title, message }) => {
  const { i18n, t } = useTranslation();
  return (
    <div className="inline-flex  justify-center w-auto gap-3 items-center mx-5 py-3 px-4 bg-gray-300 shadow-lg rounded-lg">
      <Icon name="circle notched" loading size="big" />
      <div className="flex flex-col">
        <div className="text-2xl font-bold">{title ? title : t("Just one second")}</div>
        <div className="text-lg">{message ? message : t("fetching that content for you.")}</div>
      </div>
    </div>
  );
};

export default Loader;
