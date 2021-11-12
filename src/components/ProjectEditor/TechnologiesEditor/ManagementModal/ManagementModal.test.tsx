import React from "react";

import { render, act, fireEvent } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import ManagementModal, { GET_TECHNOLOGIES } from "./ManagementModal";

jest.mock("@/components/Modal", () => ({ children }) => {
  return children;
});

const TECHNOLOGIES_MOCK = [
  { _id: "test-id-1", name: "test 1" },
  { _id: "test-id-2", name: "test 2" },
  { _id: "test-id-3", name: "test 3" }
];

const MOCKS = [
  {
    request: {
      query: GET_TECHNOLOGIES
    },
    result: {
      data: {
        technologies: TECHNOLOGIES_MOCK
      }
    }
  }
];

const renderComponent = (props: {[key: string]: any} = {}) => {
  return render(
    <MockedProvider mocks={props.mocks ?? MOCKS}>
      <ManagementModal
        isActive={props.isActive ?? true}
        setIsActive={props.setIsActive ?? jest.fn()}
        selectedTechnologies={props.selectedTechnologies ?? []}
        setSelectedTechnologies={props.setSelectedTechnologies ?? jest.fn()}
      />
    </MockedProvider>
  );
}

describe("src/components/ProjectEditor/ManagementModal", () => {
  it("should render correctly", async () => {
    const { queryByText } = renderComponent();

    await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

    TECHNOLOGIES_MOCK.forEach(technology => {
      expect(queryByText(technology.name)).toBeInTheDocument();
    });
  });

  it("should render the loader when the technologies are loading", async () => {
    const { queryByText } = renderComponent();

    expect(queryByText("Loading technologies")).toBeInTheDocument();

    await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

    expect(queryByText("Loading technologies")).not.toBeInTheDocument();
  });

  describe("getTechnologiesBySearch", () => {
    it("should render only a technology", async () => {
      const { getByTestId, queryByText } = renderComponent();
      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      const searchTechnologyInput = getByTestId("search-technology");
      fireEvent.change(searchTechnologyInput, { target: { value: "test 1" } });

      expect(queryByText("test 1")).toBeInTheDocument();
      expect(queryByText("test 2")).not.toBeInTheDocument();
      expect(queryByText("test 3")).not.toBeInTheDocument();
    });

    it("shouldn't render the technologies", async () => {
      const { getByTestId, queryByText } = renderComponent();
      await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

      const searchTechnologyInput = getByTestId("search-technology");
      fireEvent.change(searchTechnologyInput, { target: { value: "test 102" } });

      expect(queryByText("test 1")).not.toBeInTheDocument();
      expect(queryByText("test 2")).not.toBeInTheDocument();
      expect(queryByText("test 3")).not.toBeInTheDocument();
    });
  });
});
