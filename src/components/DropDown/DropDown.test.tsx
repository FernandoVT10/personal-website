import React from "react";

import { render, fireEvent, act } from "@testing-library/react";

import DropDown from "./DropDown";

const ACTIONS_MOCK = [
  { name: "first action", handle: jest.fn() },
  { name: "second action", handle: jest.fn() },
  { name: "third action", handle: jest.fn() }
]; 

const addEventListenerSpy = jest.spyOn(window, "addEventListener");
const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

const renderComponent = (actions = ACTIONS_MOCK) => {
  return render(
    <DropDown actions={actions}>
      <p>children</p>
    </DropDown>
  );
}

const getHandleMouseUpFunction = () => {
  let handleMouseUpFunction: Function;

  addEventListenerSpy.mock.calls.forEach(call => {
    const [eventName, handler] = call;

    if(eventName === "mouseup") {
      handleMouseUpFunction = handler as Function;
    }
  });

  return handleMouseUpFunction;
}


describe("src/components/DropDown/DropDown", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render correctly", () => {
    const { queryByText } = renderComponent();

    ACTIONS_MOCK.forEach(action => {
      expect(queryByText(action.name)).toBeInTheDocument();
    });

    expect(queryByText("children")).toBeInTheDocument();
  });

  it("should call the handlers of the actions when we click on them", () => {
    const actions = [
      { name: "test action", handle: jest.fn() },
      { name: "test action 2", handle: jest.fn() }
    ];

    const { getByText } = renderComponent(actions);

    actions.forEach(action => {
      fireEvent.click(getByText(action.name));
      expect(action.handle).toHaveBeenCalled();
    });
  });

  it("should add the active class to the dropdown when we click on the children", () => {
    const { getByTestId, getByText } = renderComponent();

    const dropdown = getByTestId("dropdown");
    expect(dropdown.classList.contains("active")).toBeFalsy();

    fireEvent.click(getByText("children"));
    expect(dropdown.classList.contains("active")).toBeTruthy();
  });

  it("should remove the active class to the dropdown when we click in an action", () => {
    const { getByTestId, getByText } = renderComponent();

    const dropdown = getByTestId("dropdown");
    fireEvent.click(getByText("children"));

    expect(dropdown.classList.contains("active")).toBeTruthy();

    fireEvent.click(getByText("first action"));

    expect(dropdown.classList.contains("active")).toBeFalsy();
  });

  describe("useEffect", () => {
    it("should add a mouseup listener to the window", () => {
      renderComponent();
      expect(addEventListenerSpy).toHaveBeenCalledWith("mouseup", expect.any(Function));
    });

    it("should remove the mouseup listener to the window when we unmount the component", () => {
      const { unmount } = renderComponent();
      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith("mouseup", expect.any(Function));
    });
  });

  describe("handleMouseUp", () => {
    it("should remove the active class to the dropdown when we click outside of the dropdown", () => {
      const { getByTestId, getByText } = renderComponent();

      const handleMouseUpFunction = getHandleMouseUpFunction();

      const dropdown = getByTestId("dropdown");
      fireEvent.click(getByText("children"));

      const target = document.createElement("div");
      act(() => handleMouseUpFunction({ target }));

      expect(dropdown.classList.contains("active")).toBeFalsy();
    });
  });
});
