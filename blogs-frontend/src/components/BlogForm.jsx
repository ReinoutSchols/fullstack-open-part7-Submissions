import { Button } from "react-bootstrap";

// Blog form
const BlogForm = ({
  title,
  author,
  url,
  handleNewBlog,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
}) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="title"
            onChange={handleTitleChange}
            placeholder="input-title"
            id="title-id"
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="author"
            onChange={handleAuthorChange}
            placeholder="input-author"
            id="author-id"
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={handleUrlChange}
            placeholder="input-url"
            id="url-id"
          />
        </div>
        <Button type="submit" data-testid="create" id="create">
          {" "}
          Create
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
