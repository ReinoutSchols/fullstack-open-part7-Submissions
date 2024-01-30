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
  const commentElements = Blog[0].comments.map((comment) => (
    <li key={comment.text}>{comment.text}</li>
  ));
  console.log("comment elements:", commentElements);
  return (
    <div>
      <h2>blog app</h2>

      <h2> {Blog[0].title}</h2>
      <p> {Blog[0].url}</p>
      <div style={{ display: "flex", alignItems: "center" }}>
        <a>{`${Blog[0].likes} likes`}</a>
        <button onClick={() => handleLike(blogid)}>Like</button>
      </div>
      <p>{`added by ${Blog[0].user.username}`}</p>
      <h3>Comments</h3>
      <ul>{commentElements}</ul>
    </div>
  );
};

export default BlogView;
