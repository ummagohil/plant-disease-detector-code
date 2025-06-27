import { render, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { LoadingSpinner } from "./LoadingSpinner";

afterEach(cleanup);

describe("LoadingSpinner", () => {
  it("renders an SVG spinner", () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('svg[role="status"]');
    expect(svg).not.toBeNull();
    expect(svg?.tagName).toBe("svg");
  });

  it("applies custom className", () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    const svg = container.querySelector('svg[role="status"]');
    expect(svg?.classList.contains("custom-class")).toBe(true);
  });
});
