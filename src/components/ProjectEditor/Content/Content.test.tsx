import React from "react";

import { render, fireEvent } from "@testing-library/react";

import Content from "./Content";

jest.mock("react", () => {
  const originalReact = jest.requireActual("react");

  return {
    ...originalReact,
    useRef: () => ({
      set current(_: any) {},
      get current() {
        return {
          scroll: jest.fn()
        }
      }
    })
  }
});

describe("src/components/ProjectEditor/Content", () => {
  it("should render correctly", () => {
    const { queryByDisplayValue } = render(<Content content="test content" setContent={jest.fn()}/>);
    expect(queryByDisplayValue("test content")).toBeInTheDocument();
  });

  it("should call to setContent when we change the value of the textarea correctly", () => {
    const setContentMock = jest.fn();
    const { getByDisplayValue } = render(<Content content="test content" setContent={setContentMock}/>);

    const textarea = getByDisplayValue("test content");
    fireEvent.change(textarea, { target: { value: "new content" } });

    expect(setContentMock).toHaveBeenCalledWith("new content");
  });

  it("should active the modal when we click on the 'See the preview' button", () => {
    const { getByText, queryAllByText } = render(<Content content="test content" setContent={jest.fn()}/>);
    expect(queryAllByText("test content")).toHaveLength(1);

    fireEvent.click(getByText("See the preview"));
    expect(queryAllByText("test content")).toHaveLength(2);
  });
});
