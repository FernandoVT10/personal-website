import React from "react";

import { render, fireEvent } from "@testing-library/react";

import ProjectEditor from "./ProjectEditor";
import {MockedProvider} from "@apollo/client/testing";

const renderComponent = (props: {[key: string]: any} = {}) => {
  const projectEditorProps = {
    images: ["test-1.jpg", "test-2.jpg"],
    setImagesToDelete: props.setImagesToDelete ?? jest.fn(),
    setNewImages: props.setNewImages ?? jest.fn(),
    title: props.title ?? "test title",
    setTitle: props.setTitle ?? jest.fn(),
    description: props.description ?? "test description",
    setDescription: props.setDescription ?? jest.fn(),
    content: props.content ?? "test content",
    setContent: props.setContent ?? jest.fn(),
    selectedTechnologies: ["test 1", "test 2"],
    setSelectedTechnologies: props.setSelectedTechnologies ?? jest.fn(),
    goBack: props.goBack ?? jest.fn(),
    onSave: props.onSave ?? jest.fn(),
    loading: props.loading ?? false,
    error: props.error ?? ""
  }

  return render(
    <MockedProvider>
      <ProjectEditor {...projectEditorProps}/>
    </MockedProvider>
  );
}

const getElementByIdSpy = jest.spyOn(document, "getElementById");

describe("src/components/ProjectEditor", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render correctly", () => {
    const { queryByText, queryByDisplayValue, getAllByAltText } = renderComponent();

    const imageList = getAllByAltText("Image List Image") as HTMLImageElement[];
    expect(imageList).toHaveLength(2);

    expect(imageList[0].src).toMatch("test-1.jpg");
    expect(imageList[1].src).toMatch("test-2.jpg");

    expect(queryByDisplayValue("test title")).toBeInTheDocument();
    expect(queryByDisplayValue("test description")).toBeInTheDocument();
    expect(queryByDisplayValue("test content")).toBeInTheDocument();

    expect(queryByText("test 1")).toBeInTheDocument();
    expect(queryByText("test 2")).toBeInTheDocument();
  });

  it("should render the loader component", () => {
    const { queryByText, queryByTestId } = renderComponent({ loading: true });

    expect(queryByText("Save Project")).not.toBeInTheDocument();
    expect(queryByText("Go Back")).not.toBeInTheDocument();
    expect(queryByTestId("loader-component")).toBeInTheDocument();
  });

  it("should display an error message", () => {
    const { queryByText } = renderComponent({ error: "test error" });

    expect(queryByText("test error")).toBeInTheDocument();
  });

  it("should call the goBack function when we click on the Go Back button", () => {
    const goBackMock = jest.fn();
    const { getByText } = renderComponent({ goBack: goBackMock });

    fireEvent.click(getByText("Go Back"));
    expect(goBackMock).toHaveBeenCalled();
  });

  describe("onSave", () => {
    const focusMock = jest.fn();

    beforeEach(() => {
      getElementByIdSpy.mockImplementation(() => ({ focus: focusMock } as any));
    });

    it("should call the onSave function", () => {
      const onSaveMock = jest.fn();
      const { getByText } = renderComponent({ onSave: onSaveMock });

      fireEvent.click(getByText("Save Project"));
      expect(onSaveMock).toHaveBeenCalled();
    });

    it("shouldn't call the onSave function when the title is empty and should focus the input", () => {
      const onSaveMock = jest.fn();
      const { getByText } = renderComponent({ onSave: onSaveMock, title: "" });

      fireEvent.click(getByText("Save Project"));
      expect(onSaveMock).not.toHaveBeenCalled();

      expect(getElementByIdSpy).toHaveBeenCalledWith("title-input");
      expect(focusMock).toHaveBeenCalled();
    });

    it("shouldn't call the onSave function when the description is empty and should focus the textarea", () => {
      const onSaveMock = jest.fn();
      const { getByText } = renderComponent({ onSave: onSaveMock, description: "" });

      fireEvent.click(getByText("Save Project"));
      expect(onSaveMock).not.toHaveBeenCalled();

      expect(getElementByIdSpy).toHaveBeenCalledWith("description-textarea");
      expect(focusMock).toHaveBeenCalled();
    });

    it("shouldn't call the onSave function when the content is empty and should focus the textarea", () => {
      const onSaveMock = jest.fn();
      const { getByText } = renderComponent({ onSave: onSaveMock, content: "" });

      fireEvent.click(getByText("Save Project"));
      expect(onSaveMock).not.toHaveBeenCalled();

      expect(getElementByIdSpy).toHaveBeenCalledWith("content-textarea");
      expect(focusMock).toHaveBeenCalled();
    });
  });
});
