import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test.only('Blog form calls the event handler it received as props with the right details when a new blog is created.', async () => {

    const handleNewBlogMock = jest.fn()
    const user = userEvent.setup()

    render(
      <BlogForm
        title='testing a form...'
        author='testauthor'
        url='testurl'
        handleNewBlog={handleNewBlogMock}
      />
    )

    const titleInput =  screen.getByPlaceholderText('input-title')
    const authorInput =  screen.getByPlaceholderText('input-author')
    const urlInput = screen.getByPlaceholderText('input-url')
    const submit = screen.getByTestId('create')

    screen.debug(titleInput)

    expect(titleInput.value).toBe('testing a form...')
    expect(authorInput.value).toBe('testauthor')
    expect(urlInput.value).toBe('testurl')

    await user.click(submit)
    screen.debug()

    expect(handleNewBlogMock).toHaveBeenCalledWith({
      title: 'testing a form...',
      author: 'testauthor',
      url: 'testurl',
    })

    expect(handleNewBlogMock.mock.calls).toHaveLength(1)
  })
})
