import React from "react";

import { render } from "@testing-library/react";

import ProjectList from "./ProjectList";

const APOLLO_ERROR_MOCK = {
  graphQLErrors: [{ message: "test error message" }]
}

const PROJECTS_MOCK = [
  {
    _id: "testid",
    title: "test title",
    description: "test description",
    images: ["test-1.jpg", "test-2.jpg"]
  },
  {
    _id: "testid2",
    title: "test title 2",
    description: "test description 2",
    images: []
  }
];

describe("src/domain/Home/ProjectList", () => {
  it("should render correctly", () => {
    const projectsResult = {
      data: {
        projects: {
          docs: PROJECTS_MOCK
        }
      }
    } as any;

    const { queryByText } = render(<ProjectList projectsResult={projectsResult}/>);

    PROJECTS_MOCK.forEach(project => {
      expect(queryByText(project.title)).toBeInTheDocument();
      expect(queryByText(project.description)).toBeInTheDocument();
    });
  });

  it("should display a message when there are no projects", () => {
    const projectsResult = {
      error: APOLLO_ERROR_MOCK,
      data: null
    } as any;

    const { queryByText } = render(<ProjectList projectsResult={projectsResult}/>);

    expect(queryByText("test error message")).toBeInTheDocument();
  });

  it("should display an error correctly", () => {
    const projectsResult = {
      error: null,
      data: {
        projects: {
          docs: []
        }
      }
    } as any;

    const { queryByText } = render(<ProjectList projectsResult={projectsResult}/>);

    expect(queryByText("There are not projects to display.")).toBeInTheDocument();
  });
});
