const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
    display: "flex",
    flexDirection: "column",
  };

  console.log("Rendering Blog component");
  return (
    <div style={blogStyle} className="bloggos">
      <div id="default">
        {blog.title} {blog.author}
      </div>
      <div data-testid="blog-details"></div>
    </div>
  );
};
export default Blog;
