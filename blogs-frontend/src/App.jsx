/* eslint-disable indent */
import { useState, useEffect, useContext } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { useSelector, useDispatch } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NotificationContext from "./notificationContext";
import UserContext from "./userContext";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UsersView from "./components/UsersView";
import IndividualUser from "./components/individualUser";
import BlogView from "./components/BlogView";
import { Navbar, Nav, Button, Form, Alert } from "react-bootstrap";

const App = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [Message, messageDispatch] = useContext(NotificationContext);
  const [user, UserDispatch] = useContext(UserContext);
  console.log("logging user", user);

  // mutation creator to create blogs
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

  // mutation creator to add a comment
  const CommentBlogMutation = useMutation({
    mutationFn: blogService.createComment,
    onSuccess: () => {
      console.log("invalidated after commenting");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const addCommentBlog = (id, newObject) => {
    CommentBlogMutation.mutate({ id, newObject });
  };

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
      UserDispatch({
        type: "LOGIN",
        payload: user,
      });
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
    select: (data) => {
      // Sorting the blogs by likes using useQuery
      return data ? [...data].sort((a, b) => b.likes - a.likes) : [];
    },
  });

  const blogs = result.data || [];

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      UserDispatch({
        type: "LOGIN",
        payload: user,
      });
      blogService.setToken(user.token);
    }
  }, []);

  // creating logout handler.
  const handleLogout = () => {
    window.localStorage.clear();
    UserDispatch({
      type: "LOGIN",
      payload: null,
    });
  };

  // loginform handler
  const loginForm = () => (
    <Form onSubmit={handleLogin}>
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
      <Button type="submit">login</Button>
    </Form>
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
      console.log("id in handle like:", id);
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

  // function to deal with commenting to pass down to BlogView
  const handleNewComment = async (event, id, comment) => {
    event.preventDefault();
    const blogToUpdate = blogs.find((blog) => blog.id === id);
    console.log("id in handlenewcomment:", id);
    addCommentBlog(blogToUpdate.id, { text: comment });
  };

  const padding = {
    padding: 5,
  };

  const navStyle = {
    display: "flex",
    flexDirection: "row",
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
    <Router>
      <Notification />
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <div style={navStyle}>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/">
                  blogs
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">
                  users
                </Link>
              </Nav.Link>
            </div>
            <Nav.Link href="#" as="span">
              <p>{user.username} logged in </p>
              <Button onClick={() => handleLogout()} variant="primary">
                logout
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route
          path="/users"
          element={<UsersView handleLogout={handleLogout} blogs={blogs} />}
        />
        <Route
          path="/users/:id"
          element={<IndividualUser handleLogout={handleLogout} blogs={blogs} />}
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              handleSubmit={handleNewComment}
              blogs={blogs}
              handleLike={handleLike}
            />
          }
        />
        <Route
          path="/"
          element={
            <div>
              <Notification />
              <h2>blog app</h2>
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
                  <Link to={`/blogs/${blog.id}`} key={blog.id}>
                    <Blog blog={blog} />
                  </Link>
                ))
              )}
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
