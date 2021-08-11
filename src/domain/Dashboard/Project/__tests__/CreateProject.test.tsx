import React from "react";
import { GraphQLError } from "graphql";

import { MockedProvider } from "@apollo/client/testing";
import { render, fireEvent, screen, act } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import { GET_TECHNOLOGIES } from "@/components/ProjectEditor/Technologies/ManagementModal/";

import withUser from "@/hocs/withUser";

import CreateProject, { CREATE_PROJECT } from "../CreateProject";

jest.mock("@/hocs/withUser");
jest.mock("@/components/Modal");
jest.mock("@/utils/getImageURLs");

const IMAGES_MOCK = [
  new File([], "new-image-1.jpg",  { type: "image/jpg" }),
  new File([], "new-image-2.jpg",  { type: "image/jpg" }),
];

const FILE_LIST_MOCK = {
  item: (index: number) => IMAGES_MOCK[index],
  length: IMAGES_MOCK.length
}

const TECHNOLOGIES_MOCK = [
  { _id: "test-id-1", name: "technology 1" },
  { _id: "test-id-2", name: "technology 2" },
  { _id: "test-id-3", name: "technology 3" }
];

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
      query: CREATE_PROJECT,
      variables: {
        project: {
          title: "test title",
          images: IMAGES_MOCK,
          description: "test description",
          content: "test content",
          technologies: ["technology 1", "technology 3"]
        }
      }
    },
    result: {
      data: {
        createProject: {
          _id: "test-id"
        }
      }
    }
  }
];

const renderComponent = (mocks: any[] = null) => {
  return render(
    <MockedProvider mocks={mocks ?? MOCKS} addTypename={false}>
      <CreateProject/>
    </MockedProvider>
  );
}

const changeInputValue = (inputTestId: string, newValue: string) => {
  const input = screen.getByTestId(inputTestId);
  fireEvent.change(input, { target: { value: newValue } });
}

describe("src/domain/Dashboard/Project/CreateProject", () => {
  const routerPushMock = jest.fn();
  const withUserMocked = mocked(withUser);

  beforeEach(() => {
    routerPushMock.mockReset();

    changeRouterProperties({
      push: routerPushMock
    });
  });

  it("should call the withUser hoc correctly", () => {
    renderComponent();

    expect(withUserMocked).toHaveBeenCalledTimes(1);
    expect(withUserMocked).toHaveBeenCalledWith(expect.any(Function), true, "/dashboard/login");
  });

  describe("onSave", () => {
    it("should redirect to the created project page when everything is ok", async () => {
      const { getByText, getByLabelText, getByTestId } = renderComponent();

      // this is the title input
      changeInputValue("input-component", "test title");
      // this is the description textarea
      changeInputValue("textarea-component", "test description");
      changeInputValue("content-editor-textarea", "test content");

      const carouselInputFile = getByTestId("carousel-input-file");
      await act(async () => {
        fireEvent.change(carouselInputFile, { target: { files: FILE_LIST_MOCK } });
      });

      // select some technologies
      // activate the technologies modal
      const activateTechnologiesModalButton = getByTestId("activate-modal-button");
      fireEvent.click(activateTechnologiesModalButton);

      // we need to wait until the technologies load
      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      // then we can select some technologies
      fireEvent.click(getByLabelText("technology 1"));
      fireEvent.click(getByLabelText("technology 3"));

      fireEvent.click(getByText("Save Project"));

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(routerPushMock).toHaveBeenCalledWith("/projects/test-id");
    });

    it("should display a message when the apollo mutation throws an error", async () => {
      const mocks = [
        {
          request: {
            query: CREATE_PROJECT,
            variables: {
              project: {
                title: "title",
                images: IMAGES_MOCK,
                description: "description",
                content: "content",
                technologies: []
              }
            }
          },
          result: {
            errors: [new GraphQLError("graphql error message")]
          }
        }
      ];

      const { queryByText, getByText, getByTestId } = renderComponent(mocks);

      // this is the title input
      changeInputValue("input-component", "title");
      // this is the description textarea
      changeInputValue("textarea-component", "description");
      changeInputValue("content-editor-textarea", "content");

      const carouselInputFile = getByTestId("carousel-input-file");
      await act(async () => {
        fireEvent.change(carouselInputFile, { target: { files: FILE_LIST_MOCK } });
      });

      fireEvent.click(getByText("Save Project"));

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByText("graphql error message")).toBeInTheDocument();
    });

    it("should display an error when the images array is empty", async () => {
      const { queryByText, getByText } = renderComponent();

      // this is the title input
      changeInputValue("input-component", "test title");
      // this is the description textarea
      changeInputValue("textarea-component", "test description");
      changeInputValue("content-editor-textarea", "test content");

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
