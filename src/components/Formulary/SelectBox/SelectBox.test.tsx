import React from "react";

import { render, fireEvent } from "@testing-library/react";

import SelectBox from "./SelectBox";

const AVAILABLE_VALUES_MOCK = [
  "test value 1", "test value 2", "test value 3"
];

describe("src/components/Formulary/SelectBox", () => {
  it("should render correctly", () => {
    const { queryByText } = render(
      <SelectBox
        label="test label"
        availableValues={AVAILABLE_VALUES_MOCK}
        currentValue=""
        setValue={jest.fn()}
      />
    );

    expect(queryByText("test label")).toBeInTheDocument();
  });

  it("should render the current value instead of the label", () => {
    const { queryByText } = render(
      <SelectBox
        label="test label"
        availableValues={AVAILABLE_VALUES_MOCK}
        currentValue="test value 3"
        setValue={jest.fn()}
      />
    );

    expect(queryByText("test value 3")).toBeInTheDocument();
  });

  it("should render all the available values when the SelectBox is active", () => {
    const { queryByText, getByText } = render(
      <SelectBox
        label="test label"
        availableValues={AVAILABLE_VALUES_MOCK}
        currentValue=""
        setValue={jest.fn()}
      />
    );

    fireEvent.click(getByText("test label"));

    AVAILABLE_VALUES_MOCK.forEach(value => {
      expect(queryByText(value)).toBeInTheDocument();
    });
  });

  it("should call the setValue when we select a value", () => {
    const setValueMock = jest.fn();

    const { getByText } = render(
      <SelectBox
        label="test label"
        availableValues={AVAILABLE_VALUES_MOCK}
        currentValue=""
        setValue={setValueMock}
      />
    );
    
    fireEvent.click(getByText("test label"));
    fireEvent.click(getByText("test value 2"));

    expect(setValueMock).toHaveBeenCalledWith("test value 2");
  });

  it("should deactivate the SelectBox when we select a value", () => {
    const { queryByText, getByText } = render(
      <SelectBox
        label="test label"
        availableValues={AVAILABLE_VALUES_MOCK}
        currentValue=""
        setValue={jest.fn()}
      />
    );
    
    fireEvent.click(getByText("test label"));
    fireEvent.click(getByText("test value 2"));

    expect(queryByText("test value 1")).not.toBeInTheDocument();
    expect(queryByText("test value 3")).not.toBeInTheDocument();
  });
});
