import { render, cleanup } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { describe, it, expect, afterEach } from "vitest";
import { AnalysisDisplay } from "./AnalysisDisplay";

afterEach(cleanup);

describe("AnalysisDisplay", () => {
  it("renders loading spinner and text when isLoading", () => {
    const { container } = render(
      <AnalysisDisplay result={null} isLoading={true} />
    );
    expect(container.textContent).toMatch(/Analyzing your plant/i);
    const svg = container.querySelector('svg[role="status"]');
    expect(svg).not.toBeNull();
  });

  it("renders nothing if not loading and no result", () => {
    const { container } = render(
      <AnalysisDisplay result={null} isLoading={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders formatted result with headings and lists", () => {
    const { container } = render(
      <AnalysisDisplay
        result={
          "# Heading\n## Subheading\n### Minor\n* List item\n- Another item\n"
        }
        isLoading={false}
      />
    );
    expect(container.textContent).toMatch("Heading");
    expect(container.textContent).toMatch("Subheading");
    expect(container.textContent).toMatch("Minor");
    expect(container.textContent).toMatch("List item");
    expect(container.textContent).toMatch("Another item");
  });
});
