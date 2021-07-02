import React from "react";

import { render } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import Home from "./Home";

const PROJECT_RESULT_MOCK = {
  error: null,
  data: {
    projects: {
      docs: [
        {
          _id: "testid",
          title: "test title",
          description: "test description",
          images: ["test-1.jpg", "test-2.jpg"]
        }
      ]
    }
  }
} as any;

describe("src/domain/Home", () => {
  it("should render correctly", () => {
    const { queryByText } = render(
      <MockedProvider>
        <Home projectsResult={PROJECT_RESULT_MOCK}/>
      </MockedProvider>
    );

    expect(queryByText("test title")).toBeInTheDocument();
    expect(queryByText("test description")).toBeInTheDocument();
  });
});
