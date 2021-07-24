import { renderHook, act } from "@testing-library/react-hooks";

import useProjectsFilter from "../useProjectsFilter";

Object.defineProperty(window, "location", {
  value: {
    search: "?"
  }
});

describe("src/hooks/useProjectsFilter", () => {
  beforeEach(() => {
    window.location.search = "?";
  });

  it("should set the variables to the default values when the location.search is null", () => {
    window.location.search = "?";

    const toTheChangeOfVariablesMock = jest.fn();

    const { result } = renderHook(() => useProjectsFilter(toTheChangeOfVariablesMock));
    const { search, selectedTechnology } = result.current;

    expect(search).toBe("");
    expect(selectedTechnology).toBe("");
    expect(toTheChangeOfVariablesMock).toHaveBeenCalledWith({
      page: 0,
      search: "",
      technology: ""
    });
  });

  it("should set the variables value with the location.search values and call toTheChangeOfVariables", () => {
    window.location.search = "?page=100&search=test&technology=NextJS";

    const toTheChangeOfVariablesMock = jest.fn();

    const { result } = renderHook(() => useProjectsFilter(toTheChangeOfVariablesMock));
    const { search, selectedTechnology } = result.current;

    expect(search).toBe("test");
    expect(selectedTechnology).toBe("NextJS");
    expect(toTheChangeOfVariablesMock).toHaveBeenCalledWith({
      page: 100,
      search: "test",
      technology: "NextJS"
    });
  });

  it("should set the variables again when we change the router.query parameter", () => {
    const toTheChangeOfVariablesMock = jest.fn();

    const { result, rerender } = renderHook(() => useProjectsFilter(toTheChangeOfVariablesMock));

    expect(result.current.search).toBe("");
    expect(result.current.selectedTechnology).toBe("");
    expect(toTheChangeOfVariablesMock).toHaveBeenCalledWith({
      page: 0,
      search: "",
      technology: ""
    });

    window.location.search = "?page=100&search=test&technology=NextJS";
    changeRouterProperties({
      query: {
        parameter: "test"
      }
    });

    rerender();
    // rerender(() => useProjectsFilter(toTheChangeOfVariablesMock));

    expect(result.current.search).toBe("test");
    expect(result.current.selectedTechnology).toBe("NextJS");
    expect(toTheChangeOfVariablesMock).toHaveBeenCalledWith({
      page: 100,
      search: "test",
      technology: "NextJS"
    });
  });

  describe("handleOnSubmit", () => {
    it("should call the router.push with the correspondent query", () => {
      const routerPushMock = jest.fn();

      changeRouterProperties({
        push: routerPushMock
      });

      const { result } = renderHook(() => useProjectsFilter(jest.fn()));

      act(() => {
        result.current.setSearch("test search");
        result.current.setSelectedTechnology("TestJS");
      });

      act(() => result.current.handleOnSubmit({ preventDefault: jest.fn() } as any));

      expect(routerPushMock).toHaveBeenCalledWith({
        pathname: "/test/",
        query: {
          search: "test search",
          technology: "TestJS"
        }
      });
    });

    it("should call router.push with only the search query parameter", () => {
      const routerPushMock = jest.fn();

      changeRouterProperties({
        push: routerPushMock
      });

      const { result } = renderHook(() => useProjectsFilter(jest.fn()));

      act(() => {
        result.current.setSearch("test search");
      });

      act(() => result.current.handleOnSubmit({ preventDefault: jest.fn() } as any));

      expect(routerPushMock).toHaveBeenCalledWith({
        pathname: "/test/",
        query: {
          search: "test search",
        }
      });
    });
  });
});
