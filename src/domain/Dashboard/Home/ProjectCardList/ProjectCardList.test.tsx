import React from "react";

import { MockedProvider } from "@apollo/client/testing";

import { render, fireEvent, act } from "@testing-library/react";

import ProjectCardList, { DELETE_PROJECT } from "./ProjectCardList";
import {GraphQLError} from "graphql";

const mockProjectCardComponent = jest.fn()
jest.mock("./ProjectCard", () => (props: any) => {
  mockProjectCardComponent(props);

  return (
    <div>
      <button
        onClick={() => props.deleteProject(props.project._id)}
        data-testid={`delete-${props.project._id}`}
      ></button>
    </div>
  );
});

const PROJECTS_MOCK = [
  {
    _id: "test-id-1",
    title: "test 1",
    images:  ["test-1-1.jpg", "test-1-2.jpg"]
  },
  {
    _id: "test-id-2",
    title: "test 2",
    images:  ["test-2-1.jpg", "test-2-2.jpg"]
  },
  {
    _id: "test-id-3",
    title: "test 3",
    images:  ["test-3-1.jpg", "test-3-2.jpg"]
  }
];

const MOCKS = [
  {
    request: {
      query: DELETE_PROJECT,
      variables: {
        projectId: "test-id-3"
      }
    },
    result: {
      data: {
        deleteProject: {
          _id: "test-id-3"
        }
      }
    }
  }
]

const renderComponent = (props: {[key: string]: any} = {}) => {
  return render(
    <MockedProvider mocks={props.mocks ?? MOCKS} addTypename={false}>
      <ProjectCardList
        error={props.error  ?? null}
        loading={props.loading ?? false}
        projects={PROJECTS_MOCK}
        refetchProjects={props.refetchProjects ?? jest.fn()}
      />
    </MockedProvider>
  );
}

describe("src/domain/Dashboard/Home/ProjectCardList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    renderComponent();

    PROJECTS_MOCK.forEach((project) => {
      expect(mockProjectCardComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          project,
          deleteProject: expect.any(Function)
        })
      );
    });
  });

  it("should render the loader component", () => {
    const { queryByTestId } = renderComponent({ loading: true });
    expect(queryByTestId("loader-component")).toBeInTheDocument();
  });

  it("should render the error message", () => {
    const { queryByText } = renderComponent({ error: "message" });
    expect(queryByText("There was an error trying to display the projects. Try it again later.")).toBeInTheDocument();
  });

  describe("handleDeleteProject", () => {
    it("should call the deleteProject mutation and refetchProjects", async () => {
      const refetchProjectsMock = jest.fn();
      const { getByTestId } = renderComponent({ refetchProjects: refetchProjectsMock });

      fireEvent.click(getByTestId("delete-test-id-3"));
      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(refetchProjectsMock).toHaveBeenCalled();
    });
  });
});
