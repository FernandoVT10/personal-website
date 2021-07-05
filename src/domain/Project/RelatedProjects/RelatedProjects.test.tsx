import React from "react";

import { render } from "@testing-library/react";

import RelatedProjects from "./RelatedProjects";

const RELATED_PROJECTS_MOCK = [
  {
    _id: "testid1",
    title: "test title 1",
    images: ["test-1-1.jpg", "test-1-2.jpg"]
  },
  {
    _id: "testid2",
    title: "test title 2",
    images: ["test-2-1.jpg", "test-2-2.jpg"]
  }
];

describe("src/domain/Project/RelatedProjects", () => {
  it("should render correctly", () => {
    const { getAllByAltText, getByText } = render(<RelatedProjects relatedProjects={RELATED_PROJECTS_MOCK}/>);

    const images = getAllByAltText("Related Project Image") as HTMLImageElement[];
    expect(images[0].src).toMatch("test-1-1.jpg");
    expect(images[1].src).toMatch("test-2-1.jpg");

    const title1 = getByText("test title 1") as HTMLAnchorElement;
    expect(title1.href).toMatch("/projects/testid1");

    const title2 = getByText("test title 2") as HTMLAnchorElement;
    expect(title2.href).toMatch("/projects/testid2");
  });
});
