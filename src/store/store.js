/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-extraneous-dependencies */
import { configureStore } from "@reduxjs/toolkit";

import examReducer from "./exam/examlSlice";
import userReducer from "./user/userSlice";

export const store = configureStore({
  reducer: {
    exam: examReducer,
    users: userReducer,
  },
});
