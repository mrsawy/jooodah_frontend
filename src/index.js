import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import "flowbite";

import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import PrimeReact from "primereact/api";

import "./index.css";

import enTranslation from "./locals/en.json";
import arTranslation from "./locals/ar.json";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import router from "./Router";
import Spinner from "./components/Spinner";
import { store } from "./store/store";

PrimeReact.ripple = true;
i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "ar"],
    fallbackLng: "en",
    debug: false,
    detection: {
      order: ["localStorage", "path", "cookie", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
    backend: {
      loadPath: "/locals/{{lng}}.json",
    },
  });

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Suspense fallback={<Spinner className="h-100" />}>
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} fallbackElement={<Spinner className="h-100" />} />
      </Provider>
    </React.StrictMode>
  </Suspense>
);

serviceWorkerRegistration.register();
