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

const PROJECTS_MOCK = [
  {
    _id: "testid",
    title: "test title",
    description: "test description",
    technologies: [
      { name: "technology 1" },
      { name: "technology 2" }
    ],
    images: ["test-1.jpg", "test-2.jpg"]
  },
  {
    _id: "testid2",
    title: "test title 2",
    description: "test description 2",
    technologies: [
      { name: "technology 1" },
      { name: "technology 2" }
    ],
    images: []
  }
];

describe("src/domain/Home/ProjectList", () => {
  it("should render correctly", () => {
    const props = {
      error: undefined,
      loading: false,
      data: {
        projects: {
          docs: PROJECTS_MOCK
        }
      }
    }

    render(<ProjectList {...props}/>);

    PROJECTS_MOCK.forEach(project => {
      expect(mockProjectCardComponent).toHaveBeenCalledWith(project);
    });

    expect(mockProjectCardComponent).toHaveBeenCalledTimes(2);
  });

  it("should display the loading state correctly", () => {
    const props = {
      error: undefined,
      loading: true,
      data: undefined
    }

    const { queryByTestId } = render(<ProjectList {...props}/>);

    expect(queryByTestId("loader-component")).toBeInTheDocument();
  });

  it("should display a message when there are no projects", () => {
    const props = {
      error: undefined,
      loading: false,
      data: {
        projects: { docs: [] }
      }
    }

    const { queryByText } = render(<ProjectList {...props}/>);

    expect(queryByText("There are no projects to display.")).toBeInTheDocument();
  });

  it("should display a message when there is an error", () => {
    const props = {
      error: new Error("test error") as any,
      loading: false,
      data: undefined
    }

    const { queryByText } = render(<ProjectList {...props}/>);

    expect(queryByText("There was an error trying to display the projects. Try it again later.")).toBeInTheDocument();
  });
});
