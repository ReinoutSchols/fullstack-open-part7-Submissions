import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    Setnotification(state, action) {
      console.log(
        "logging notification action.payload in reducer:",
        action.payload,
      );
      return action.payload;
    },
  },
});

export const { Setnotification } = notificationSlice.actions;
export default notificationSlice.reducer;
