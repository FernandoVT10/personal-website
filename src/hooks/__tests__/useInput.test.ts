import { renderHook, act } from "@testing-library/react-hooks";

import useInput from "../useInput";

describe("src/hooks/useInput", () => {
  it("should call setValue", () => {
    const setValueMock = jest.fn();

    const { result } = renderHook(() => useInput(setValueMock, null));

    act(() => result.current[1]("test string"));

    expect(setValueMock).toHaveBeenCalledWith("test string");
  });

  it("should return an error with the custom validator", () => {
    const validator = (value: string) => value === "test string" ? "this is an error message" : "";

    const { result } = renderHook(() => useInput(jest.fn(), validator));

    expect(result.current[0]).toBe("");

    act(() => result.current[1]("test string"));

    expect(result.current[0]).toBe("this is an error message");
  });
});
