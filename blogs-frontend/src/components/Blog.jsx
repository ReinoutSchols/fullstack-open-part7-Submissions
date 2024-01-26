import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'column'
  }

  const [viewBlog, setViewBlog] = useState(false)

  console.log('Rendering Blog component')

  const hideWhenVisible = { display: viewBlog ? 'none' : '' }
  const showWhenVisible = { display: viewBlog ? '' : 'none' }

  const toggleVisibility = () => {
    setViewBlog(!viewBlog)
  }

  // checking conditions to toggle remove button
  const canRemove = currentUser && blog.user && currentUser.username === blog.user.username

  return (
    <div style={blogStyle} className='bloggos'>
      <div id = 'default'>
        {blog.title} {blog.author}
      </div>
      <div style={hideWhenVisible}  >
        <button onClick={toggleVisibility} id="view">View</button>
      </div>
      <div style={showWhenVisible} className= 'togglableHidden' data-testid='blog-details'>
        <button onClick={toggleVisibility}>Hide</button>
        <div>
          {blog.url} <br/>
          <div>
            likes {blog.likes} <button onClick={handleLike} id="like">Like</button>
          </div>
          {blog.user.username}
        </div>
        {canRemove && <button id="delete" onClick={handleDelete}>Remove</button>}
      </div>
    </div>
  )
}
export default Blog