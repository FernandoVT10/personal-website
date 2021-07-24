import React from "react";

import Router from "next/router";
import { GraphQLError } from "graphql";

import { render, fireEvent, act, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { MockedProvider } from "@apollo/client/testing";

import Login, { LOGIN } from "./Login";

jest.mock("next/router");
jest.mock("@/components/Loader", () => () => {
  return (
    <p>Loading...</p>
  );
});

const routerPushMocked = mocked(Router.push);

const changeInputValueByLabelText = (labelText: string, value: string) => {
  const usernameInput = screen.getByLabelText(labelText);
  fireEvent.change(usernameInput, { target: { value } });
}

const MOCKS = [{
  request: {
    query: LOGIN,
    variables: {
      username: "test username",
      password: "test password"
    }
  },
  result: {
    data: {
      login: "test token"
    }
  }
}];

describe("src/domain/Dashboard/Login", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should set the token to the localStorage and redirect to the dashboard", async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <Login/>
      </MockedProvider>
    );

    changeInputValueByLabelText("Username", "test username");
    changeInputValueByLabelText("Password", "test password");
    fireEvent.click(getByTestId("submit-button"));

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(localStorage.getItem("token")).toBe("test token");
    expect(routerPushMocked).toHaveBeenCalledWith("/dashboard");
  });

  it("should render a loader", async () => {
    const { getByTestId, queryByTestId, queryByText } = render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <Login/>
      </MockedProvider>
    );

    changeInputValueByLabelText("Username", "test username");
    changeInputValueByLabelText("Password", "test password");
    fireEvent.click(getByTestId("submit-button"));

    expect(queryByTestId("submit-button")).not.toBeInTheDocument();
    expect(queryByText("Loading...")).toBeInTheDocument();

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(queryByTestId("submit-button")).toBeInTheDocument();
    expect(queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("should display a message when an error appears", async () => {
    const mocks = [{
      request: {
        query: LOGIN,
        variables: {
          username: "test username",
          password: "test password"
        }
      },
      result: {
        errors: [new GraphQLError("test error message")]
      }
    }];

    const { getByTestId, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Login/>
      </MockedProvider>
    );

    changeInputValueByLabelText("Username", "test username");
    changeInputValueByLabelText("Password", "test password");
    fireEvent.click(getByTestId("submit-button"));

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(queryByText("test error message")).toBeInTheDocument();
  });
});
