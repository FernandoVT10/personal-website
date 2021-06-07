import React from "react";

import { render } from "@testing-library/react";

import MessageCard from "../MessageCard";

describe("src/components/MessageCard", () => {
  it("should render correctly", () => {
    const { queryByText, container } = render(<MessageCard type="test" message="test message"/>);

    expect(container.children[0].classList.contains("test")).toBeTruthy();

    expect(queryByText("test message")).not.toBeNull();
  });
});
