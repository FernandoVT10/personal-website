import React from "react";

import { render } from "@testing-library/react";

import Loader from "./Loader";

describe("src/components/Loader", () => {
  it("should render correctly", () => {
    render(<Loader/>);
  });
});
