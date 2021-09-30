import React from "react";

import { render, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import Projects, { GET_PROJECTS, GET_TECHNOLOGIES } from "./Projects";

const projectListComponentMock = jest.fn();
jest.mock("@/components/Projects/ProjectList", () => (props: any) => {
  projectListComponentMock(props);
  return null;
});

const paginationComponentMock = jest.fn();
jest.mock("@/components/Pagination", () => ({
  __esModule: true,
  default: ({ data }) => {
    paginationComponentMock(data);
    return null;
  },
  PAGINATION_PROPS: ""
}));

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
    description: "test project description",
    images: ["test-1.jpg", "test-2.jpg"],
    technologies: [
      { name: "project technology 1" },
      { name: "project technology 2" }
    ]
  },
  {
    _id: "testid2",
    title: "test project title 2",
    description: "test project description 2",
    images: [],
    technologies: [
      { name: "project technology 1" },
      { name: "project technology 2" }
    ]
  }
];

const PAGINATION_MOCK = {
  totalPages: 1024,
  page: 1024,
  hasPrevPage: true,
  prevPage: 4,
  hasNextPage: false,
  nextPage: null
}

const APOLLO_MOCK = [
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
      query: GET_TECHNOLOGIES,
      variables: {}
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

describe("src/domain/Projects", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    changeRouterProperties({});

    window.location.search = "";
  });

  it("should render correctly", async () => {
    render(
      <MockedProvider mocks={APOLLO_MOCK} addTypename={false}>
        <Projects/>
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

    expect(projectListComponentMock).toHaveBeenCalledWith({
      error: undefined,
      loading: false,
      data: APOLLO_MOCK[0].result.data
    });

    expect(paginationComponentMock).toHaveBeenCalledWith(APOLLO_MOCK[0].result.data.projects);

    expect(projectsFilterComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        technologiesData: { 
          technologies: TECHNOLOGIES_MOCK
        }
      })
    );
  });

  it("should refetch the projects when we call toTheChangeOfVariables with new variables", async () => {
    const projectMock = {
      _id: "testid",
      title: "refetch project title",
      description: "refetch project description",
      images: ["refetch-1.jpg"],
      technologies: [
        { name: "project technology 1" },
        { name: "project technology 2" }
      ]
    }

    const mocks = [
      ...APOLLO_MOCK,
      // we're adding a new mock to the projects
      {
        request: {
          query: GET_PROJECTS,
          variables: {
            page: 100,
            search: "test search",
            technology: "test technology"
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
        <Projects/>
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
      page: 100,
      search: "test search",
      technology: "test technology"
    });
    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(projectListComponentMock).toHaveBeenCalledWith({
      error: undefined,
      loading: false,
      data: {
        projects: {
          docs: [projectMock]
        }
      }
    });
  });
});
