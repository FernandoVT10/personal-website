export default jest.fn().mockImplementation(({ isActive, children }) => {
  if(!isActive) return null;
  return children;
});
