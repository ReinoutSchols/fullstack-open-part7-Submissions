import { createSlice } from "@reduxjs/toolkit";
const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SetUser(state, action) {
      console.log(
        "logging setUser action.payload in userreducer:",
        action.payload,
      );
      return action.payload;
    },
  },
});

export const { SetUser } = userSlice.actions;
export default userSlice.reducer;
