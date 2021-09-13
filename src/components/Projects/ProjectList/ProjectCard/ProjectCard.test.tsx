import React from "react";

import { render } from "@testing-library/react";

import ProjectCard from "./ProjectCard";

const mockCarouselComponent = jest.fn();

jest.mock("@/components/Carousel", () => ({ images }: { images }) => {
  mockCarouselComponent(images);

  return null;
});

const PROJECT_MOCK = {
  _id: "testid",
  title: "test title",
  description: "test description",
  images: ["test-1.jpg", "test-2.jpg"],
  technologies: [
    { name: "technology-1" },
    { name: "technology-2" },
    { name: "technology-3" }
  ]
}

describe("src/domain/Home/ProjectList/ProjectCard", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render correctly", () => {
    const { queryByText, getByText } = render(<ProjectCard project={PROJECT_MOCK}/>);

    expect(queryByText("test title")).toBeInTheDocument();

    PROJECT_MOCK.technologies.forEach(({ name }) => {
      const technology = getByText(name) as HTMLAnchorElement;
      expect(technology.href).toMatch(`projects?technology=${name}`);
    });

    expect(queryByText("test description")).toBeInTheDocument();

    expect(mockCarouselComponent).toHaveBeenCalledWith(PROJECT_MOCK.images);

    const link = getByText("See More") as HTMLLinkElement;
    expect(link.href).toMatch("testid");
  });

  it("shouldn't render the technologies container when there aren't technologies", () => {
    const project = {
      ...PROJECT_MOCK,
      technologies: []
    }

    const { queryByTestId } = render(<ProjectCard project={project}/>);

    expect(queryByTestId("technologies-container")).not.toBeInTheDocument();
  });
});
