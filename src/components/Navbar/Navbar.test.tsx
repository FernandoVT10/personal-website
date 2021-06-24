import React from "react";

import { render, fireEvent } from "@testing-library/react";

import Navbar from "./Navbar";

describe("src/components/Navbar", () => {
  it("should render correctly", () => {
    render(<Navbar/>);
  });

  it("should change the navbar menu class when we click the toggleButton", () => {
    const { getByTestId } = render(<Navbar/>);

    const navbarMenu = getByTestId("navbar-menu");
    
    expect(navbarMenu.classList.contains("active")).toBeFalsy();

    fireEvent.click(getByTestId("navbar-toggle-button"));

    expect(navbarMenu.classList.contains("active")).toBeTruthy();
  });
});
