import React from "react";

import Router from "next/router";

import { render, act } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import apolloClient from "@/config/apolloClient";

import withUser, { CHECK_LOGIN_STATUS } from "../withUser";

jest.mock("next/router");
jest.mock("@/config/apolloClient", () => ({
  query: jest.fn()
}));

const routerPushMocked = mocked(Router.push);
const apolloClientQueryMocked = mocked(apolloClient.query);

const TestComponent = ({ loggedIn }) => {
  return (
    <div>
      <p>test text</p>
      { loggedIn && "is logged in" }
    </div>
  );
}

describe("src/hocs/withUser", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    apolloClientQueryMocked.mockResolvedValue({
      data: {
        checkLoginStatus: true
      }
    } as any);
  });

  it("should render the WrappedComponent correctly", async () => {
    const Component = withUser(TestComponent, true, "redirect/test");
    const { queryByText } = render(<Component/>);

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(queryByText("test text")).toBeInTheDocument();
    expect(queryByText("is logged in")).toBeInTheDocument();

    expect(apolloClientQueryMocked).toHaveBeenCalledWith({
      query: CHECK_LOGIN_STATUS,
      fetchPolicy: "no-cache"
    });
  });

  it("should render a loader while is loading", async () => {
    const Component = withUser(TestComponent, true, "redirect/test");
    const { queryByText } = render(<Component/>);

    expect(queryByText("Logging in")).toBeInTheDocument();

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(queryByText("Logging in")).not.toBeInTheDocument();
  });

  it("should redirect us when we aren't logged in and protectedRoute is equal to true", async () => {
    apolloClientQueryMocked.mockResolvedValue({
      data: {
        checkLoginStatus: false
      }
    } as any);

    const Component = withUser(TestComponent, true, "redirect/test");
    render(<Component/>);

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(routerPushMocked).toHaveBeenCalledWith("redirect/test");
  });

  it("shouldn't redirect us when we aren't logged in and protectedRoute is equal to false", async () => {
    apolloClientQueryMocked.mockResolvedValue({
      data: {
        checkLoginStatus: false
      }
    } as any);

    const Component = withUser(TestComponent, false, "redirect/test");
    const { queryByText } = render(<Component/>);

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(queryByText("test text")).toBeInTheDocument();
    expect(queryByText("is logged in")).not.toBeInTheDocument();

    expect(routerPushMocked).not.toHaveBeenCalled();
  });
});
