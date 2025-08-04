import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import App from "./App";

vi.mock("./hooks/useTheme", () => ({
  useTheme: () => ({ isDarkMode: false, toggleTheme: vi.fn() }),
}));

describe("App", () => {
  it("renders", () => {
    render(<App />);
  });
});
