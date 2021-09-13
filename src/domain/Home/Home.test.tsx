import React from "react";

import { render } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import Home from "./Home";

const mockProjectListComponent = jest.fn();

jest.mock("@/components/Projects/ProjectList", () => ({ projectsResult }) => {
  mockProjectListComponent(projectsResult);
  return null;
});

const PROJECT_RESULT_MOCK = {
  error: null,
  data: {
    projects: {
      docs: [
        {
          _id: "testid",
          title: "test title",
          description: "test description",
          images: ["test-1.jpg", "test-2.jpg"],
          technologies: [
            { name: "technology 1" },
            { name: "technology 2" },
            { name: "technology 3" }
          ]
        }
      ]
    }
  }
} as any;

describe("src/domain/Home", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render correctly", () => {
    render(
      <MockedProvider>
        <Home projectsResult={PROJECT_RESULT_MOCK}/>
      </MockedProvider>
    );

    expect(mockProjectListComponent).toHaveBeenCalledWith(PROJECT_RESULT_MOCK);
  });
});
