import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  LeafIcon,
  UploadCloudIcon,
  SparklesIcon,
  AlertTriangleIcon,
  XCircleIcon,
} from "./IconComponents";

describe("IconComponents", () => {
  it("renders LeafIcon", () => {
    const { container } = render(<LeafIcon />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
  it("renders UploadCloudIcon", () => {
    const { container } = render(<UploadCloudIcon />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
  it("renders SparklesIcon", () => {
    const { container } = render(<SparklesIcon />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
  it("renders AlertTriangleIcon", () => {
    const { container } = render(<AlertTriangleIcon />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
  it("renders XCircleIcon", () => {
    const { container } = render(<XCircleIcon />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
