import React from "react";

import { render, fireEvent, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import Projects, { GET_PROJECTS, GET_TECHNOLOGIES } from "./Projects";

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
          docs: PROJECTS_MOCK,
          ...PAGINATION_MOCK
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
    window.location.search = "";
  });

  it("should render correctly", async () => {
    const { queryByText, getByText } = render(
      <MockedProvider mocks={APOLLO_MOCK} addTypename={false}>
        <Projects/>
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    PROJECTS_MOCK.forEach(project => {
      expect(queryByText(project.title)).toBeInTheDocument();
      expect(queryByText(project.description)).toBeInTheDocument();
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
        ...APOLLO_MOCK[0],
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
        ...APOLLO_MOCK[1]
      }
    ];

    window.location.search = "?page=50&search=test search&technology=test technology";

    const { queryByText, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Projects/>
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    PROJECTS_MOCK.forEach(project => {
      expect(queryByText(project.title)).toBeInTheDocument();
      expect(queryByText(project.description)).toBeInTheDocument();
    });

    // PAGINATION
    expect(queryByText("1024")).toBeInTheDocument();

    // TECHNOLOGIES
    const selectBox = getByText("test technology");
    fireEvent.click(selectBox);

    TECHNOLOGIES_MOCK.forEach(technology => {
      expect(queryByText(technology.name)).toBeInTheDocument();
    });
  });

  it("should refetch the projects when there's a change on router.query", async () => {
    const mocks = [
      ...APOLLO_MOCK,
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
              docs: [
                {
                  _id: "testid",
                  title: "refetch project title",
                  description: "refetch project description",
                  images: ["refetch-1.jpg"],
                  technologies: [
                    { name: "project technology 1" },
                    { name: "project technology 2" }
                  ]
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
        <Projects/>
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    window.location.search = "?page=100&search=test search&technology=test technology";

    changeRouterProperties({ query: {} });

    rerender(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Projects/>
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(queryByText("refetch project title")).toBeInTheDocument();
    expect(queryByText("refetch project description")).toBeInTheDocument();
  });

  describe("handleOnSubmit", () => {
    it("should call router.push correctly", async () => {
      const routerPushMock = jest.fn();
      changeRouterProperties({ push: routerPushMock });

      window.location.search = "?search=test search";

      const { getByDisplayValue, getByText, getByTestId } = render(
        <MockedProvider mocks={APOLLO_MOCK} addTypename={false}>
          <Projects/>
        </MockedProvider>
      );

      await act(() => new Promise(resolve => setTimeout(resolve, 0)));

      const searchInput = getByDisplayValue("test search");
      fireEvent.change(searchInput, { target: { value: "changed search" } });

      const selectTechnologyBox = getByText("Select a technology");
      fireEvent.click(selectTechnologyBox);
      fireEvent.click(getByText("technology 2"));

      fireEvent.submit(getByTestId("filters-form"));

      expect(routerPushMock).toHaveBeenCalledWith({
        pathname: "/test/",
        query: {
          search: "changed search",
          technology: "technology 2"
        }
      });
    });
  });
});
