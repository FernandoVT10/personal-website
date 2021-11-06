import React from "react";

import { render, fireEvent } from "@testing-library/react";

import ImageList from "./ImageList";

const PREVIEW_IMAGES_MOCK = [
  {
    fileId: null,
    imageURL: "test-1.jpg"
  },
  {
    fileId: null,
    imageURL: "test-2.jpg"
  },
  {
    fileId: 8,
    imageURL: "test-3.jpg"
  }
];

const renderComponent = (props: any) => {
  return render(
    <ImageList {...props} />
  );
}

describe("src/components/ProjectEditor/Carousel", () => {
  it("should render correctly", () => {
    const { getAllByAltText } = renderComponent({
      previewImages:PREVIEW_IMAGES_MOCK,
      currentPreviewImage: 1
    });

    const images = getAllByAltText("Image List Image") as HTMLImageElement[];

    expect(images[0].src).toMatch("test-1.jpg");
    expect(images[1].src).toMatch("test-2.jpg");
    expect(images[2].src).toMatch("test-3.jpg");

    // here we check if the imageContainer has the "active" class
    const imageContainer = images[1].parentElement;
    expect(imageContainer.classList.contains("active")).toBeTruthy();
  });

  describe("carousel actions", () => {
    describe("handleLeftArrowButton", () => {
      it("should scroll the imagesContainer to left correctly", () => {
        const { getByTestId } = renderComponent({
          previewImages:PREVIEW_IMAGES_MOCK,
          currentPreviewImage: 1
        });

        const scrollMock = jest.fn();

        const leftArrowButton = getByTestId("image-list-left-arrow-button");
        const imagesContainer = getByTestId("image-list-images-container");

        imagesContainer.scroll = scrollMock;
        imagesContainer.scrollLeft = 1000;
        Object.defineProperty(imagesContainer, "clientWidth", {
          value: 500
        });

        fireEvent.click(leftArrowButton);
        expect(scrollMock).toHaveBeenCalledWith(500, 0);
      });

      it("should set the scrollLeft to 0", () => {
        const { getByTestId } = renderComponent({
          previewImages:PREVIEW_IMAGES_MOCK,
          currentPreviewImage: 1
        });

        const scrollMock = jest.fn();

        const leftArrowButton = getByTestId("image-list-left-arrow-button");
        const imagesContainer = getByTestId("image-list-images-container");

        imagesContainer.scroll = scrollMock;
        imagesContainer.scrollLeft = 250;
        Object.defineProperty(imagesContainer, "clientWidth", {
          value: 500
        });

        fireEvent.click(leftArrowButton);
        expect(scrollMock).toHaveBeenCalledWith(0, 0);
      });
    });

    describe("handleRightArrowButton", () => {
      it("should scroll the imagesContainer to right correctly", () => {
        const { getByTestId } = renderComponent({
          previewImages:PREVIEW_IMAGES_MOCK,
          currentPreviewImage: 1
        });

        const scrollMock = jest.fn();

        const rightArrowButton = getByTestId("image-list-right-arrow-button");
        const imagesContainer = getByTestId("image-list-images-container");

        imagesContainer.scroll = scrollMock;
        imagesContainer.scrollLeft = 500;
        Object.defineProperty(imagesContainer, "clientWidth", {
          value: 500
        });

        fireEvent.click(rightArrowButton);
        expect(scrollMock).toHaveBeenCalledWith(1000, 0);
      });

      it("should set the scrollLeft to the scrollWidth - clientWidth value", () => {
        const { getByTestId } = renderComponent({
          previewImages:PREVIEW_IMAGES_MOCK,
          currentPreviewImage: 1
        });

        const scrollMock = jest.fn();

        const rightArrowButton = getByTestId("image-list-right-arrow-button");
        const imagesContainer = getByTestId("image-list-images-container");

        imagesContainer.scroll = scrollMock;
        imagesContainer.scrollLeft = 500;
        Object.defineProperty(imagesContainer, "scrollWidth", {
          value: 800
        });
        Object.defineProperty(imagesContainer, "clientWidth", {
          value: 500
        });

        fireEvent.click(rightArrowButton);
        expect(scrollMock).toHaveBeenCalledWith(300, 0);
      });
    });
  });

  it("should call setCurrentPreviewImage with the corresponding index", () => {
    const setCurrentPreviewImageMock = jest.fn();

    const { getAllByTestId } = renderComponent({
      previewImages:PREVIEW_IMAGES_MOCK,
      setCurrentPreviewImage: setCurrentPreviewImageMock,
      currentPreviewImage: 0
    });

    const previewButtons = getAllByTestId("image-list-preview-button");
    fireEvent.click(previewButtons[2]);

    expect(setCurrentPreviewImageMock).toHaveBeenCalledWith(2);
  });

  describe("deleteImage", () => {
    it("should delete an image without the fileId correctly", () => {
      const setPreviewImagesMock = jest.fn();
      const setImagesToDeleteMock = jest.fn();
      
      const { getAllByTestId } = renderComponent({
        setPreviewImages: setPreviewImagesMock,
        previewImages:PREVIEW_IMAGES_MOCK,
        setImagesToDelete: setImagesToDeleteMock,
        currentPreviewImage: 0
      });

      const deleteButtons = getAllByTestId("image-list-delete-button");
      fireEvent.click(deleteButtons[0]);

      const newPreviewImages = setPreviewImagesMock.mock.calls[0][0];
      expect(newPreviewImages).toEqual([
        PREVIEW_IMAGES_MOCK[1],
        PREVIEW_IMAGES_MOCK[2]
      ]);

      const setImagesToDeleteFunction = setImagesToDeleteMock.mock.calls[0][0];
      expect(setImagesToDeleteFunction(["deleted-1.jpg"])).toEqual([
        "deleted-1.jpg",
        "test-1.jpg"
      ]);
    });

    it("should delete an image with the fileId correctly", () => {
      const setPreviewImagesMock = jest.fn();
      const setNewImagesMock = jest.fn();

      const { getAllByTestId } = renderComponent({
        setPreviewImages: setPreviewImagesMock,
        previewImages:PREVIEW_IMAGES_MOCK,
        setNewImages: setNewImagesMock,
        currentPreviewImage: 0
      });

      const deleteButtons = getAllByTestId("image-list-delete-button");
      fireEvent.click(deleteButtons[2]);

      const newPreviewImages = setPreviewImagesMock.mock.calls[0][0];
      expect(newPreviewImages).toEqual([
        PREVIEW_IMAGES_MOCK[0],
        PREVIEW_IMAGES_MOCK[1]
      ]);

      const setNewImagesFunction = setNewImagesMock.mock.calls[0][0];
      expect(setNewImagesFunction([
        {
          fileId: 8,
          file: null
        }
      ])).toEqual([]);
    });

    it("should substract 1 to currentPreviewImage when the last previewImage is selected", () => {
      const setCurrentPreviewImageMock = jest.fn();

      const { getAllByTestId } = renderComponent({
        setPreviewImages: jest.fn(),
        previewImages:PREVIEW_IMAGES_MOCK,
        setCurrentPreviewImage: setCurrentPreviewImageMock,
        setNewImages: jest.fn(),
        currentPreviewImage: 2
      });

      const deleteButtons = getAllByTestId("image-list-delete-button");
      fireEvent.click(deleteButtons[2]);

      expect(setCurrentPreviewImageMock).toHaveBeenCalledWith(1);
    });
  });
});
