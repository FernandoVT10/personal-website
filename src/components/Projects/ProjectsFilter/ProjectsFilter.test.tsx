import React from "react";

import { render, fireEvent } from "@testing-library/react";

import ProjectsFilter, { getVariables } from "./ProjectsFilter";

const selectBoxComponentMock = jest.fn();
jest.mock("@/components/Formulary/SelectBox", () => ({ label, availableValues, currentValue, setValue }) => {
  selectBoxComponentMock({ label, availableValues, currentValue });
  return availableValues.map((value: string) => {
    return (
      <button onClick={() => setValue(value)} key={value}>{ value }</button>
    );
  });
});


const TECHNOLOGIES_MOCK = [
  { name: "technology 1" }, 
  { name: "technology 2" },
  { name: "technology 3" }
];

Object.defineProperty(window, "location", {
  value: {
    search: "?"
  }
});

describe("src/domain/Projects/Filters", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    changeRouterProperties({});

    window.location.search = "?";
  });

  it("should render correctly", () => {
    render(
      <ProjectsFilter
        technologiesData={{ technologies: TECHNOLOGIES_MOCK }}
        toTheChangeOfVariables={jest.fn()}
      />
    );

    const availableValues = TECHNOLOGIES_MOCK.map(technology => technology.name);

    expect(selectBoxComponentMock).toHaveBeenCalledWith({
      label: "Select a technology",
      availableValues,
      currentValue: ""
    })
  });

  describe("useEffect", () => {
    it("should set selectedTechnology and search and call toTheChangeOfVariables", () => {
      window.location.search = "?page=100&search=test search&technology=NextJS";

      const toTheChangeOfVariablesMock = jest.fn();
      const { getByDisplayValue } = render(
        <ProjectsFilter
          technologiesData={{ technologies: TECHNOLOGIES_MOCK }}
          toTheChangeOfVariables={toTheChangeOfVariablesMock}
        />
      );

      expect(toTheChangeOfVariablesMock).toHaveBeenCalledWith({
        page: 100, search: "test search", technology: "NextJS"
      });

      // check with the SelectBox if the selectedTechnology changed correctly
      expect(selectBoxComponentMock).toHaveBeenCalledWith(
        expect.objectContaining({
          currentValue: "NextJS"
        })
      );

      // search input
      expect(getByDisplayValue("test search")).toBeInTheDocument();
    });

    it("should change the variables when we change the router.query variable", () => {
      window.location.search = "?page=100&search=test search&technology=NextJS";

      const toTheChangeOfVariablesMock = jest.fn();
      const { getByDisplayValue, rerender } = render(
        <ProjectsFilter
          technologiesData={{ technologies: TECHNOLOGIES_MOCK }}
          toTheChangeOfVariables={toTheChangeOfVariablesMock}
        />
      );

      window.location.search = "?page=2&search=foo&technology=bar";

      // change the router.query variable
      changeRouterProperties({ query: { test: "test value" } });

      // rerendering the component
      rerender(
        <ProjectsFilter
          technologiesData={{ technologies: TECHNOLOGIES_MOCK }}
          toTheChangeOfVariables={toTheChangeOfVariablesMock}
        />
      );

      expect(toTheChangeOfVariablesMock).toHaveBeenCalledWith({
        page: 2, search: "foo", technology: "bar"
      });
      expect(toTheChangeOfVariablesMock).toHaveBeenCalledTimes(2);

      expect(selectBoxComponentMock).toHaveBeenCalledWith(
        expect.objectContaining({
          currentValue: "bar"
        })
      );

      // search input
      expect(getByDisplayValue("foo")).toBeInTheDocument();
    });
  });

  describe("getVariables", () => {
    it("should return all the variables from the window.location.search", () => {
      window.location.search = "?search=test search&technology=test technology&page=100";

      expect(getVariables()).toEqual({
        page: 100,
        search: "test search",
        technology: "test technology"
      });
    });

    it("should return the page variable as 0 when the page query parameter isn't a number", () => {
      window.location.search = "?page=invalid value";

      expect(getVariables().page).toBe(0);
    });

    it("should return all the variables with a default value when the window.location.search is null", () => {
      window.location.search = "";

      expect(getVariables()).toEqual({
        page: 0,
        search: "",
        technology: ""
      });
    });
  });

  describe("handleOnSubmit", () => {
    it("should call router.push", () => {
      // mock router.push
      const routerPushMock = jest.fn();
      changeRouterProperties({
        pathname: "/",
        push: routerPushMock
      });

      window.location.search = "?search=test search";

      const { getByDisplayValue, getByText, getByTestId } = render(
        <ProjectsFilter
          technologiesData={{ technologies: TECHNOLOGIES_MOCK }}
          toTheChangeOfVariables={jest.fn()}
        />
      );

      const searchInput = getByDisplayValue("test search");
      fireEvent.change(searchInput, { target: { value: "new search" } });

      // set the technology
      fireEvent.click(getByText("technology 3"));

      fireEvent.submit(getByTestId("filters-form"));

      expect(routerPushMock).toHaveBeenCalledWith({
        pathname: "/",
        query: {
          search: "new search",
          technology: "technology 3"
        }
      });
    });
  });
});
