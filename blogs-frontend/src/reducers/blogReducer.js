import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    SetBlogs(state, action) {
      console.log(
        "logging setblogs action.payload in blogreducer:",
        action.payload,
      );
      return action.payload;
    },
    CreateBlogs(state, action) {
      console.log(
        "logging created blog action.payload in blogreducer:",
        action.payload,
      );
      state.push(action.payload);
    },
  },
});

export const { SetBlogs, CreateBlogs } = blogSlice.actions;
export default blogSlice.reducer;
