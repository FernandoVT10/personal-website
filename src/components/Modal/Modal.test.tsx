import React, { useRef } from "react";

import { render, fireEvent } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import Modal from "./Modal";

jest.mock("react", () => {
  const originalReact = jest.requireActual("react");

  return {
    ...originalReact,
    useRef: jest.fn()
  }
});

const useRefMocked = mocked(useRef);

const renderComponent = (props: {[key: string]: any}) => {
  return render(
    <Modal {...props as any}>
      <p>test content</p>
    </Modal>
  );
}

describe("src/components/Modal", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    useRefMocked.mockReturnValueOnce({
      set current(_: any) {},
      get current() {
        return {
          scroll: jest.fn()
        }
      }
    });
  });

  it("should render when the isActive prop is equal to true", () => {
    const { queryByText } = renderComponent({ isActive: true });
    expect(queryByText("test content")).toBeInTheDocument();
  });

  it("shouldn't render when the isActive prop is equal to false", () => {
    const { queryByText } = renderComponent({ isActive: false });
    expect(queryByText("test content")).not.toBeInTheDocument();
  });

  describe("useEffect", () => {
    it("should set the body overflow to hidden when the isActive prop is equal to true", () => {
      renderComponent({ isActive: true });
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should set the body overflow to auto when the isActive prop is equal to false", () => {
      renderComponent({ isActive: false });
      expect(document.body.style.overflow).toBe("auto");
    });

    it("should call the modalDiv scroll method when the isActive props is equal to true", () => {
      const scrollMock = jest.fn();

      useRefMocked.mockReset();
      useRefMocked.mockReturnValueOnce({
        set current(_: any) {},
        get current() {
          return {
            scroll: scrollMock
          }
        }
      });

      renderComponent({ isActive: true });
      expect(scrollMock).toHaveBeenCalledWith(0, 0);
    });
  });

  it("should call setIsActive with false when we click on the close button", () => {
    const setIsActiveMock = jest.fn();
    const { getByTestId } = renderComponent({ isActive: true, setIsActive: setIsActiveMock });

    fireEvent.click(getByTestId("modal-close-button"));
    expect(setIsActiveMock).toHaveBeenCalledWith(false);
  });

  it("should call setIsActive with false when we click on the modal", () => {
    const setIsActiveMock = jest.fn();
    const { getByTestId } = renderComponent({ isActive: true, setIsActive: setIsActiveMock });

    const modal = getByTestId("modal-close-button").parentElement;
    fireEvent.click(modal);
    expect(setIsActiveMock).toHaveBeenCalledWith(false);
  });

  it("shouldn't call setIsActive when we click on the content container", () => {
    const setIsActiveMock = jest.fn();
    const { getByText } = renderComponent({ isActive: true, setIsActive: setIsActiveMock });

    const contentContainer = getByText("test content").parentElement;
    fireEvent.click(contentContainer);
    expect(setIsActiveMock).not.toHaveBeenCalled();
  });
});
