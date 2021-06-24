const getPaginationPages = (totalPages: number, currentPage: number, adjacentLinks: number = 3): number[] => {
  let minPage = 0, maxPage = 0;
  let remainingLinks = adjacentLinks * 2;

  // In this variable we'll save the number of pages available after the current page
  // with the adjacentLinks as the limit
  const availableMaxPages = currentPage + adjacentLinks > totalPages ? totalPages - currentPage : adjacentLinks;
  // then we save the result of the avaible pages and the current page in the maxPage variable
  maxPage = currentPage + availableMaxPages;
  // and finally we subtract tha available pages to the remainingLinks
  remainingLinks -= availableMaxPages;

  const availableMinPages = currentPage - adjacentLinks > 0 ? adjacentLinks : currentPage - 1;
  minPage = currentPage - availableMinPages;
  remainingLinks -= availableMinPages;

  if(remainingLinks) {
    if(minPage === 1) {
      // if we have remainingLinks and the minPage is equal to 1, it meants maybe we can use
      // the remainingLinks in the maxPage
      maxPage = maxPage + remainingLinks > totalPages ? totalPages : maxPage + remainingLinks;
    } else {
      // if the minPage isn;t equal to 1, it means we can use the remainingLinks in the minPage
      minPage = minPage - remainingLinks > 0 ? minPage - remainingLinks : 1;
    }
  }

  const result = [];

  // and finally we create an array with all the pages
  for(let page = minPage; page <= maxPage; page++) {
    result.push(page);
  }

  return result;
}

export default getPaginationPages;
