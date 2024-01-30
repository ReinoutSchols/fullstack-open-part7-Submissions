import UserContext from "../userContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";

const BlogView = ({ handleLogout, blogs, handleLike }) => {
  const [user, UserDispatch] = useContext(UserContext);
  const blogid = useParams().id;
  const Blog = blogs.filter((blog) => blog.id === blogid);
  console.log("blog", Blog);
  console.log("blogid", blogid);

  if (Blog.length === 0) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h2>blogs</h2>
      <p>{`${user.username} logged in`}</p>
      <button onClick={() => handleLogout()}>logout</button>

      <h1> {Blog[0].title}</h1>
      <p> {Blog[0].url}</p>
      <div style={{ display: "flex", alignItems: "center" }}>
        <a>{`${Blog[0].likes} likes`}</a>
        <button onClick={() => handleLike(blogid)}>Like</button>
      </div>
      <p>{`added by ${Blog[0].user.username}`}</p>
    </div>
  );
};

export default BlogView;
