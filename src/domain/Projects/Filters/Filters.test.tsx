import React from "react";

import { render, fireEvent, queryByText } from "@testing-library/react";

import Filters from "./Filters";

const TECHNOLOGIES_MOCK = [
  { name: "technology 1" }, 
  { name: "technology 2" },
  { name: "technology 3" }
];

const TECHNOLOGY_RESULT_MOCK = {
  data: {
    technologies: TECHNOLOGIES_MOCK
  }
} as any;

describe("src/domain/Projects/Filters", () => {
  it("should render correctly", () => {
    const { queryByText, getByText, getByDisplayValue } = render(
      <Filters
        technologiesResult={TECHNOLOGY_RESULT_MOCK}
        handleOnSubmit={jest.fn()}
        selectedTechnology=""
        setSelectedTechnology={jest.fn()}
        search="test search"
        setSearch={jest.fn()}
      />
    );

    // Active the SelectBox
    const selectBoxButton = getByText("Select a technology");

    fireEvent.click(selectBoxButton);

    TECHNOLOGIES_MOCK.forEach(technology => {
      expect(queryByText(technology.name)).toBeInTheDocument();
    });

    expect(getByDisplayValue("test search")).toBeInTheDocument();
  });

  it("should call setSelectedTechnology function", () => {
    const setSelectedTechnologyMock = jest.fn();

    const { getByText } = render(
      <Filters
        technologiesResult={TECHNOLOGY_RESULT_MOCK}
        handleOnSubmit={jest.fn()}
        selectedTechnology=""
        setSelectedTechnology={setSelectedTechnologyMock}
        search="test search"
        setSearch={jest.fn()}
      />
    );

    const selectBoxButton = getByText("Select a technology");

    fireEvent.click(selectBoxButton);

    fireEvent.click(getByText("technology 3"));

    expect(setSelectedTechnologyMock).toHaveBeenCalledWith("technology 3");
  });

  it("should call setSearch function", () => {
    const setSearchMock = jest.fn();

    const { getByDisplayValue } = render(
      <Filters
        technologiesResult={TECHNOLOGY_RESULT_MOCK}
        handleOnSubmit={jest.fn()}
        selectedTechnology=""
        setSelectedTechnology={jest.fn()}
        search="test search"
        setSearch={setSearchMock}
      />
    );

    const searchInput = getByDisplayValue("test search");
    fireEvent.change(searchInput, { target: { value: "this is a new value" } });

    expect(setSearchMock).toHaveBeenCalledWith("this is a new value");
  });

  it("should call handleOnSubmit", () => {
    const handleOnSubmitMock = jest.fn();

    const { getByTestId } = render(
      <Filters
        technologiesResult={TECHNOLOGY_RESULT_MOCK}
        handleOnSubmit={handleOnSubmitMock}
        selectedTechnology=""
        setSelectedTechnology={jest.fn()}
        search="test search"
        setSearch={jest.fn()}
      />
    );

    fireEvent.submit(getByTestId("filters-form"));

    expect(handleOnSubmitMock).toHaveBeenCalled();
  });
});
