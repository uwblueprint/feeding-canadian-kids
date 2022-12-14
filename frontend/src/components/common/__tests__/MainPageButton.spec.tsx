import React from "react";
import { BrowserRouter } from "react-router-dom";
import { create } from "react-test-renderer";

import MainPageButton from "../MainPageButton";

// Example snapshot test.
// For more information on React testing, visit:
// https://jestjs.io/docs/tutorial-react
// https://reactjs.org/docs/testing.html

describe("MainPageButton component", () => {
  it("should match the snapshot", () => {
    const button = create(
      <BrowserRouter>
        <MainPageButton />
      </BrowserRouter>,
    );
    expect(button.toJSON()).toMatchSnapshot();
  });
});
