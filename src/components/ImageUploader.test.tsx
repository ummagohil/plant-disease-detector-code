import { render, cleanup, within } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ImageUploader } from "./ImageUploader";

afterEach(cleanup);

describe("ImageUploader", () => {
  it("renders upload label when no imagePreviewUrl", () => {
    const { container } = render(
      <ImageUploader
        onImageSelect={vi.fn()}
        imagePreviewUrl={null}
        onClearImage={vi.fn()}
      />
    );
    expect(within(container).getByText(/Click to upload/i)).not.toBeNull();
  });

  it("calls onImageSelect when file is selected", async () => {
    const onImageSelect = vi.fn();
    const { container } = render(
      <ImageUploader
        onImageSelect={onImageSelect}
        imagePreviewUrl={null}
        onClearImage={vi.fn()}
      />
    );
    const input = within(container)
      .getByLabelText(/Click to upload/i)
      .parentElement?.querySelector('input[type="file"]');
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    await userEvent.upload(input!, file);
    expect(onImageSelect).toHaveBeenCalledWith(file);
  });

  it("renders image preview and clear button when imagePreviewUrl is set", () => {
    const { container } = render(
      <ImageUploader
        onImageSelect={vi.fn()}
        imagePreviewUrl="test-url"
        onClearImage={vi.fn()}
      />
    );
    const img = within(container).getByAltText(/Plant preview/i);
    // @ts-expect-error
    expect(img).toBeTruthy();
    const buttons = within(container).getAllByRole("button", {
      name: /clear image/i,
    });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("calls onClearImage when clear button is clicked", () => {
    const onClearImage = vi.fn();
    const { container } = render(
      <ImageUploader
        onImageSelect={vi.fn()}
        imagePreviewUrl="test-url"
        onClearImage={onClearImage}
      />
    );
    const buttons = within(container).getAllByRole("button", {
      name: /clear image/i,
    });
    fireEvent.click(buttons[buttons.length - 1]);
    expect(onClearImage).toHaveBeenCalled();
  });
});
