import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import WorkspaceWebappPage from "pages/workspaces/[workspaceSlug]/webapps/[webappId]";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useUpdateWebappMutation } from "webapps/graphql/mutations.generated";
import { useDeleteWebappMutation } from "workspaces/graphql/mutations.generated";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("next-i18next", () => ({
  useTranslation: jest.fn().mockReturnValue({ t: (key: string) => key }),
}));

const mockMe = jest.fn(() => ({
  features: [{ code: "webapps", config: {} }],
  avatar: {
    initials: "TU",
    color: "",
  },
  permissions: {
    createWorkspace: false,
  },
}));

const mockWorkspace = {
  slug: "test-workspace",
  countries: [],
  permissions: {
    launchNotebookServer: false,
    manageMembers: false,
  },
};

const mockWebapp = {
  id: "1",
  name: "Test Webapp",
  isFavorite: false,
  icon: "",
  createdBy: {
    displayName: "User 1",
    avatar: {
      initials: "U",
      color: "",
    },
  },
  permissions: {
    delete: true,
    update: true,
  },
};

const sideBarMocks = {
  pendingWorkspaceInvitations: { totalItems: 1 },
  workspaces: {
    totalItems: 2,
    items: [
      {
        slug: "workspace-1",
        name: "Workspace 1",
        countries: [{ code: "US", flag: "🇺🇸" }],
      },
      {
        slug: "workspace-2",
        name: "Workspace 2",
        countries: [{ code: "FR", flag: "🇫🇷" }],
      },
    ],
  },
};

jest.mock("identity/hooks/useMe", () => () => mockMe());

jest.mock("@apollo/client", () => ({
  __esModule: true,
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  gql: jest.fn(() => "GQL"),
}));

const useQueryMock = useQuery as jest.Mock;
const useMutationMock = useMutation as jest.Mock;
useMutationMock.mockReturnValue([jest.fn(), { loading: false }]);

useQueryMock.mockReturnValue({
  data: {
    workspace: mockWorkspace,
    webapp: mockWebapp,
    ...sideBarMocks,
  },
  loading: false,
  error: null,
  refetch: jest.fn(),
});

jest.mock("webapps/graphql/mutations.generated", () => ({
  useCreateWebappMutation: () => [jest.fn()],
  useUpdateWebappMutation: jest.fn(),
}));
jest.mock("workspaces/graphql/mutations.generated", () => ({
  useDeleteWebappMutation: jest.fn(),
}));

const mockUpdateWebapp = jest.fn();
(useUpdateWebappMutation as jest.Mock).mockReturnValue([
  mockUpdateWebapp,
  { loading: false },
]);

mockUpdateWebapp.mockResolvedValue({
  data: {
    updateWebapp: {
      webapp: {
        id: "1",
        name: "Updated Webapp",
      },
    },
  },
});

const mockDeleteWebapp = jest.fn();
(useDeleteWebappMutation as jest.Mock).mockReturnValue([
  mockDeleteWebapp,
  { loading: false },
]);

mockDeleteWebapp.mockResolvedValue({
  data: {
    deleteWebapp: {
      success: true,
      errors: [],
    },
  },
});

describe("WorkspaceWebappPage", () => {
  it("can update a web app", async () => {
    render(<WorkspaceWebappPage webappId="1" workspaceSlug="test-workspace" />);

    await waitFor(() => {
      expect(screen.getByText("Webapp Details")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const nameParent = screen
      .getByText("Name")
      .closest("div") as HTMLDivElement;
    const nameInput = within(nameParent).getByRole("textbox");
    fireEvent.change(nameInput, { target: { value: "Updated Webapp" } });

    const urlParent = screen.getByText("URL").closest("div") as HTMLDivElement;
    const urlInput = within(urlParent).getByRole("textbox");
    fireEvent.change(urlInput, {
      target: { value: "https://updated-url.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Webapp updated successfully");
    });
  });

  it("can delete a web app", async () => {
    render(<WorkspaceWebappPage webappId="1" workspaceSlug="test-workspace" />);

    await waitFor(() => {
      expect(screen.getByText("Webapp Details")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(screen.getByText("Delete webapp")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Webapp deleted successfully.",
      );
    });
  });
});
