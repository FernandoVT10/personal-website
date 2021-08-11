import React, { ComponentType } from "react";

export default jest.fn().mockImplementation((Component: ComponentType) => (props: {[key: string]: any}) => {
  return <Component {...props}/>;
});
