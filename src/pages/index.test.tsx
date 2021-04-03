import React from "react";

import { render } from "@testing-library/react";

import Home from "./";

describe("@/pages/index", () => {
  it("should ", () => {
    const { queryByText } = render(<Home/>);

    expect(queryByText("Next.js!")).toBeInTheDocument();
  });
});
