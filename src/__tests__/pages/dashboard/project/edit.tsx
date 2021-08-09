import React from "react";

import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { MockedProvider } from "@apollo/client/testing";

import apolloClient from "@/config/apolloClient";

import EditProjectPage, { getServerSideProps, GET_PROJECT } from "@/pages/dashboard/project/[projectId]/edit";

jest.mock("@/config/apolloClient");
jest.mock("@/hocs/withUser", () => (children: JSX.Element) => children);

const PROJECT_MOCK = {
  _id: "testid",
  title :"test title",
  images: ["test-1.jpg", "test-2.jpg", "test-3.jpg"],
  description: "test description",
  content: "test content",
  technologies: [
    { name: "test 1" },
    { name: "test 2" },
    { name: "test 3" }
  ]
}

const apolloClientQueryMocked = mocked(apolloClient.query);

const renderComponent = (props: {[key: string]: any} = {}) => {
  return render(
    <MockedProvider>
      <EditProjectPage project={props.project ?? PROJECT_MOCK} error={props.error ?? false}/>
    </MockedProvider>
  );
}

describe("src/pages/dashboard/project/[projectId]/edit", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    apolloClientQueryMocked.mockResolvedValue({
      data: {
        project: PROJECT_MOCK
      }
    } as any);
  });

  it("should render correclty", () => {
    const { queryByDisplayValue } = renderComponent();

    expect(queryByDisplayValue("test title")).toBeInTheDocument();
    expect(queryByDisplayValue("test description")).toBeInTheDocument();
    expect(queryByDisplayValue("test content")).toBeInTheDocument();
  });


  it("should render an error page", () => {
    const { queryByText, queryByDisplayValue } = renderComponent({ error: true });

    expect(queryByDisplayValue("test title")).not.toBeInTheDocument();

    expect(queryByText("404")).toBeInTheDocument();
    expect(queryByText("Project not found")).toBeInTheDocument();
  });

  describe("getServerSideProps", () => {
    it("should call the apolloClient.query function correclty", async () => {
      await getServerSideProps({ params: { projectId: "testid" } } as any);

      expect(apolloClientQueryMocked).toHaveBeenCalledWith({
        query: GET_PROJECT,
        variables: {
          projectId: "testid"
        }
      });
    });

    it("should return the project correclty", async () => {
      const result = await getServerSideProps({ params: { projectId: "testid" } } as any);

      expect(result).toEqual({
        props: {
          project: PROJECT_MOCK,
          error: false
        }
      });
    });

    it("should't return the project when the apolloClient.query function throws an error", async () => {
      apolloClientQueryMocked.mockReset();
      apolloClientQueryMocked.mockRejectedValue(new Error("test error"));

      const result = await getServerSideProps({ params: { projectId: "testid" } } as any);

      expect(result).toEqual({
        props: {
          project: null,
          error: true
        }
      });
    });
  });
});
