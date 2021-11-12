import React from "react";

import { render, fireEvent, act } from "@testing-library/react";

import Technology from "./Technology";

const TECHNOLOGY_MOCK = {
  _id: "testid",
  name: "TestJS"
}

const renderComponent = (props: {[key: string]: any}) => {
  return render(
    <Technology
      isActive={props.isActive ?? false}
      technology={props.technology ?? TECHNOLOGY_MOCK}
      deleteTechnology={props.deleteTechnology ?? jest.fn()}
      editTechnology={props.editTechnology ?? jest.fn()}
      toggleTechnology={props.toggleTechnology ?? jest.fn()}
    />
  );
}

describe("src/components/ProjectEditor/Technologies/ManagementModal/TechnologiesList/Technology", () => {
  it("should render correctly", () => {
    const { queryByText } = renderComponent({});

    expect(queryByText("TestJS")).toBeInTheDocument();
    expect(queryByText("Are you sure to delete 'TestJS'?")).toBeInTheDocument();
  });

  it("should call toggleTechnology function", () => {
    const toggleTechnologyMock = jest.fn();

    const { getByLabelText } = renderComponent({ toggleTechnology: toggleTechnologyMock });

    const checkbox = getByLabelText("TestJS");
    fireEvent.click(checkbox);

    expect(toggleTechnologyMock).toHaveBeenCalledWith("TestJS");
  });

  describe("confirmation container", () => {
    it("should add the active class when we click on the delete dropdown action", () => {
      const { getByText, getByTestId } = renderComponent({});

      const confirmationContainer = getByTestId("technology-confirmation-container");
      expect(confirmationContainer.classList.contains("active")).toBeFalsy();

      fireEvent.click(getByText("Delete"));
      expect(confirmationContainer.classList.contains("active")).toBeTruthy();
    });

    it("should remove the active class when we click on the confirmation container", () => {
      const { getByText, getByTestId } = renderComponent({});

      fireEvent.click(getByText("Delete"));

      const confirmationContainer = getByTestId("technology-confirmation-container");
      fireEvent.click(confirmationContainer);

      expect(confirmationContainer.classList.contains("active")).toBeFalsy();
    });

    it("shouldn't remove the active class when we click inside of the confirmationContainer", () => {
      const { getByText, getByTestId } = renderComponent({});

      fireEvent.click(getByText("Delete"));
      fireEvent.click(getByText("Are you sure to delete 'TestJS'?"));

      const confirmationContainer = getByTestId("technology-confirmation-container");
      expect(confirmationContainer.classList.contains("active")).toBeTruthy();
    });

    it("should remove the active class when we click on the 'No' button", () => {
      const { getByText, getByTestId } = renderComponent({});

      fireEvent.click(getByText("Delete"));

      const confirmationContainer = getByTestId("technology-confirmation-container");
      fireEvent.click(getByText("No"));

      expect(confirmationContainer.classList.contains("active")).toBeFalsy();
    });

    it("should remove the active class and call handleDeleteTechnology when we click on the 'Yes' button", () => {
      const deleteTechnologyMock = jest.fn();
      const { getByText, getByTestId } = renderComponent({ deleteTechnology: deleteTechnologyMock });

      fireEvent.click(getByText("Delete"));

      const confirmationContainer = getByTestId("technology-confirmation-container");
      fireEvent.click(getByText("Yes"));

      expect(confirmationContainer.classList.contains("active")).toBeFalsy();
      expect(deleteTechnologyMock).toHaveBeenCalledWith("testid");
    });
  });

  it("should display the edit technology form when we click on the Edit dropdown action", () => {
      const { getByText, queryByText, queryByDisplayValue } = renderComponent({});
      fireEvent.click(getByText("Edit"));

      expect(queryByText("TestJS")).not.toBeInTheDocument();
      expect(queryByText("Are you sure to delete 'TestJS'?")).not.toBeInTheDocument();

      expect(queryByDisplayValue("TestJS")).toBeInTheDocument();
  });

  it("should hide the edit technology form when we click on the cancel button", () => {
      const { getByText, queryByText, getByTestId, queryByDisplayValue } = renderComponent({});
      fireEvent.click(getByText("Edit"));

      fireEvent.click(getByTestId("technology-form-cancel-button"));

      expect(queryByText("TestJS")).toBeInTheDocument();
      expect(queryByText("Are you sure to delete 'TestJS'?")).toBeInTheDocument();

      expect(queryByDisplayValue("TestJS")).not.toBeInTheDocument();
  });

  describe("handleOnSubmit", () => {
    it("should call editTechnology and hide the edit technology form", async () => {
      const editTechnologyMock = jest.fn(() => Promise.resolve());
      const { getByText, getByTestId, queryByDisplayValue } = renderComponent({ editTechnology: editTechnologyMock });
      fireEvent.click(getByText("Edit"));

      const input = queryByDisplayValue("TestJS");
      fireEvent.change(input, { target: { value: "renamed technology" } });
      await act(async () => { fireEvent.click(getByTestId("technology-form-confirm-button")) });

      expect(editTechnologyMock).toHaveBeenCalledWith("testid", "renamed technology", "TestJS");
      expect(input).not.toBeInTheDocument();
    });

    it("should display an error message when the editTechnology function throws an error", async () => {
      const editTechnologyMock = jest.fn(() => Promise.reject(new Error("test error")));
      const { queryByText, getByText, getByTestId, queryByDisplayValue } = renderComponent({
        editTechnology: editTechnologyMock
      });
      fireEvent.click(getByText("Edit"));

      const input = queryByDisplayValue("TestJS");
      fireEvent.change(input, { target: { value: "renamed technology" } });
      await act(async () => { fireEvent.click(getByTestId("technology-form-confirm-button")) });

      expect(editTechnologyMock).toHaveBeenCalledWith("testid", "renamed technology", "TestJS");

      expect(queryByText("test error")).toBeInTheDocument();
    });
  });
});
