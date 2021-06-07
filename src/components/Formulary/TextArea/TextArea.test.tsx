import React from "react";

import { render, fireEvent } from "@testing-library/react";

import TextArea from "./TextArea";

describe("src/components/Formulary/TextArea", () => {
  it("should render correctly", () => {
    const { queryByText, getByDisplayValue } = render(
      <TextArea prefix="test" label="Test Label" value="test value" setValue={jest.fn()} />
    );

    expect(queryByText("Test Label")).not.toBeNull();

    const textarea = getByDisplayValue("test value");
    expect(textarea.id).toBe("test-textarea");
  });

  it("should call the setValue function", () => {
    const setValueMock = jest.fn();

    const { getByDisplayValue } = render(
      <TextArea prefix="test" label="Test Label" value="test value" setValue={setValueMock} />
    );

    const textarea = getByDisplayValue("test value");
    fireEvent.change(textarea, { target: { value: "updated test value" } });

    expect(setValueMock).toHaveBeenCalledWith("updated test value");
  });

  it("should display an error with a custom validator", () => {
    const validator = (value: string) => value === "updated test value" ? "test error" : "";

    const { queryByText, getByDisplayValue } = render(
      <TextArea prefix="test" label="Test Label" value="test value" setValue={jest.fn()} validator={validator} />
    );

    expect(queryByText("test error")).toBeNull();

    fireEvent.change(getByDisplayValue("test value"), { target: { value: "updated test value" } });

    expect(queryByText("test error")).not.toBeNull();
  });
});
