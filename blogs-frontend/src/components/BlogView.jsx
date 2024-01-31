import { useContext, useState } from "react";
import { useParams } from "react-router-dom";

const BlogView = ({ blogs, handleLike, handleSubmit }) => {
  const [comment, setComment] = useState("");
  console.log("commentstate: ", comment);
  const blogid = useParams().id;
  const Blog = blogs.filter((blog) => blog.id === blogid);
  console.log("blog", Blog);
  console.log("blogid", blogid);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

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
      <form
        style={{ display: "flex" }}
        onSubmit={(event) => {
          handleSubmit(event, blogid, comment);
          setComment("");
        }}
      >
        <div>
          <input
            type="text"
            value={comment}
            name="comment"
            onChange={handleCommentChange}
            id="commment-id"
          />
        </div>
        <button type="submit" id="addingComment">
          Comment
        </button>
      </form>
      <ul>{commentElements}</ul>
    </div>
  );
};

export default BlogView;
