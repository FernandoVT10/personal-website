import React from "react";

import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";

import CreateProjectPage from "@/pages/dashboard/project/create";

jest.mock("@/hocs/withUser", () => (children: JSX.Element) => children);

describe("src/pages/dashboard/project/create", () => {
  it("should render correctly", () => {
    render(
      <MockedProvider>
        <CreateProjectPage/>
      </MockedProvider>
    );
  });
});
