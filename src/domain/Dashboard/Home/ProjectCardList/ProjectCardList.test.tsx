import React from "react";

import { render } from "@testing-library/react";

import ProjectCardList from "./ProjectCardList";

const PROJECTS_MOCK = [
  {
    _id: "test-id-1",
    title: "test 1",
    images:  ["test-1-1.jpg", "test-1-2.jpg"]
  },
  {
    _id: "test-id-2",
    title: "test 2",
    images:  ["test-2-1.jpg", "test-2-2.jpg"]
  },
  {
    _id: "test-id-3",
    title: "test 3",
    images:  ["test-3-1.jpg", "test-3-2.jpg"]
  }
];

const QUERY_RESULT_MOCK = {
  data: {
    projects: {
      docs: PROJECTS_MOCK
    }
  },
  loading: false,
  error: null
} as any;

describe("src/domain/Dashboard/Home/ProjectCardList", () => {
  it("should render correctly", () => {
    const { queryByText, getAllByTestId, getAllByText } = render(<ProjectCardList queryResult={QUERY_RESULT_MOCK}/>);

    PROJECTS_MOCK.forEach((project, index) => {
      expect(queryByText(project.title)).toBeInTheDocument();

      const link = getAllByText("Edit")[index] as HTMLAnchorElement;
      expect(link.href).toMatch(`/dashboard/project/${project._id}/edit`);
    });

    const images = getAllByTestId("image-carousel-image");
    expect(images).toHaveLength(6);
  });

  it("should render the loader component", () => {
    const queryResult = {
      ...QUERY_RESULT_MOCK,
      loading: true
    }
    const { queryByTestId } = render(<ProjectCardList queryResult={queryResult}/>);

    expect(queryByTestId("loader-component")).toBeInTheDocument();
  });

  it("should render the error message", () => {
    const queryResult = {
      ...QUERY_RESULT_MOCK,
      error: "error"
    }
    const { queryByText } = render(<ProjectCardList queryResult={queryResult}/>);

    expect(queryByText("There was an error trying to display the projects. Try it again later.")).toBeInTheDocument();
  });
});
