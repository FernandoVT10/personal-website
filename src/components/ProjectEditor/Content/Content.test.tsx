import React from "react";

import { GraphQLError } from "graphql";

import { render, fireEvent, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import Content, { UPLOAD_IMAGE } from "./Content";

jest.mock("@/components/Modal", () => ({ isActive, children }) => {
  return isActive ? children : null;
});

const FILE_MOCK = new File([], "test-image.jpg", {
  type: "image/png"
});

const MOCKS = [
  {
    request: {
      query: UPLOAD_IMAGE,
      variables: {
        image: FILE_MOCK
      }
    },
    result: {
      data: {
        uploadImage: "http://example.com/test-image.jpg"
      }
    }
  }
];

const renderComponent = (props: {[key: string]: any} = {}) => {
  return render(
    <MockedProvider mocks={props.mocks ?? MOCKS} addTypename={false}>
      <Content
        content={props.content ?? "test content"}
        setContent={props.setContent ?? jest.fn()}
      />
    </MockedProvider>
  );
}

describe("src/components/ProjectEditor/Content", () => {
  it("should render correctly", () => {
    const { queryByDisplayValue } = renderComponent();
    expect(queryByDisplayValue("test content")).toBeInTheDocument();
  });

  it("should call to setContent when we change the value of the textarea correctly", () => {
    const setContentMock = jest.fn();
    const { getByDisplayValue } = renderComponent({ setContent: setContentMock });

    const textarea = getByDisplayValue("test content");
    fireEvent.change(textarea, { target: { value: "new content" } });

    expect(setContentMock).toHaveBeenCalledWith("new content");
  });

  it("should active the modal when we click on the 'See the preview' button", () => {
    const { getByText, queryAllByText } = renderComponent();
    expect(queryAllByText("test content")).toHaveLength(1);

    fireEvent.click(getByText("See the preview"));
    expect(queryAllByText("test content")).toHaveLength(2);
  });

  it("should add the error class to the container when an error appears", async () => {
    const { getByTestId } = renderComponent();

    const file = new File([], "file-name.html", {
      type: "text/html"
    });

    const container = getByTestId("content-container");
    expect(container.classList.contains("error")).toBeFalsy();

    const inputFile = getByTestId("content-editor-input-file");
    fireEvent.change(inputFile, { target: { files: [file] } });

    expect(container.classList.contains("error")).toBeTruthy();
  });

  describe("handleInputFile", () => {
    it("should add the image url to the textarea", async () => {
      const { getByTestId } = renderComponent();

      const inputFile = getByTestId("content-editor-input-file");
      fireEvent.change(inputFile, { target: { files: [FILE_MOCK] } });

      const setRangeTextSpy = jest.spyOn(window.HTMLTextAreaElement.prototype, "setRangeText");

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(setRangeTextSpy).toHaveBeenCalledWith(
        "\n![test-image.jpg](http://example.com/test-image.jpg)",
        0,
        0,
        "select"
      );
    });

    it("should display the loader when the upload image mutation is loading", async () => {
      const { queryByText, queryByTestId, getByTestId } = renderComponent();

      const inputFile = getByTestId("content-editor-input-file");
      fireEvent.change(inputFile, { target: { files: [FILE_MOCK] } });

      expect(queryByTestId("loader-component")).toBeInTheDocument();
      expect(queryByText("Uploading Image")).toBeInTheDocument();

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByTestId("loader-component")).not.toBeInTheDocument();
      expect(queryByText("Uploading Image")).not.toBeInTheDocument();
    });

    it("should display a message when the upload image mutation throws an error", async () => {
      const mock = {
        ...MOCKS[0],
        result: {
          errors: [new GraphQLError("test error message")]
        }
      }

      const { getByTestId, queryByText } = renderComponent({ mocks: [mock] });

      const inputFile = getByTestId("content-editor-input-file");
      fireEvent.change(inputFile, { target: { files: [FILE_MOCK] } });

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByText("test error message")).toBeInTheDocument();
    });

    it("should display an error message when the file isn't an image", () => {
      const { getByTestId, queryByText } = renderComponent();

      const file = new File([], "file-name.html", {
        type: "text/html"
      });

      const inputFile = getByTestId("content-editor-input-file");
      fireEvent.change(inputFile, { target: { files: [file] } });

      expect(queryByText("The file must be a .jpg, .png or .jpeg image.")).toBeInTheDocument();
    });

    it("should display an erorr message when the textarea is empty and we blur it", () => {
      const { getByTestId, queryByText } = renderComponent({ content: "" });

      const textarea = getByTestId("content-editor-textarea");
      expect(queryByText("The content is required")).not.toBeInTheDocument();

      fireEvent.blur(textarea);
      expect(queryByText("The content is required")).toBeInTheDocument();
    });
  });
});
