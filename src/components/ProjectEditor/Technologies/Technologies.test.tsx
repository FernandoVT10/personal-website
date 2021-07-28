import React from "react";

import { render, fireEvent, act } from "@testing-library/react";

import { GET_TECHNOLOGIES } from "./ManagementModal/ManagementModal";

import Technologies from "./Technologies";
import {MockedProvider} from "@apollo/client/testing";

jest.mock("@/components/Modal", () => ({ isActive, children }) => {
  return isActive ? children : null;
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
    <MockedProvider mocks={MOCKS}>
      <Technologies
        selectedTechnologies={props.selectedTechnologies ?? []}
        setSelectedTechnologies={props.setSelectedTechnologies ?? jest.fn()}
      />
    </MockedProvider>
  );
}

describe("src/components/ProjectEditor/Technologies", () => {
  it("should render correctly", () => {
    const { queryByText } = renderComponent({ selectedTechnologies: ["test 1", "test 2"] });

    expect(queryByText("test 1")).toBeInTheDocument();
    expect(queryByText("test 2")).toBeInTheDocument();
  });

  it("should activate the Modal", async () => {
    const { getByTestId, queryByText } = renderComponent();

    fireEvent.click(getByTestId("activate-modal-button"));
    await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

    TECHNOLOGIES_MOCK.forEach(technology => {
      expect(queryByText(technology.name)).toBeInTheDocument();
    });
  });

  it("should call setSelectedTechnologies", async () => {
    const setSelectedTechnologiesMock = jest.fn();

    const { getByTestId, getByLabelText } = renderComponent({
      selectedTechnologies: ["test 1", "test 3"],
      setSelectedTechnologies: setSelectedTechnologiesMock
    });

    fireEvent.click(getByTestId("activate-modal-button"));
    await act(async () => new Promise(resolve => setTimeout(resolve, 0)));

    const technologyCheckBox = getByLabelText("test 1");
    fireEvent.click(technologyCheckBox);

    expect(setSelectedTechnologiesMock).toHaveBeenCalledWith(["test 3"]);
  });
});
