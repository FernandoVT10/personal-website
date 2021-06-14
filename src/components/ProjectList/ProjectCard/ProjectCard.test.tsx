import React from "react";

import { render } from "@testing-library/react";

import ProjectCard from "./ProjectCard";

jest.mock("./ImagesCarousel", () => ({ images }: { images: string[] }) => {
  return (
    <div>
      {images.map((image, index) => {
        return <span key={index}>{image}</span>;
      })}
    </div>
  );
});

const PROJECT_MOCK = {
  _id: "testid",
  title: "test title",
  description: "test description",
  images: ["test-1.jpg", "test-2.jpg"]
}

describe("src/domain/Home/ProjectList/ProjectCard", () => {
  it("should render correctly", () => {
    const { queryByText, getByText } = render(<ProjectCard project={PROJECT_MOCK}/>);

    expect(queryByText("test title")).toBeInTheDocument();
    expect(queryByText("test description")).toBeInTheDocument();

    PROJECT_MOCK.images.forEach(image => {
      expect(queryByText(image)).toBeInTheDocument();
    });

    const link = getByText("See More") as HTMLLinkElement;
    expect(link.href).toMatch("testid");
  });
});
