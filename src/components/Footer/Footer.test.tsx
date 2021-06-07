import React from "react";

import { render } from "@testing-library/react";

import Footer from "./Footer";

describe("src/components/Footer", () => {
  it("should render correctly", () => {
    const { queryByText } = render(<Footer/>);

    expect(queryByText("Fernando Vaca Tamayo")).not.toBeNull();
  });
});
