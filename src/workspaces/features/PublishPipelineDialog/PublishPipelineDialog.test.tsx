import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PublishPipelineDialog from "./PublishPipelineDialog";
import { MockedProvider } from "@apollo/client/testing";
import { useCreateTemplateVersionMutation } from "pipelines/graphql/mutations.generated";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

jest.mock("pipelines/graphql/mutations.generated", () => ({
  useCreateTemplateVersionMutation: jest.fn(),
}));

const pipeline = {
  id: "pipeline-id",
  currentVersion: { id: "version-id" },
  template: null,
};

const workspace = {
  slug: "workspace-slug",
};

const renderPublishPipelineDialog = (pipelineOverride = {}) => {
  const createTemplateVersionMock = jest.fn().mockResolvedValue({
    data: {
      createTemplateVersion: {
        success: true,
        errors: [],
      },
    },
  });

  (useCreateTemplateVersionMutation as jest.Mock).mockReturnValue([
    createTemplateVersionMock,
  ]);

  render(
    <MockedProvider>
      <PublishPipelineDialog
        open={true}
        onClose={jest.fn()}
        pipeline={{ ...pipeline, ...pipelineOverride }}
        workspace={workspace}
      />
    </MockedProvider>,
  );

  return { createTemplateVersionMock };
};

describe("PublishPipelineDialog", () => {
  it("submits the form successfully for a new template", async () => {
    const { createTemplateVersionMock } = renderPublishPipelineDialog();

    fireEvent.change(screen.getByLabelText("Template name"), {
      target: { value: "Test Template" },
    });
    fireEvent.change(screen.getByLabelText("Template description"), {
      target: { value: "Test Description" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create a Template" }));

    await waitFor(() => {
      expect(createTemplateVersionMock).toHaveBeenCalledWith({
        variables: {
          input: {
            name: "Test Template",
            code: "Test Template",
            description: "Test Description",
            config: "",
            workspace_slug: "workspace-slug",
            pipeline_id: "pipeline-id",
            pipeline_version_id: "version-id",
          },
        },
      });
    });

    expect(toast.success).toHaveBeenCalledWith(
      "New Template created successfully.",
    );
  });

  it("submits the form successfully for an existing template", async () => {
    const { createTemplateVersionMock } = renderPublishPipelineDialog({
      template: { name: "template-name" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Add a Template Version" }),
    );

    await waitFor(() => {
      expect(createTemplateVersionMock).toHaveBeenCalledWith({
        variables: {
          input: {
            name: "",
            code: "",
            description: "",
            config: "",
            workspace_slug: "workspace-slug",
            pipeline_id: "pipeline-id",
            pipeline_version_id: "version-id",
          },
        },
      });
    });

    expect(toast.success).toHaveBeenCalledWith(
      "New Template Version created successfully.",
    );
  });
});
