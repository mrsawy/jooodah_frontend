/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { createUserService } from "./userService";

const initialState = {
  user: null,
  capatcha: null,
  isCaptchaExpired: false,
  
  result: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  levelIsSet: false,
  message: "",
};

export const createUser = createAsyncThunk("user/createUser", async (args, thunkAPI) => {
  try {
    const user = await createUserService(args);
    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    setIsCaptchaExpired: (state, action) => {
      state.isCaptchaExpired = action.payload;
    },
    setResultData: (state, action) => {
      state.result = action.payload;
    },
    setCapatcha: (state, action) => {
      console.log(`setCaptcha ==> `, action.payload);
      state.capatcha = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.msgIsSet = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        // state.user = action?.payload ? action?.payload : null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.msgIsSet = false;
        state.message = action.error?.message;
      });
  },
});

export default userSlice.reducer;
export const { setUserData, setResultData, setCapatcha , setIsCaptchaExpired } = userSlice.actions;
