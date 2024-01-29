/* eslint-disable indent */
import { useState, useEffect, useContext } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import lodash from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SetUser } from "./reducers/userReducer";
import { SetBlogs } from "./reducers/blogReducer";
import NotificationContext from "./notificationContext";

const App = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [Message, messageDispatch] = useContext(NotificationContext);

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      console.log("invalidated..");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  // mutation creator to update blogs
  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      console.log("invalidated after updating");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
  const voteLikes = (selectedBlog) => {
    updateBlogMutation.mutate({ id: selectedBlog.id, newObject: selectedBlog });
  };
  // mutation creator to delete blogs
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      console.log("invalidated after deleting");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
  const deleteBlog = (id) => {
    deleteBlogMutation.mutate({ id });
  };

  const user = useSelector((state) => state.user);
  console.log("user state:", user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  // setting the state with input of the login form:
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(SetUser(user));
      setUsername("");
      setPassword("");

      messageDispatch({ type: "MESSAGE", payload: "Login successful" });
      setTimeout(() => {
        messageDispatch({ type: "MESSAGE", payload: null });
      }, 5000);
    } catch (error) {
      console.error("Login error:", error);
      messageDispatch({
        type: "MESSAGE",
        payload: "Error. Wrong credentials. Please try again.",
      });
      setTimeout(() => {
        messageDispatch({ type: "MESSAGE", payload: null });
      }, 5000);
    }
  };

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });

  const blogs = result.data || [];

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(SetUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  // creating logout handler.
  const handleLogout = () => {
    window.localStorage.clear();
    dispatch(SetUser(null));
  };

  // Sorting the blogs by likes
  useEffect(() => {
    // sorting in descending order, if b.likes is greater then a.likes, b comes before a
    if (result.isSuccess && result.data) {
      // Sorting the blogs by likes
      const sortedBlogs = [...result.data].sort((a, b) => b.likes - a.likes);
      if (!lodash.isEqual(sortedBlogs, result.data)) {
        dispatch(SetBlogs(sortedBlogs));
      }
    }
  }, [result.isSuccess, result.data, dispatch]);

  // loginform handler
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  // handle new blog function
  const handleNewBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title,
        author,
        url,
      };
      newBlogMutation.mutate(newBlog);

      messageDispatch({
        type: "MESSAGE",
        payload: `${newBlog.title} by ${newBlog.author} was added`,
      });
      setTimeout(() => {
        messageDispatch({ type: "MESSAGE", payload: null });
      }, 5000);
      //  console.log(blogs);
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (exception) {
      messageDispatch({
        type: "MESSAGE",
        payload: "Wrong input. Please try again. Error",
      });
      setTimeout(() => {
        messageDispatch({ type: "MESSAGE", payload: null });
      }, 5000);
    }
  };
  // Handling the like button
  const handleLike = async (id) => {
    try {
      // finding the blog with the id that is liked
      const blogToUpdate = blogs.find((blog) => blog.id === id);

      // adding a like
      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

      // sending the put request.
      console.log(" UPDATEDBlog", updatedBlog);
      voteLikes(updatedBlog);

      messageDispatch({
        type: "MESSAGE",
        payload: `${updatedBlog.title} by ${updatedBlog.author} was liked`,
      });
      setTimeout(() => {
        messageDispatch({ type: "MESSAGE", payload: null });
      }, 5000);
    } catch (exception) {
      messageDispatch({
        type: "MESSAGE",
        payload: "Error when liking a blog. Error",
      });
      setTimeout(() => {
        messageDispatch({ type: "MESSAGE", payload: null });
      }, 5000);
    }
  };

  // Handling the delete button
  const handleDelete = async (id) => {
    try {
      // Find the blog to delete from the state
      const blogToDelete = blogs.find((blog) => blog.id === id);

      if (!blogToDelete) {
        console.error(`Blog with id ${id} not found`);
        return;
      }
      if (
        window.confirm(
          `You want to delete the blog with the title: ${blogToDelete.title} ?`,
        )
      ) {
        // sending the delete request.
        deleteBlog(blogToDelete.id);

        // deleting blog in state
        // dispatch(RemoveBlogs(lodash.filter(blogs, (blog) => blog.id !== id)));

        messageDispatch({
          type: "MESSAGE",
          payload: `${blogToDelete.title} was deleted`,
        });
        setTimeout(() => {
          messageDispatch({ type: "MESSAGE", payload: null });
        }, 5000);
      }
    } catch (exception) {
      messageDispatch({
        type: "MESSAGE",
        payload: "Error when deleting a blog. Error",
      });
      setTimeout(() => {
        messageDispatch({ type: "MESSAGE", payload: null });
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <Notification />
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    );
  }
  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <p>{user.username} logged in </p>
      <button onClick={() => handleLogout()}>logout</button>
      <Togglable buttonLabel="new blog">
        <BlogForm
          handleNewBlog={handleNewBlog}
          title={title}
          author={author}
          url={url}
          handleAuthorChange={({ target }) => setAuthor(target.value)}
          handleTitleChange={({ target }) => setTitle(target.value)}
          handleUrlChange={({ target }) => setUrl(target.value)}
        />
      </Togglable>
      {result.isLoading ? (
        <div>Loading...</div>
      ) : (
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={() => handleLike(blog.id)}
            handleDelete={() => handleDelete(blog.id)}
            currentUser={user}
          />
        ))
      )}
    </div>
  );
};

export default App;
