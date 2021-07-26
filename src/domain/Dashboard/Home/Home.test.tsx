import React from "react";

import { render, fireEvent, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import Home, { GET_PROJECTS, GET_TECHNOLOGIES } from "./Home";

jest.mock("@/hocs/withUser", () => (Component: JSX.Element) => Component);

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

const PAGINATION_MOCK = {
  totalPages: 1024,
  page: 1024,
  hasPrevPage: true,
  prevPage: 4,
  hasNextPage: false,
  nextPage: null
}

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
          docs: PROJECTS_MOCK,
          ...PAGINATION_MOCK
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
    window.location.search = "?";
  });

  it("should render correctly", async () => {
    const { queryByText, getByText } = render(
      <MockedProvider mocks={MOCKS}>
        <Home/>
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    PROJECTS_MOCK.forEach(project => {
      expect(queryByText(project.title)).toBeInTheDocument();
    });

    // PAGINATION
    expect(queryByText("1024")).toBeInTheDocument();

    // TECHNOLOGIES
    const selectBox = getByText("Select a technology");
    fireEvent.click(selectBox);

    TECHNOLOGIES_MOCK.forEach(technology => {
      expect(queryByText(technology.name)).toBeInTheDocument();
    });
  });


  it("should render with query parameters", async () => {
    const mocks = [
      {
        ...MOCKS[0],
        // here we are rewriting the request object
        request: {
          query: GET_PROJECTS,
          variables: {
            page: 50,
            search: "test search",
            technology: "test technology"
          }
        }
      },
      {
        ...MOCKS[1]
      }
    ];

    window.location.search = "?page=50&search=test search&technology=test technology";

    const { queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Home/>
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    PROJECTS_MOCK.forEach(project => {
      expect(queryByText(project.title)).toBeInTheDocument();
    });

    // PAGINATION
    expect(queryByText("1024")).toBeInTheDocument();
  });

  it("should refetch the projects with the new variables", async () => {
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
              docs: [
                {
                  _id: "newid",
                  title: "new project title",
                  images: ["new-test-1.jpg", "new-test-2.jpg"]
                }
              ],
              ...PAGINATION_MOCK
            }
          }
        }
      }
    ];

    const { queryByText, rerender } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Home/>
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    PROJECTS_MOCK.forEach(project => {
      expect(queryByText(project.title)).toBeInTheDocument();
    });

    window.location.search = "?page=256&search=new search&technology=TestJS";
    changeRouterProperties({
      query: {
        test: ""
      }
    });

    rerender(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Home/>
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    PROJECTS_MOCK.forEach(project => {
      expect(queryByText(project.title)).not.toBeInTheDocument();
    });

    expect(queryByText("new project title")).toBeInTheDocument();
  });
});
