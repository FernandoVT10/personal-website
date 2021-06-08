import React from "react";

import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import client from "@/config/apolloClient";

import HomePage, { getStaticProps, GET_PROJECTS } from "@/pages/index";

jest.mock("@/config/apolloClient");

const PROJECT_RESULT_MOCK = {
  error: {
    graphQLErrors: [{ message: "test error message" }]
  },
  data: {
    projects: {
      docs: []
    }
  }
} as any;

const mockedQuery = mocked(client.query);

describe("src/pages/index", () => {
  beforeEach(() => {
    mockedQuery.mockReset();

    mockedQuery.mockResolvedValue(PROJECT_RESULT_MOCK);
  });
  
  it("should render correctly", () => {
    const { queryByText } = render(<HomePage projectsResult={PROJECT_RESULT_MOCK}/>);

    expect(queryByText("test error message")).toBeInTheDocument();
  });

  describe("getStaticProps", () => {
    it("should return the props correctly", async () => {
      const result = await getStaticProps();

      expect(result).toEqual({
        props: {
          projectsResult: PROJECT_RESULT_MOCK
        }
      });

      expect(mockedQuery).toHaveBeenCalledWith({ query: GET_PROJECTS });
    });
  });
});
