import React from "react";

import { render, fireEvent, screen, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import { GET_TECHNOLOGIES } from "@/components/ProjectEditor/Technologies/ManagementModal/";

import EditProject, { UPDATE_PROJECT } from "../EditProject";
import {mocked} from "ts-jest/utils";
import withUser from "@/hocs/withUser";
import {GraphQLError} from "graphql";

jest.mock("@/components/Modal");
jest.mock("@/hocs/withUser");
jest.mock("@/utils/getImageURLs");

const TECHNOLOGIES_MOCK = [
  { _id: "test-id-1", name: "technology 1" },
  { _id: "test-id-2", name: "technology 2" },
  { _id: "test-id-3", name: "technology 3" },
  { _id: "test-id-4", name: "old technology 1" },
  { _id: "test-id-5", name: "old technology 2" }
];

const PROJECT_MOCK = {
  _id: "project-id",
  title: "test title",
  images: ["test-1.jpg", "test-2.jpg"],
  description: "test description",
  content: "test content",
  technologies: [
    { name: "old technology 1" },
    { name: "old technology 2" }
  ]
}

const IMAGES_MOCK = [
  new File([], "new-image-1.jpg",  { type: "image/jpg" }),
  new File([], "new-image-2.jpg",  { type: "image/jpg" }),
];

const FILE_LIST_MOCK = {
  item: (index: number) => IMAGES_MOCK[index],
  length: IMAGES_MOCK.length
}

const MOCKS = [
  {
    request: {
      query: GET_TECHNOLOGIES
    },
    result: {
      data: {
        technologies: TECHNOLOGIES_MOCK
      }
    }
  },
  {
    request: {
      query: UPDATE_PROJECT,
      variables: {
        projectId: PROJECT_MOCK._id,
        project: {
          title: "updated title",
          imagesToDelete: ["test-1.jpg"],
          newImages: IMAGES_MOCK,
          description: "updated description",
          content: "updated content",
          technologies: ["old technology 2", "technology 1", "technology 3"]
        }
      }
    },
    result: {
      data: {
        updateProject: {
          _id: PROJECT_MOCK._id
        }
      }
    }
  }
];


const changeInputValue = (inputTestId: string, newValue: string) => {
  const input = screen.getByTestId(inputTestId);
  fireEvent.change(input, { target: { value: newValue } });
}

const renderComponent = (props: {[key: string]: any} = {}) => {
  return render(
    <MockedProvider mocks={props.mocks ?? MOCKS} addTypename={false}>
      <EditProject project={props.project ?? PROJECT_MOCK} error={props.error ?? false}/>
    </MockedProvider>
  );
}

describe("src/domain/Dashboard/Project/EditProject", () => {
  const routerPushMock = jest.fn();

  beforeEach(() => {
    routerPushMock.mockClear();

    changeRouterProperties({
      push: routerPushMock
    });
  });

  it("should call withUser hoc correctly", () => {
    const withUserMocked = mocked(withUser);

    renderComponent();

    expect(withUserMocked).toHaveBeenCalledTimes(1);
    expect(withUserMocked).toHaveBeenCalledWith(expect.any(Function), true, "/dashboard/login");
  });

  it("should render correctly", () => {
    const { queryByDisplayValue, queryByText, getAllByAltText } = renderComponent();

    expect(queryByDisplayValue("test title")).toBeInTheDocument();
    expect(queryByDisplayValue("test description")).toBeInTheDocument();
    expect(queryByDisplayValue("test content")).toBeInTheDocument();

    // here we're going to check out if the images are rendering correctly
    const imageList = getAllByAltText("Image List Image") as HTMLImageElement[];
    PROJECT_MOCK.images.forEach((image, index) => {
      expect(imageList[index].src).toMatch(image);
    });

    PROJECT_MOCK.technologies.forEach(technology => {
      expect(queryByText(technology.name)).toBeInTheDocument();
    });
  });

  it("should render an error page when there's the error prop is true", () => {
    const { queryByText } = renderComponent({ error: true });

    expect(queryByText("404")).toBeInTheDocument();
    expect(queryByText("Project not found")).toBeInTheDocument();
  });

  describe("onSave", () => {
    it("should redirect to the updated project when everything is ok", async () => {
      const { getByTestId, getByLabelText, getByText, getAllByTestId } = renderComponent();

      // this is the title input
      changeInputValue("input-component", "updated title");
      // this is the description textarea
      changeInputValue("textarea-component", "updated description");
      changeInputValue("content-editor-textarea", "updated content");

      // here i'm adding two new images
      const carouselInputFile = getByTestId("carousel-input-file");
      await act(async () => {
        fireEvent.change(carouselInputFile, { target: { files: FILE_LIST_MOCK } });
      });
      // here i'm deleting the first image (test-1.jpg)
      const deleteImageButtons = getAllByTestId("image-list-delete-button");
      fireEvent.click(deleteImageButtons[0]);

      // select some technologies
      // activate the technologies modal
      const activateTechnologiesModalButton = getByTestId("activate-modal-button");
      fireEvent.click(activateTechnologiesModalButton);

      // we need to wait until the technologies load
      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      // then we can select some technologies
      fireEvent.click(getByLabelText("technology 1"));
      fireEvent.click(getByLabelText("technology 3"));

      // here i'm deselecting one technology
      fireEvent.click(getByLabelText("old technology 1"));

      fireEvent.click(getByText("Save Project"));

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(routerPushMock).toHaveBeenCalledWith(`/projects/${PROJECT_MOCK._id}`);
    });

    it("should display a message when the apollo mutation throws an error", async () => {
      const mocks = [
        {
          request: {
            query: UPDATE_PROJECT,
            variables: {
              projectId: PROJECT_MOCK._id,
              project: {
                title: PROJECT_MOCK.title,
                imagesToDelete: [],
                newImages: [],
                description: PROJECT_MOCK.description,
                content: PROJECT_MOCK.content,
                technologies: PROJECT_MOCK.technologies.map(technology => technology.name)
              }
            }
          },
          result: {
            errors: [new GraphQLError("apollo error message")]
          }
        }
      ];

      const { queryByText, getByText } = renderComponent({ mocks });

      fireEvent.click(getByText("Save Project"));

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByText("apollo error message")).toBeInTheDocument();
    });

    it("should display an erorr message when there's no new images and all the old images are deleted", async () => {
      const { queryByText, getByText, getAllByTestId } = renderComponent();

      // here i'm deleting all the images
      const deleteImageButtons = getAllByTestId("image-list-delete-button");
      act(() => {
        deleteImageButtons.forEach(
          deleteImageButton => fireEvent.click(deleteImageButton)
        );
      });

      fireEvent.click(getByText("Save Project"));

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByText("You need to add at least one image to the carousel")).toBeInTheDocument();
    });
  });

  describe("goBack", () => {
    it("should redirect to the dashboard home page when we click on the Go Back button", () => {
      const { getByText } = renderComponent();

      fireEvent.click(getByText("Go Back"));

      expect(routerPushMock).toHaveBeenCalledWith("/dashboard/");
    });
  });
});
