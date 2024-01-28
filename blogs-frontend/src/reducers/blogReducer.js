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
    LikingBlogs(state, action) {
      const { id, likes } = action.payload;
      return state.map((blog) => (blog.id === id ? { ...blog, likes } : blog));
    },
    RemoveBlogs(state, action) {
      return action.payload;
    },
  },
});

export const { SetBlogs, CreateBlogs, LikingBlogs, RemoveBlogs } =
  blogSlice.actions;
export default blogSlice.reducer;
