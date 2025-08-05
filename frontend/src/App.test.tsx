import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import App from "./App";
import { BrowserRouter } from "react-router";

describe("App", () => {
  it("renders", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>);
  });
});
