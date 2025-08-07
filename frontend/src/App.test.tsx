import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import App from "./App";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext";

describe("App", () => {
  it("renders", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    )
  });
});
