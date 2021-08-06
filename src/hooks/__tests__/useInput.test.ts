import { renderHook, act } from "@testing-library/react-hooks";

import useInput from "../useInput";

describe("src/hooks/useInput", () => {
  describe("onChange", () => {
    it("should call setValue", () => {
      const setValueMock = jest.fn();

      const { result } = renderHook(() => useInput(setValueMock, null));

      act(() => result.current[1].onChange("test string"));

      expect(setValueMock).toHaveBeenCalledWith("test string");
    });

    it("should remove the error when the value is valid ", () => {
      const validator = (value: string) => value === "test string" ? "" : "this is an error message";

      const { result } = renderHook(() => useInput(jest.fn(), validator));

      act(() => result.current[1].onBlur("other text"));
      expect(result.current[0]).toBe("this is an error message");

      act(() => result.current[1].onChange("test string"));
      expect(result.current[0]).toBe("");
    });
  });

  describe("onBlur", () => {
    it("should return an error with the custom validator", () => {
      const validator = (value: string) => value === "test string" ? "" : "this is an error message";

      const { result } = renderHook(() => useInput(jest.fn(), validator));

      expect(result.current[0]).toBe("");

      act(() => result.current[1].onBlur("random string"));

      expect(result.current[0]).toBe("this is an error message");
    });

    it("should remove the error when the value is valid", () => {
      const validator = (value: string) => value === "test string" ? "" : "this is an error message";

      const { result } = renderHook(() => useInput(jest.fn(), validator));

      act(() => result.current[1].onBlur("random string"));
      expect(result.current[0]).toBe("this is an error message");

      act(() => result.current[1].onBlur("test string"));
      expect(result.current[0]).toBe("");
    });
  });
});
