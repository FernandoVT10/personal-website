import React from "react";

import { InMemoryCache } from "@apollo/client";

import { render, fireEvent, act, queryByText } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import CreateTechnology, { CREATE_TECHNOLOGY } from "./CreateTechnology";
import {GraphQLError} from "graphql";

const MOCKS = [
  {
    request: {
      query: CREATE_TECHNOLOGY,
      variables: {
        name: "TestJS"
      }
    },
    result: {
      data: {
        createTechnology: {
          _id: "created-technology-id",
          name: "TestJS"
        }
      }
    }
  }
];

const getCache = () => {
  const cache = new InMemoryCache();

  cache.restore({
    ROOT_QUERY: {
      technologies: [{
        _id: "testid",
        name: "test technology"
      }]
    }
  });

  return cache;
}

const renderComponent = (props: {[key: string]: any} = {}) => {
  const cache = props.cache ?? getCache();

  return render(
    <MockedProvider mocks={props.mocks ?? MOCKS} cache={cache}>
      <CreateTechnology/>
    </MockedProvider>
  );
}

describe("src/components/ProjectEditor/Technologies/ManagementModal/CreateTechnology", () => {
  it("should render the create technology form correctly", () => {
    const { queryByText, getByText } = renderComponent();

    const createNewTechnologyButton = getByText("Create new technology");
    fireEvent.click(createNewTechnologyButton);

    expect(queryByText("Cancel")).toBeInTheDocument();
    expect(queryByText("Create")).toBeInTheDocument();
  });

  it("should hide the create technology form when we click on the cancel button", () => {
    const { queryByText, getByText } = renderComponent();

    fireEvent.click(getByText("Create new technology"));
    fireEvent.click(getByText("Cancel"));

    expect(queryByText("Cancel")).not.toBeInTheDocument();
    expect(queryByText("Create")).not.toBeInTheDocument();
    expect(queryByText("Create new technology")).toBeInTheDocument();
  });

  describe("handleForm", () => {
    it("should create a technology", async () => {
      const cache = getCache();

      const { getByLabelText, getByText } = renderComponent({ cache });
      fireEvent.click(getByText("Create new technology"));

      const input = getByLabelText("Name");
      fireEvent.change(input,  { target: { value: "TestJS" } });
      fireEvent.click(getByText("Create"));

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      const { technologies } = cache.extract().ROOT_QUERY;

      expect(technologies).toEqual([
        { _id: "testid", name: "test technology" },
        { _id: "created-technology-id", name: "TestJS" }
      ]);
    });

    it("should hide the form when a technology is created", async () => {
      const { getByLabelText, queryByText, getByText } = renderComponent();
      fireEvent.click(getByText("Create new technology"));

      const input = getByLabelText("Name");
      fireEvent.change(input,  { target: { value: "TestJS" } });
      fireEvent.click(getByText("Create"));

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByText("Cancel")).not.toBeInTheDocument();
      expect(queryByText("Create")).not.toBeInTheDocument();
      expect(queryByText("Create new technology")).toBeInTheDocument();
    });

    it("should clear the input when a technology is created", async () => {
      const { getByLabelText, getByText } = renderComponent();
      fireEvent.click(getByText("Create new technology"));

      const input = getByLabelText("Name") as HTMLInputElement;
      fireEvent.change(input,  { target: { value: "TestJS" } });
      fireEvent.click(getByText("Create"));

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      fireEvent.click(getByText("Create new technology"));
      expect(input.value).toBe("");
    });

    it("should display a message when an error appears", async () => {
      const mocks = [
        {
          ...MOCKS[0],
          result: {
            errors: [new GraphQLError("error creating the technology")]
          }
        }
      ];

      const { queryByText, getByLabelText, getByText } = renderComponent({ mocks });
      fireEvent.click(getByText("Create new technology"));

      const input = getByLabelText("Name") as HTMLInputElement;
      fireEvent.change(input,  { target: { value: "TestJS" } });
      fireEvent.click(getByText("Create"));

      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByText("error creating the technology")).toBeInTheDocument();
    });
  });

  it("should display a loader when the mutation is loading", async () => {
    const { queryByText, getByLabelText, getByText, queryByTestId } = renderComponent();
    fireEvent.click(getByText("Create new technology"));

    const input = getByLabelText("Name");
    fireEvent.change(input,  { target: { value: "TestJS" } });
    fireEvent.click(getByText("Create"));

    expect(queryByTestId("loader-component")).toBeInTheDocument();
    expect(queryByText("Create")).not.toBeInTheDocument();
    expect(queryByText("Cancel")).not.toBeInTheDocument();

    await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

    expect(queryByTestId("loader-component")).not.toBeInTheDocument();
  });
});
