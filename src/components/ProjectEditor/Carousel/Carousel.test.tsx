import React from "react";

import { render, fireEvent, act, waitFor } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import getImageURLs from "@/utils/getImageURLs";

import Carousel from "./Carousel";

jest.mock("@/utils/getImageURLs");

const IMAGES_MOCK = [
  "test-1.jpg",
  "test-2.jpg",
  "test-3.jpg"
];

const FILES_MOCK = [
  new File([], "new-image-1",  { type: "image/jpg" }),
  new File([], "new-image-2",  { type: "image/jpg" }),
  new File([], "new-image-3",  { type: "image/jpg" })
];

const FILE_LIST_MOCK = {
  item: (index: number) => FILES_MOCK[index],
  length: FILES_MOCK.length
}

const getImageURLsMocked = mocked(getImageURLs);

describe("src/components/ProjectEditor/Carousel", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    getImageURLsMocked.mockImplementation((files) => Promise.resolve(
      files.map(file => `${file.name}.jpg`)
    ));
  });

  it("should render correctly", () => {
    const { getByAltText, getAllByAltText, queryByTestId } = render(
      <Carousel images={IMAGES_MOCK} setNewImages={jest.fn()} setImagesToDelete={jest.fn()}/>
    );

    expect(queryByTestId("carousel-add-image-button")).not.toBeInTheDocument();

    const previewImage = getByAltText("Preview Image") as HTMLImageElement;
    expect(previewImage.src).toMatch("test-1.jpg");

    const images = getAllByAltText("Image List Image") as HTMLImageElement[];

    IMAGES_MOCK.forEach((image, index) => {
      expect(images[index].src).toMatch(image);
    });
  });

  it("should render the add image button instead of previewImage when there's no images to display", () => {
    const { queryByAltText, queryByTestId } = render(
      <Carousel images={[]} setNewImages={jest.fn()} setImagesToDelete={jest.fn()}/>
    );

    expect(queryByAltText("Preview Image")).not.toBeInTheDocument();

    expect(queryByTestId("carousel-add-image-button")).toBeInTheDocument();
  });

  describe("addImages", () => {
    it("should add the images with the input file", async () => {
      const setNewImagesMock = jest.fn();

      const { getByTestId, getAllByAltText } = render(
        <Carousel images={IMAGES_MOCK} setNewImages={setNewImagesMock} setImagesToDelete={jest.fn()}/>
      );

      const inputFile = getByTestId("carousel-input-file");
      await act(async () => {
        fireEvent.change(inputFile, { target: { files: FILE_LIST_MOCK } })
      });

      expect(getImageURLs).toHaveBeenCalledWith(FILES_MOCK);

      const setNewImagesFunction = setNewImagesMock.mock.calls[0][0];
      expect(setNewImagesFunction([])).toEqual(
        FILES_MOCK.map((file, index) => ({
          fileId: index,
          file
        }))
      );

      const images = getAllByAltText("Image List Image") as HTMLImageElement[];

      expect(images).toHaveLength(6);
      expect(images[3].src).toMatch("new-image-1.jpg");
      expect(images[4].src).toMatch("new-image-2.jpg");
      expect(images[5].src).toMatch("new-image-3.jpg");

      IMAGES_MOCK.forEach((image, index) => {
        expect(images[index].src).toMatch(image);
      });
    });

    it("should add the images with the onDrop event", async () => {
      const setNewImagesMock = jest.fn();

      const { getByTestId, getAllByAltText } = render(
        <Carousel images={IMAGES_MOCK} setNewImages={setNewImagesMock} setImagesToDelete={jest.fn()}/>
      );

      const dropArea = getByTestId("carousel-drop-area");
      await act(async () => {
        fireEvent.drop(dropArea, { dataTransfer: { files: FILE_LIST_MOCK } })
      });

      expect(getImageURLs).toHaveBeenCalledWith(FILES_MOCK);

      const setNewImagesFunction = setNewImagesMock.mock.calls[0][0];
      expect(setNewImagesFunction([])).toEqual(
        FILES_MOCK.map((file, index) => ({
          fileId: index,
          file
        }))
      );

      const images = getAllByAltText("Image List Image") as HTMLImageElement[];

      expect(images).toHaveLength(6);
      expect(images[3].src).toMatch("new-image-1.jpg");
      expect(images[4].src).toMatch("new-image-2.jpg");
      expect(images[5].src).toMatch("new-image-3.jpg");

      IMAGES_MOCK.forEach((image, index) => {
        expect(images[index].src).toMatch(image);
      });
    });

    it("should set the currentPreviewImage to the last image index", async () => {
      const { getByTestId, getAllByAltText } = render(
        <Carousel images={IMAGES_MOCK} setNewImages={jest.fn()} setImagesToDelete={jest.fn()}/>
      );

      const inputFile = getByTestId("carousel-input-file");
      await act(async () => {
        fireEvent.change(inputFile, { target: { files: FILE_LIST_MOCK } })
      });

      const images = getAllByAltText("Image List Image") as HTMLImageElement[];

      const imageContainer = images[5].parentElement;
      expect(imageContainer.classList.contains("active"));
    });

    it("should display the loader when the images are loading", async () => {
      const { getByTestId, queryByText } = render(
        <Carousel images={IMAGES_MOCK} setNewImages={jest.fn()} setImagesToDelete={jest.fn()}/>
      );

      const inputFile = getByTestId("carousel-input-file");
      await act(async () => {
        fireEvent.change(inputFile, { target: { files: FILE_LIST_MOCK } })
        await waitFor(() => expect(queryByText("Loading the images.")).toBeInTheDocument());
      });

      expect(queryByText("Loading the images.")).not.toBeInTheDocument();
    });

    it("should display an error message when the files aren't images", async () => {
      const { getByTestId, queryByText } = render(
        <Carousel images={IMAGES_MOCK} setNewImages={jest.fn()} setImagesToDelete={jest.fn()}/>
      );

      const inputFile = getByTestId("carousel-input-file");
      await act(async () => {
        fireEvent.change(inputFile, {
          target: {
            files: {
              item: () => new File([], "test-file", { type: "text/html" }),
              length: 1
            }
          }
        })
      });

      expect(queryByText("All the files must be an image .png, .jpeg or .jpg")).toBeInTheDocument();
    });
  });

  it("should add or remove the active class to the dragMark div", () => {
    const { getByTestId } = render(
      <Carousel images={IMAGES_MOCK} setNewImages={jest.fn()} setImagesToDelete={jest.fn()}/>
    );

    const dragMarkDiv = getByTestId("carousel-drag-mark");
    expect(dragMarkDiv.classList.contains("active")).toBeFalsy();

    const carouselDropArea = getByTestId("carousel-drop-area");

    fireEvent.dragEnter(carouselDropArea);
    expect(dragMarkDiv.classList.contains("active")).toBeTruthy();

    fireEvent.dragLeave(dragMarkDiv);
    expect(dragMarkDiv.classList.contains("active")).toBeFalsy();
  });
});
