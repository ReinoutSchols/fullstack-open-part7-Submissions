import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
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
    AppendBlogs(state, action) {
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
    addComment(state, action) {
      return action.payload;
    },
  },
});

export const { SetBlogs, AppendBlogs, LikingBlogs, RemoveBlogs, addComment } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(SetBlogs(blogs));
  };
};

export const CreateBlogs = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content);
    dispatch(AppendBlogs(newBlog));
    console.log("New blog created:", newBlog);
    const blogs = await blogService.getAll();
    dispatch(SetBlogs(blogs));
  };
};

export default blogSlice.reducer;
