import React from "react";

import { render } from "@testing-library/react";

import ErrorPage from "./ErrorPage";

describe("src/components/ErrorPage", () => {
  it("should render correctly", () => {
    const { queryByText } = render(<ErrorPage statusCode="500" error="test error" />);

    expect(queryByText("500")).toBeInTheDocument();
    expect(queryByText("test error")).toBeInTheDocument();

    expect(queryByText("Go to home")).toBeInTheDocument();
  });
});
