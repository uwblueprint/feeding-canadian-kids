import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import Dashboard from "../Dashboard";

// Example React test.
// For more information on React component testing, visit:
// https://jestjs.io/docs/tutorial-react
// https://reactjs.org/docs/testing.html

jest.mock("@apollo/client", () => ({
  gql: () => {},
  useMutation: () => [],
}));

describe("Dashboard page", () => {
  it("Should render Create Request button", () => {
    const page = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );
    const button = page.queryByText("+ Create Request");
    expect(button).toBeVisible();
  });
});
