import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  test("renders title and author, but not the url or like by default", () => {
    const blog = {
      title: "Component testing is done with react-testing-library",
      author: "testauthor",
      url: "link.com",
      likes: "1000",
      user: { username: "reinout" },
    };

    // destructuring container from the rendered component
    const { container } = render(<Blog blog={blog} />);
    // getting the id
    const element = container.querySelector("#default");
    expect(element).toBeDefined();
    // getting the classname en check the display style
    const div = container.querySelector(".togglableHidden");
    screen.debug(div);
    expect(div).toHaveStyle("display: none");
  });

  test("Url and likes are rendered when pressing the view button", async () => {
    const blog = {
      title: "Component testing is done with react-testing-library",
      author: "testauthor",
      url: "link.com",
      likes: "1000",
      user: { username: "reinout" },
    };

    // destructuring these functions to use later without screen
    const { getByText, getByTestId } = render(<Blog blog={blog} />);

    // check that url and likes are not visible
    expect(getByTestId("blog-details")).toHaveStyle("display: none");

    // Click the button
    const button = getByText("View");
    const user = userEvent.setup();
    await user.click(button);

    // Check that the details are now visible
    expect(getByTestId("blog-details")).toHaveStyle("display: block");

    // Check that the URL and likes are rendered
    expect(getByText(/link\.com/)).toBeInTheDocument();
    expect(getByText(/1000/)).toBeInTheDocument();
  });

  test("When like button is pressed twice, the event handler passed as props to Blog is called twice", async () => {
    const blog = {
      title: "Component testing is done with react-testing-library",
      author: "testauthor",
      url: "link.com",
      likes: "1000",
      user: { username: "reinout" },
    };

    const mockHandler = jest.fn();

    const { getByText } = render(<Blog blog={blog} handleLike={mockHandler} />);

    const user = userEvent.setup();
    const button = getByText("Like");
    await user.click(button);
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
