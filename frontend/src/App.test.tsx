import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./hooks/useTheme", () => ({
  useTheme: () => ({ isDarkMode: false, toggleTheme: vi.fn() }),
}));

describe("App", () => {
  it("renders New Note button when no note is selected", () => {
    render(<App />);
    expect(
      screen.getByRole("button", { name: /\+ new note/i })
    ).toBeInTheDocument();
  });
});
