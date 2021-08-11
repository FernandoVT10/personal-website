export default jest.fn().mockImplementation((files: File[]) => Promise.resolve(
  files.map(file => `${file.name}.jpg`)
));
