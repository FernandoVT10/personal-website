import React from "react";

import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { MockedProvider } from "@apollo/client/testing";

import client from "@/config/apolloClient";

import HomePage, { getServerSideProps, GET_PROJECTS } from "@/pages/index";

jest.mock("@/config/apolloClient", () => ({ query: jest.fn() }));

const mockHomeComponent = jest.fn();
jest.mock("@/domain/Home", () => ({ projectsResult }) => {
  mockHomeComponent(projectsResult);
  return null;
});

const PROJECT_RESULT_MOCK = {
  error: null,
  data: {
    projects: {
      docs: [
        {
          _id: "testid",
          title: "test title",
          description: "test description",
          images: ["test-1.jpg", "test-2.jpg"],
          technologies: [
            { name: "technology 1" },
            { name: "technology 2" },
            { name: "technology 3" }
          ]
        }
      ]
    }
  }
} as any;

const mockedQuery = mocked(client.query);

describe("src/pages/index", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockedQuery.mockResolvedValue(PROJECT_RESULT_MOCK);
  });
  
  it("should render correctly", () => {
    render(
      <MockedProvider>
        <HomePage projectsResult={PROJECT_RESULT_MOCK}/>
      </MockedProvider>
    );

    expect(mockHomeComponent).toHaveBeenCalledWith(PROJECT_RESULT_MOCK);
  });

  describe("getStaticProps", () => {
    it("should return the props correctly", async () => {
      const result = await getServerSideProps();

      expect(result).toEqual({
        props: {
          projectsResult: PROJECT_RESULT_MOCK
        }
      });

      expect(mockedQuery).toHaveBeenCalledWith({
        fetchPolicy: "network-only",
        query: GET_PROJECTS
      });
    });
  });
});
