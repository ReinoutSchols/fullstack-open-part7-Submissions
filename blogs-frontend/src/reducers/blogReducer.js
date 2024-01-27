import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const blogSlice = createSlice({
  name: "blog",
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

export const { Setnotification } = blogSlice.actions;
export default blogSlice.reducer;
