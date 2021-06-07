import React from "react";

import { render, fireEvent } from "@testing-library/react";

import Input from "./Input";

describe("src/components/Formulary/Input", () => {
  it("should render correctly", () => {
    const { queryByText, getByDisplayValue } = render(
      <Input prefix="test" label="Test Label" value="test value" setValue={jest.fn()} />
    );

    expect(queryByText("Test Label")).toBeInTheDocument();

    const input = getByDisplayValue("test value");
    expect(input.id).toBe("test-input");
  });

  it("should call the setValue function", () => {
    const setValueMock = jest.fn();

    const { getByDisplayValue } = render(
      <Input prefix="test" label="Test Label" value="test value" setValue={setValueMock} />
    );

    const input = getByDisplayValue("test value");
    fireEvent.change(input, { target: { value: "updated test value" } });

    expect(setValueMock).toHaveBeenCalledWith("updated test value");
  });

  it("should display an error with a custom validator", () => {
    const validator = (value: string) => value === "updated test value" ? "test error" : "";

    const { queryByText, getByDisplayValue } = render(
      <Input prefix="test" label="Test Label" value="test value" setValue={jest.fn()} validator={validator} />
    );

    expect(queryByText("test error")).not.toBeInTheDocument();

    fireEvent.change(getByDisplayValue("test value"), { target: { value: "updated test value" } });

    expect(queryByText("test error")).toBeInTheDocument();
  });
});
