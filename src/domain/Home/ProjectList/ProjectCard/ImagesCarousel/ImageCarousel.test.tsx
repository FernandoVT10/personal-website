import React from "react";

import { render, fireEvent } from "@testing-library/react";

import ImagesCarousel from "./ImagesCarousel";

const IMAGES_MOCK = [
  "test-1.jpg",
  "test-2.jpg",
  "test-3.jpg"
];

describe("src/domain/Home/ProjectList/ProjectCard/ImagesCarousel", () => {
  it("should render correctly", () => {
    const { queryAllByTestId } = render(<ImagesCarousel images={IMAGES_MOCK}/>);

    const images = queryAllByTestId("image-carousel-image");

    expect(images).toHaveLength(3);
    expect(images[0].style.left).toBe("0%");
    expect(images[1].style.left).toBe("100%");
    expect(images[2].style.left).toBe("200%");

    expect(queryAllByTestId("image-carousel-indicator")).toHaveLength(3);
  });

  it("should change the carousel image with the right button", () => {
    const { queryAllByTestId, getByTestId } = render(<ImagesCarousel images={IMAGES_MOCK}/>);

    fireEvent.click(getByTestId("image-carousel-right-button"));

    const images = queryAllByTestId("image-carousel-image");
    expect(images[0].style.left).toBe("-100%");
    expect(images[1].style.left).toBe("0%");
    expect(images[2].style.left).toBe("100%");
  });

  it("should change the carousel image with the left button", () => {
    const { queryAllByTestId, getByTestId } = render(<ImagesCarousel images={IMAGES_MOCK}/>);

    fireEvent.click(getByTestId("image-carousel-left-button"));

    const images = queryAllByTestId("image-carousel-image");
    expect(images[0].style.left).toBe("-200%");
    expect(images[1].style.left).toBe("-100%");
    expect(images[2].style.left).toBe("0%");
  });

  it("should change the carousel image with the indicators", () => {
    const { queryAllByTestId, getAllByTestId } = render(<ImagesCarousel images={IMAGES_MOCK}/>);

    const indicators = getAllByTestId("image-carousel-indicator");

    fireEvent.click(indicators[1]);

    const images = queryAllByTestId("image-carousel-image");
    expect(images[0].style.left).toBe("-100%");
    expect(images[1].style.left).toBe("0%");
    expect(images[2].style.left).toBe("100%");
  });
});
