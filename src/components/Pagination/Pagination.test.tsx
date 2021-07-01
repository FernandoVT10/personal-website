import React from "react";

import { render, fireEvent } from "@testing-library/react";

import Pagination from "./Pagination";

const MOCK_DATA = {
  totalPages: 1024,
  page: 999,
  hasPrevPage: true,
  prevPage: 998,
  hasNextPage: true,
  nextPage: 1000
}

const createRange = (start: number, end: number) => {
  const result = [];
  for(let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}


describe("src/components/Pagination", () => {
  it("should render correctly", () => {
    const { queryByText, getByTestId } = render(<Pagination data={MOCK_DATA}/>);

    const pages = createRange(996, 1002);
    pages.forEach(page => {
      expect(queryByText(page)).toBeInTheDocument();
    });

    const leftButton = getByTestId("pagination-left-button") as HTMLButtonElement;
    expect(leftButton.disabled).toBeFalsy();

    const rightButton = getByTestId("pagination-right-button") as HTMLButtonElement;
    expect(rightButton.disabled).toBeFalsy();
  });

  it("should call router.push with the page number 996", () => {
    const routerPushMock = jest.fn();
    changeRouterProperties({ push: routerPushMock });

    const { getByText } = render(<Pagination data={MOCK_DATA}/>);

    fireEvent.click(getByText("996"));

    expect(routerPushMock).toHaveBeenCalledWith({
      query: { page: 996 },
      pathname: "/test/",
    });
  });

  it("should keep the query parameters when we change the page", () => {
    const routerPushMock = jest.fn();
    changeRouterProperties({
      query: {
        test: "test value"
      },
      push: routerPushMock
    });

    const { getByText } = render(<Pagination data={MOCK_DATA}/>);

    fireEvent.click(getByText("996"));

    expect(routerPushMock).toHaveBeenCalledWith({
      query: {
        test: "test value",
        page: 996
      },
      pathname: "/test/",
    });
  });

  describe("left arrow button", () => {
    it("should set disabled to true when there's no previous page", () => {
      const data = {
        ...MOCK_DATA,
        hasPrevPage: false
      }

      const { getByTestId } = render(<Pagination data={data}/>);

      const leftButton = getByTestId("pagination-left-button") as HTMLButtonElement;
      expect(leftButton.disabled).toBeTruthy();
    });

    it("should call router.push with the previous page", () => {
      const routerPushMock = jest.fn();
      changeRouterProperties({ push: routerPushMock });

      const { getByTestId } = render(<Pagination data={MOCK_DATA}/>);

      fireEvent.click(getByTestId("pagination-left-button"));

      expect(routerPushMock).toHaveBeenCalledWith({
        query: { page: 998 },
        pathname: "/test/",
      });
    });
  });

  describe("right arrow button", () => {
    it("should set disabled to true when there's no next page", () => {
      const data = {
        ...MOCK_DATA,
        hasNextPage: false
      }

      const { getByTestId } = render(<Pagination data={data}/>);

      const rightButton = getByTestId("pagination-right-button") as HTMLButtonElement;
      expect(rightButton.disabled).toBeTruthy();
    });

    it("should call router.push with the next page", () => {
      const routerPushMock = jest.fn();
      changeRouterProperties({ push: routerPushMock });

      const { getByTestId } = render(<Pagination data={MOCK_DATA}/>);

      fireEvent.click(getByTestId("pagination-right-button"));

      expect(routerPushMock).toHaveBeenCalledWith({
        query: { page: 1000 },
        pathname: "/test/",
      });
    });
  });
});
