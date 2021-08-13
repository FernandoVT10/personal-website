import React from "react";

import { render, fireEvent, act } from "@testing-library/react";

import ProjectCard from "./ProjectCard";

const PROJECT_MOCK = {
  _id: "test-id-1",
  title: "test 1",
  images:  ["test-1-1.jpg", "test-1-2.jpg"]
}

describe("src/domain/Dashboard/Home/ProjectCardList/ProjectCard", () => {
  it("should render correctly", () => {
    const { queryByText, getByText, getAllByTestId } = render(<ProjectCard project={PROJECT_MOCK} deleteProject={jest.fn()}/>);

    const carouselImages = getAllByTestId("image-carousel-image");
    carouselImages.forEach((carouselImage, index) => {
      const projectImage = PROJECT_MOCK.images[index];
      expect(carouselImage.style.background).toMatch(projectImage);
    });

    expect(queryByText("test 1")).toBeInTheDocument();

    const editButton = getByText("Edit") as HTMLAnchorElement;

    expect(editButton.href).toMatch("/dashboard/project/test-id-1/edit");
  });

  it("should activate the confirm menu when we click on the delete button", () => {
    const { queryByText, getByText } = render(<ProjectCard project={PROJECT_MOCK} deleteProject={jest.fn()}/>);

    expect(queryByText("Are you sure to delete this project?")).not.toBeInTheDocument();
    fireEvent.click(getByText("Delete"));
    expect(queryByText("Are you sure to delete this project?")).toBeInTheDocument();
  });

  it("should deactivate the confirm menu when we click on the no button", () => {
    const { queryByText, getByText } = render(<ProjectCard project={PROJECT_MOCK} deleteProject={jest.fn()}/>);

    fireEvent.click(getByText("Delete"));
    expect(queryByText("Are you sure to delete this project?")).toBeInTheDocument();

    fireEvent.click(getByText("No"));
    expect(queryByText("Are you sure to delete this project?")).not.toBeInTheDocument();
  });

  describe("handleOnClick", () => {
    it("should call the deleteProject function correctly", async () => {
      const deleteProjectMock = jest.fn().mockResolvedValue(null);
      const { queryByTestId, getByText } = render(<ProjectCard project={PROJECT_MOCK} deleteProject={deleteProjectMock}/>);

      fireEvent.click(getByText("Delete"));

      fireEvent.click(getByText("Yes"));
      expect(queryByTestId("loader-component")).toBeInTheDocument();

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByTestId("loader-component")).not.toBeInTheDocument();
      expect(deleteProjectMock).toHaveBeenCalledWith("test-id-1");
    });

    it("should display a message when deleteProject throws an error", async () => {
      const deleteProjectMock = jest.fn().mockRejectedValue(new Error("test error message"));
      const { queryByText, queryByTestId, getByText } = render(<ProjectCard project={PROJECT_MOCK} deleteProject={deleteProjectMock}/>);

      fireEvent.click(getByText("Delete"));

      fireEvent.click(getByText("Yes"));
      expect(queryByTestId("loader-component")).toBeInTheDocument();

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByTestId("loader-component")).not.toBeInTheDocument();
      expect(deleteProjectMock).toHaveBeenCalledWith("test-id-1");
      expect(queryByText("test error message")).toBeInTheDocument();
    });
  });
});
