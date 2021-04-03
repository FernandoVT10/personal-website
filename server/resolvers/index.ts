const books = [
  {
    title: "this is a title",
    author: "this is an author"
  },
  {
    title: "this is a title 2",
    author: "this is an author 2"
  },
];

export default {
  Query: {
    books: () => books
  }
}
