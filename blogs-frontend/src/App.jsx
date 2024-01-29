import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import lodash from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { Setnotification } from "./reducers/notificationReducer";
import { SetUser } from "./reducers/userReducer";
import {
  SetBlogs,
  CreateBlogs,
  LikingBlogs,
  RemoveBlogs,
  initializeBlogs,
} from "./reducers/blogReducer";

const App = () => {
  const dispatch = useDispatch();
  const Message = useSelector((state) => state.notification);
  console.log("Message state:", Message);
  const blogs = useSelector((state) => state.blog);
  console.log("blogs state:", blogs);
  const user = useSelector((state) => state.user);
  console.log("user state:", user);

  // const [blogs, setBlogs] = useState([]);
  // const [successMessage, setSuccessMessage] = useState(null);
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  // setting the state with input of the login form:
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login(
        {
          username,
          password,
        },
        //  setErrorMessage,
      );

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(SetUser(user));
      setUsername("");
      setPassword("");

      dispatch(Setnotification("Login successful"));
      setTimeout(() => {
        dispatch(Setnotification(null));
      }, 5000);
    } catch (error) {
      console.error("Login error:", error);
      dispatch(Setnotification("Error. Wrong credentials. Please try again."));
      setTimeout(() => {
        dispatch(Setnotification(null));
      }, 5000);
    }
  };

  // getting blogs based on if the user state changes.
  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  // using an effect hook to get the local stored credentials on the first render.
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
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
    // Only setting the blogsstate if it is different from the sortedblogs, was getting a lot of infinity loops otherwise.
    if (!lodash.isEqual(sortedBlogs, blogs)) {
      dispatch(SetBlogs(sortedBlogs));
    }
  }, []);

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
      dispatch(CreateBlogs(newBlog));

      dispatch(
        Setnotification(`${newBlog.title} by ${newBlog.author} was added`),
      );
      setTimeout(() => {
        dispatch(Setnotification(null));
      }, 5000);
      //  console.log(blogs);
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (exception) {
      dispatch(Setnotification("Wrong input. Please try again. Error"));
      setTimeout(() => {
        dispatch(Setnotification(null));
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

      dispatch(LikingBlogs(updatedBlog));

      // sending the put request.
      await blogService.update(id, updatedBlog);

      dispatch(
        Setnotification(
          `${updatedBlog.title} by ${updatedBlog.author} was liked`,
        ),
      );
      setTimeout(() => {
        dispatch(Setnotification(null));
      }, 5000);
    } catch (exception) {
      dispatch(Setnotification("Error when liking a blog. Error"));
      setTimeout(() => {
        dispatch(Setnotification(null));
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
        await blogService.remove(id, user.token);

        // deleting blog in state
        dispatch(RemoveBlogs(lodash.filter(blogs, (blog) => blog.id !== id)));

        dispatch(Setnotification(`${blogToDelete.title} was deleted`));
        setTimeout(() => {
          dispatch(Setnotification(null));
        }, 5000);
      }
    } catch (exception) {
      dispatch(Setnotification("Error when deleting a blog. Error"));
      setTimeout(() => {
        dispatch(Setnotification(null));
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <Notification message={Message} />
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    );
  }
  return (
    <div>
      <Notification message={Message} />
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
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={() => handleLike(blog.id)}
          handleDelete={() => handleDelete(blog.id)}
          currentUser={user}
        />
      ))}
    </div>
  );
};

export default App;
