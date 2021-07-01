import React from "react";

import { render } from "@testing-library/react";

import ProjectsPage from "@/pages/projects/index";

jest.mock("@/domain/Projects", () => () => {
  return <div data-testid="projects"></div>;
});

describe("src/pages/projects/index", () => {
  it("should render correctly", () => {
    render(<ProjectsPage/>);
  });
});
