import React from "react";

import { render, fireEvent, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import Home, { GET_PROJECTS, GET_TECHNOLOGIES } from "./Home";

jest.mock("@/hocs/withUser", () => (Component: JSX.Element) => Component);

const paginationComponentMock = jest.fn();
jest.mock("@/components/Pagination", () => ({
  __esModule: true,
  default: ({ data }) => {
    paginationComponentMock(data);
    return null;
  },
  PAGINATION_PROPS: ""
}));

const projectCardListComponentMock = jest.fn();
jest.mock("./ProjectCardList", () => (props: any) => {
  projectCardListComponentMock(props);
  return null;
});

const projectsFilterComponentMock = jest.fn();
jest.mock("@/components/Projects/ProjectsFilter", () => (props: any) => {
  projectsFilterComponentMock(props);
  return null;
});

const TECHNOLOGIES_MOCK = [
  { name:  "technology 1" },
  { name:  "technology 2" },
  { name:  "technology 3" },
];

const PROJECTS_MOCK = [
  {
    _id: "testid",
    title: "test project title",
    images: ["test-1.jpg", "test-2.jpg"]
  },
  {
    _id: "testid2",
    title: "test project title 2",
    images: []
  }
];

const MOCKS = [
  {
    request: {
      query: GET_PROJECTS,
      variables: {
        page: 0,
        search: "",
        technology: ""
      }
    },
    result: {
      data: {
        projects: {
          docs: PROJECTS_MOCK
        }
      }
    }
  },
  {
    request: {
      query: GET_TECHNOLOGIES
    },
    result: {
      data: { technologies: TECHNOLOGIES_MOCK }
    }
  }
];

Object.defineProperty(window, "location", {
  value: {
    search: ""
  }
});

describe("src/domain/Dashboard/Home", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    window.location.search = "?";
  });

  it("should render correctly", async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <Home/>
      </MockedProvider>
    );

    // get the toTheChangeOfVariables function from the ProjectsFilter component props
    // and then execute it to start the application
    const { toTheChangeOfVariables } = projectsFilterComponentMock.mock.calls[0][0];
    toTheChangeOfVariables({
      page: 0,
      search: "",
      technology: ""
    });

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(projectCardListComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        projects: PROJECTS_MOCK
      })
    );

    expect(paginationComponentMock).toHaveBeenCalledWith(MOCKS[0].result.data.projects);

    expect(projectsFilterComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        technologiesData: { 
          technologies: TECHNOLOGIES_MOCK
        }
      })
    );
  });

  it("should refetch the projects when we call toTheChangeOfVariables function with the new variables", async () => {
    const projectMock = {
      _id: "newid",
      title: "new project title",
      images: ["new-test-1.jpg", "new-test-2.jpg"]
    }

    const mocks = [
      ...MOCKS,
      {
        request: {
          query: GET_PROJECTS,
          variables: {
            page: 256,
            search: "new search",
            technology: "TestJS"
          }
        },
        result: {
          data: {
            projects: {
              docs: [projectMock]
            }
          }
        }
      }
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Home/>
      </MockedProvider>
    );

    const { toTheChangeOfVariables } = projectsFilterComponentMock.mock.calls[0][0];
    toTheChangeOfVariables({
      page: 0,
      search: "",
      technology: ""
    });
    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    toTheChangeOfVariables({
      page: 256,
      search: "new search",
      technology: "TestJS"
    });
    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(projectCardListComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        projects: [projectMock]
      })
    );
  });
});
