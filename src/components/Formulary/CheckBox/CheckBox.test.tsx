import React from "react";

import { render, fireEvent } from "@testing-library/react";

import CheckBox from "./CheckBox";

describe("src/components/Formulary/CheckBox", () => {
  it("should call setIsActive when we click on the checkbox", () => {
    const setIsActiveMock = jest.fn();

    const { getByLabelText } = render(
      <CheckBox label="test" prefix="test" isActive={true} setIsActive={setIsActiveMock}/>
    );

    const checkbox = getByLabelText("test") as HTMLInputElement;
    expect(checkbox.checked).toBeTruthy();

    fireEvent.click(checkbox);

    expect(setIsActiveMock).toHaveBeenCalledWith(false);
  });
});
