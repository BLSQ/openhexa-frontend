import { render, screen, waitFor } from "@testing-library/react";
import MarkdownEditor from "./MarkdownEditor";

describe("MarkdownEditor", () => {
  it("renders", async () => {
    render(<MarkdownEditor markdown="test" />);
    await waitFor(() => {
      expect(screen.getByTestId("markdown-editor")).toBeInTheDocument();
    });
  });
});
