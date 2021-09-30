import React from "react";

import { render } from "@testing-library/react";

import Project from "./Project";

const carouselComponentMock = jest.fn();
jest.mock("@/components/Carousel", () => ({ images }) => {
  carouselComponentMock(images);
  return null;
});

const errorPageComponentMock = jest.fn();
jest.mock("@/components/ErrorPage", () => (props: any) => {
  errorPageComponentMock(props);
  return null;
});

jest.mock("@/components/MarkDown", () => ({ content }) => content);

const relatedProjectsComponentMock = jest.fn();
jest.mock("./RelatedProjects", () => ({ relatedProjects }) => {
  relatedProjectsComponentMock(relatedProjects);
  return null;
});

const PROJECT_MOCK = {
  title: "test title",
  images: ["test-1.jpg", "test-2.jpg"],
  content: "Markdown title",
  technologies: [
    { name: "technology 1" },
    { name: "technology 2" },
    { name: "technology 3" }
  ]
}

const RELATED_PROJECTS_MOCK = [
  {
    _id: "test-id-1",
    title: "test title 1",
    images: ["test-1-1.jpg", "test-1-2.jpg"]
  },
  {
    _id: "test-id-2",
    title: "test title 2",
    images: ["test-2-1.jpg", "test-2-2.jpg"]
  }
];

describe("src/domain/Project", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render correctly", () => {
    const { queryByText } = render(
      <Project project={PROJECT_MOCK} relatedProjects={RELATED_PROJECTS_MOCK} error={false}/>
    );

    // Project
    expect(queryByText("test title")).toBeInTheDocument();
    expect(carouselComponentMock).toHaveBeenCalledWith(PROJECT_MOCK.images);
    expect(queryByText(PROJECT_MOCK.content)).toBeInTheDocument();
    PROJECT_MOCK.technologies.forEach(technology => {
      expect(queryByText(technology.name)).toBeInTheDocument();
    });

    expect(relatedProjectsComponentMock).toHaveBeenCalledWith(RELATED_PROJECTS_MOCK);
  });

  it("should render error message", () => {
    render(
      <Project project={PROJECT_MOCK} relatedProjects={RELATED_PROJECTS_MOCK} error={true}/>
    );

    expect(errorPageComponentMock).toHaveBeenCalledWith({ statusCode: "404", error: "Project not found" });
  });

  it("shouldn't render the relatedProjects component when there're not relatedProjects", () => {
    render(
      <Project project={PROJECT_MOCK} relatedProjects={[]} error={false}/>
    );

    expect(relatedProjectsComponentMock).not.toHaveBeenCalled();
  });

  it("should add the fullWidth class to the project container when there're not relatedProjects", () => {
    const { getByTestId } = render(
      <Project project={PROJECT_MOCK} relatedProjects={[]} error={false}/>
    );

    const projectContainer = getByTestId("project-container");
    expect(projectContainer.classList.contains("fullWidth")).toBeTruthy();
  });
});
