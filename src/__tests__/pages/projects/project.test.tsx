import React from "react";

import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import apolloClient from "@/config/apolloClient";

import ProjectPage, { getServerSideProps } from "@/pages/projects/[projectId]";

jest.mock("@/config/apolloClient", () => ({ query: jest.fn() }));

const mockProjectcomponent = jest.fn();
jest.mock("@/domain/Project", () => (props: any) => {
  mockProjectcomponent(props);
  return null;
});

const PROJECT_MOCK = {
  title: "test title",
  images: ["test-1.jpg", "test-2.jpg"],
  content: "# Markdown title",
  technologies: [
    { name: "technology 1" },
    { name: "technology 2" },
    { name: "technology 3" }
  ]
}

const RELATED_PROJECTS_MOCK = [
  {
    _id: "test-id-1",
    title: "test title 1",
    images: ["test-1-1.jpg", "test-1-2.jpg"]
  },
  {
    _id: "test-id-2",
    title: "test title 2",
    images: ["test-2-1.jpg", "test-2-2.jpg"]
  }
];

const CONTEXT_MOCK = {
  params: {
    projectId: "test id"
  }
} as any

const apolloClientQueryMocked = mocked(apolloClient.query);

describe("src/pages/projects/[projectId]", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render correctly", () => {
    const props = {
      project: PROJECT_MOCK,
      relatedProjects: RELATED_PROJECTS_MOCK,
      error: false
    }

    render(
      <ProjectPage {...props}/>
    );

    expect(mockProjectcomponent).toHaveBeenCalledWith(props);
  });

  describe("getServerSideProps", () => {
    it("should return the props correctly", async () => {
      apolloClientQueryMocked.mockResolvedValue({
        data: {
          project: PROJECT_MOCK,
          relatedProjects: RELATED_PROJECTS_MOCK
        }
      } as any);

      expect(await getServerSideProps(CONTEXT_MOCK)).toEqual({
        props: {
          project: PROJECT_MOCK,
          relatedProjects: RELATED_PROJECTS_MOCK,
          error: false
        }
      });
    });

    it("should return the error prop to true when there was an error", async () => {
      apolloClientQueryMocked.mockRejectedValue(new Error(""));

      expect(await getServerSideProps(CONTEXT_MOCK)).toEqual({
        props: {
          project: null,
          relatedProjects: null,
          error: true
        }
      });
    });
  });
});
