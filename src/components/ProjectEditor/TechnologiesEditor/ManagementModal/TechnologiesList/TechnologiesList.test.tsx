import React from "react";

import { GraphQLError } from "graphql";
import { InMemoryCache } from "@apollo/client";

import { render, fireEvent, act, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import TechnologiesList, { DELETE_TECHNOLOGY, UPDATE_TECHNOLOGY } from "./TechnologiesList";

const TECHNOLOGIES_MOCK = [
  { _id: "test-id-1", name: "test 1" },
  { _id: "test-id-2", name: "test 2" },
  { _id: "test-id-3", name: "test 3" }
];

const createCache = () => {
  return new InMemoryCache().restore({
    ROOT_QUERY: {
      technologies: TECHNOLOGIES_MOCK
    }
  });
}

const renderComponent = (props: {[key: string]: any}) => {
  return render(
    <MockedProvider mocks={props.mocks ?? []} cache={props.cache ?? new InMemoryCache()}>
      <TechnologiesList
        technologies={props.technologies ?? TECHNOLOGIES_MOCK}
        selectedTechnologies={props.selectedTechnologies ?? ["test 1"]}
        setSelectedTechnologies={props.setSelectedTechnologies ?? jest.fn()}
      />
    </MockedProvider>
  );
}

describe("src/components/ProjectEditor/Technologies/ManagementModal/TechnologiesList", () => {
  it("should render correctly", () => {
    const { queryByText, getByLabelText } = renderComponent({});

    TECHNOLOGIES_MOCK.forEach(technology => {
      expect(queryByText(technology.name)).toBeInTheDocument();
    });

    const technologyCheckbox = getByLabelText("test 1") as HTMLInputElement;
    expect(technologyCheckbox.checked).toBeTruthy();
  });

  it("should display a message when there are no technologies to display", () => {
    const { queryByText } = renderComponent({ technologies: [] });
    expect(queryByText("There are no technologies")).toBeInTheDocument();
  });

  describe("toggleTechnology", () => {
    it("should call setSelectedTechnologies with a new technology", () => {
      const setSelectedTechnologiesMock = jest.fn();
      const { getByLabelText } = renderComponent({ setSelectedTechnologies: setSelectedTechnologiesMock });

      const technologyCheckbox = getByLabelText("test 2");
      fireEvent.click(technologyCheckbox);

      expect(setSelectedTechnologiesMock).toHaveBeenCalledWith(["test 1", "test 2"]);
    });

    it("should call setSelectedTechnologies with onw less technology", () => {
      const setSelectedTechnologiesMock = jest.fn();
      const { getByLabelText } = renderComponent({ setSelectedTechnologies: setSelectedTechnologiesMock });

      const technologyCheckbox = getByLabelText("test 1");
      fireEvent.click(technologyCheckbox);

      expect(setSelectedTechnologiesMock).toHaveBeenCalledWith([]);
    });
  });

  describe("handleDeleteTechnology", () => {
    const mock = {
      request: {
        query: DELETE_TECHNOLOGY,
        variables: {
          technologyId: "test-id-3"
        }
      },
      result: {
        data: {
          deleteTechnology: TECHNOLOGIES_MOCK[2]
        }
      }
    };

    it("should delete a technology", async () => {
      const cache = createCache();

      const { getAllByText } = renderComponent({ mocks: [mock], cache });

      const confirmationYesButtons = getAllByText("Yes");
      fireEvent.click(confirmationYesButtons[2]);

      await act(() => new Promise(resolve => setTimeout(resolve, 0)));

      // here we check if the project has been deleted correctly
      const { technologies } = cache.extract().ROOT_QUERY;
      expect(technologies).toEqual([TECHNOLOGIES_MOCK[0], TECHNOLOGIES_MOCK[1]]);
    });

    it("should delete the technology from the selectedTechnologies array when the deleted technology is selected", async () => {
      const setSelectedTechnologiesMock = jest.fn();

      const { getAllByText } = renderComponent({
        mocks: [mock],
        selectedTechnologies: ["test 1", "test 3"],
        setSelectedTechnologies: setSelectedTechnologiesMock
      });

      const confirmationYesButtons = getAllByText("Yes");
      fireEvent.click(confirmationYesButtons[2]);

      await act(() => new Promise(resolve => setTimeout(resolve, 0)));

      expect(setSelectedTechnologiesMock).toHaveBeenCalledWith(["test 1"]);
    });

    it("should display a loader when is loading", async () => {
      const { queryByText, getAllByText } = renderComponent({ mocks: [mock] });

      const confirmationYesButtons = getAllByText("Yes");
      fireEvent.click(confirmationYesButtons[2]);

      expect(queryByText("Deleting a technology")).toBeInTheDocument();

      await act(() => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByText("Deleting a technology")).not.toBeInTheDocument();
    });

    it("should display a message when an error appears", async () => {
      const mocks = [
        {
          ...mock,
          result: {
            errors: [new GraphQLError("test error")]
          }
        }
      ];

      const { queryByText, getAllByText } = renderComponent({ mocks });

      const confirmationYesButtons = getAllByText("Yes");
      fireEvent.click(confirmationYesButtons[2]);

      await act(() => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByText("test error")).toBeInTheDocument();
    });
  });

  describe("handleEditTechnology", () => {
    const mock = {
      request: {
        query: UPDATE_TECHNOLOGY,
        variables: {
          technologyId: "test-id-1",
          name: "updated technology"
        }
      },
      result: {
        data: {
          updateTechnology: {
            _id: "test-id-1",
            name: "updated technology"
          }
        }
      }
    };

    const submitEditTechnologyForm = () => {
      const dropdownEditActions = screen.getAllByText("Edit");
      fireEvent.click(dropdownEditActions[0]);

      const editTechnologyInput = screen.getByDisplayValue("test 1");
      fireEvent.change(editTechnologyInput, { target: { value: "updated technology" } });
      fireEvent.click(screen.getByTestId("technology-form-confirm-button"));     
    }

    it("should edit a technology", async () => {
      const cache = createCache();
      renderComponent({ mocks: [mock], cache });
      submitEditTechnologyForm();

      await act(() => new Promise(resolve => setTimeout(resolve, 0)));

      // now i wanna check if the technology has been updated
      const { technologies } = cache.extract().ROOT_QUERY;
      expect(technologies[0]).toEqual({
        _id: "test-id-1",
        name: "updated technology"
      });
    });   

    it("should update the technology from the selectedTechnologies array when the updated technology is selected", async () => {
      const setSelectedTechnologiesMock = jest.fn();

      renderComponent({
        mocks: [mock],
        selectedTechnologies: ["test 1", "test 2"],
        setSelectedTechnologies: setSelectedTechnologiesMock
      });

      submitEditTechnologyForm();

      await act(() => new Promise(resolve => setTimeout(resolve, 0)));

      expect(setSelectedTechnologiesMock).toHaveBeenCalledWith(["updated technology", "test 2"]);
    });

    it("should display a loader when is loading", async () => {
      const { queryByText } = renderComponent({ mocks: [mock] });

      submitEditTechnologyForm();

      expect(queryByText("Updating a technology")).toBeInTheDocument();

      await act(() => new Promise(resolve => setTimeout(resolve, 0)));

      expect(queryByText("Updating a technology")).not.toBeInTheDocument();
    });

    it("should display a message when an error appears", async () => {
      const mocks = [{
        ...mock,
        result: {
          errors: [new GraphQLError("error updating")]
        }
      }];

      const { queryByText } = renderComponent({ mocks });

      submitEditTechnologyForm();

      await act(() => new Promise(resolve => setTimeout(resolve, 0)));
      expect(queryByText("error updating")).toBeInTheDocument();
    });
  });
});
