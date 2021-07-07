import React from "react";

import { render } from "@testing-library/react";

import Project from "./Project";

const PROJECT_MOCK = {
  title: "test title",
  images: ["test-1.jpg", "test-2.jpg"],
  content: "# Markdown title",
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
  it("should render correctly", () => {
    const { queryByText, getAllByTestId } = render(
      <Project project={PROJECT_MOCK} relatedProjects={RELATED_PROJECTS_MOCK} error={false}/>
    );
    // Project
    expect(queryByText("test title")).toBeInTheDocument();

    const carouselImages = getAllByTestId("image-carousel-image");
    PROJECT_MOCK.images.forEach((image, index) => {
      expect(carouselImages[index].style.background).toBe(`url(${image})`);
    });

    expect(queryByText("Markdown title")).toBeInTheDocument();

    PROJECT_MOCK.technologies.forEach(technology => {
      expect(queryByText(technology.name)).toBeInTheDocument();
    });

    // Related Projects
    RELATED_PROJECTS_MOCK.forEach(relatedProject => {
      expect(queryByText(relatedProject.title)).toBeInTheDocument();
    });
  });

  it("should render error message", () => {
    const { queryByText } = render(
      <Project project={PROJECT_MOCK} relatedProjects={RELATED_PROJECTS_MOCK} error={true}/>
    );

    expect(queryByText("404")).toBeInTheDocument();
    expect(queryByText("Project not found")).toBeInTheDocument();
  });
});
