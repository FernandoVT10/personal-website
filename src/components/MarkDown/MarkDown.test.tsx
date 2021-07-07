import React from "react";

import DOMPurify from "dompurify";
import hljs from "highlight.js";
import marked from "marked";

import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

jest.mock("dompurify");
jest.mock("highlight.js");
jest.mock("marked");

const sanitizeMocked = mocked(DOMPurify.sanitize);
const hljsGetLanguageMocked = mocked(hljs.getLanguage);
const hljsHighlightMocked = mocked(hljs.highlight);
const markedMocked = mocked(marked);
const markedSetOptionsMocked = mocked(marked.setOptions);

describe("src/components/MarkDown", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    sanitizeMocked.mockImplementation(value => value as any);
  });

  it("should set the marked options", async () => {
    await import("./MarkDown");

    markedMocked.mockImplementation(() => "parsed content");

    hljsGetLanguageMocked.mockImplementation(() => true as any);

    hljsHighlightMocked.mockImplementation(() => ({
      value: "test value"
    } as any));

    const setOptionsCall = markedSetOptionsMocked.mock.calls[0][0];

    expect(setOptionsCall.langPrefix).toBe("hljs language-");
    expect(setOptionsCall.highlight("test code", "test language")).toBe("test value");

    expect(setOptionsCall.renderer.codespan("test code")).toBe(`<code class="codeSpan">test code</code>`);

    expect(hljsGetLanguageMocked).toHaveBeenCalledWith("test language");
    expect(hljsHighlightMocked).toHaveBeenCalledWith("test code", { language: "test language" });
  });

  it("should render correctly", async () => {
    const MarkDown = await import("./MarkDown");

    markedMocked.mockImplementation(() => "parsed content");

    const { queryByText } = render(<MarkDown.default content="test content" />);

    expect(queryByText("parsed content")).toBeInTheDocument();
  });
});
