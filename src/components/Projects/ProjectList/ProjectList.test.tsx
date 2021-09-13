import React from "react";

import { render } from "@testing-library/react";

import ProjectList from "./ProjectList";

jest.mock("@/components/Loader", () => () => {
  return (
    <div data-testid="loader-component"></div>
  );
});

const mockProjectCardComponent = jest.fn();
jest.mock("./ProjectCard", () => ({ project }) => {
  mockProjectCardComponent(project);
  return null;
});

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

    render(<ProjectList projectsResult={projectsResult}/>);

    PROJECTS_MOCK.forEach(project => {
      expect(mockProjectCardComponent).toHaveBeenCalledWith(project);
    });

    expect(mockProjectCardComponent).toHaveBeenCalledTimes(2);
  });

  it("should display the loading state correctly", () => {
    const projectsResult = {
      loading: true
    } as any;

    const { queryByTestId } = render(<ProjectList projectsResult={projectsResult}/>);

    expect(queryByTestId("loader-component")).toBeInTheDocument();
  });

  it("should display a message when there are no projects", () => {
    const projectsResult = {
      data: {
        projects: { docs: [] }
      }
    } as any;

    const { queryByText } = render(<ProjectList projectsResult={projectsResult}/>);

    expect(queryByText("There are no projects to display.")).toBeInTheDocument();
  });

  it("should display a message when there is an error", () => {
    const projectsResult = {
      error: APOLLO_ERROR_MOCK,
    } as any;

    const { queryByText } = render(<ProjectList projectsResult={projectsResult}/>);

    expect(queryByText("There was an error trying to display the projects. Try it again later.")).toBeInTheDocument();
  });
});
