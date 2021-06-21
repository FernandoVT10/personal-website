import getPaginationPages from "../getPaginationPages";

const getExoectedPages = (start: number, end: number) => {
  const expectedPages = [];

  for(let i = start; i <= end; i++) {
    expectedPages.push(i);
  }

  return expectedPages;
}

describe("src/utils/getPaginationPages", () => {
  it("should return the pages correctly", () => {
    const expectedPages = getExoectedPages(989, 1009);

    expect(getPaginationPages(1024, 999, 10)).toEqual(expectedPages);
  });

  it("should return correct number of pages when current page is equal to 0", () => {
    const expectedPages = getExoectedPages(1, 21);

    expect(getPaginationPages(1024, 0, 10)).toEqual(expectedPages);
  });

  it("should return correct number of pages when current page is equal to the last page", () => {
    const expectedPages = getExoectedPages(1004, 1024);

    expect(getPaginationPages(1024, 1024, 10)).toEqual(expectedPages);
  });
});
