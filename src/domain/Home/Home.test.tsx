import React from "react";

import { render } from "@testing-library/react";

import Home from "./Home";

jest.mock("./ContactMe", () => () => null);

const mockProjectListComponent = jest.fn();
jest.mock("@/components/Projects/ProjectList", () => (props: any) => {
  mockProjectListComponent(props);
  return null;
});

const PROJECT_RESULT_MOCK = {
  error: null,
  data: "test data",
  loading: false
} as any;

describe("src/domain/Home", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render correctly", () => {
    render(<Home projectsResult={PROJECT_RESULT_MOCK}/>);

    expect(mockProjectListComponent).toHaveBeenCalledWith(PROJECT_RESULT_MOCK);
  });
});
