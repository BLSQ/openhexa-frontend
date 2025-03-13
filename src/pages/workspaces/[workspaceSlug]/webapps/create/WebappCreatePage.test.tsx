import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import WebappCreatePage from "./index";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useCreateWebappMutation } from "webapps/graphql/mutations.generated";

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

useQueryMock.mockReturnValue({
  data: {
    workspace: mockWorkspace,
    ...sideBarMocks,
  },
  loading: false,
  error: null,
});

jest.mock("webapps/graphql/mutations.generated", () => ({
  useCreateWebappMutation: jest.fn(),
  useUpdateWebappMutation: () => [jest.fn()],
}));

const mockCreateWebapp = jest.fn();
(useCreateWebappMutation as jest.Mock).mockReturnValue([
  mockCreateWebapp,
  { loading: false },
]);
mockCreateWebapp.mockResolvedValue({
  data: {
    createWebapp: {
      webapp: {
        id: "1",
        name: "Test Webapp",
      },
    },
  },
});

describe("WebappCreatePage", () => {
  it("can create a web app", async () => {
    render(<WebappCreatePage workspace={mockWorkspace} />);

    await waitFor(() => {
      expect(screen.getByText("New Webapp")).toBeInTheDocument();
    });

    const nameParent = screen
      .getByText("Name")
      .closest("div") as HTMLDivElement;
    const nameInput = within(nameParent).getByRole("textbox");
    const urlParent = screen.getByText("URL").closest("div") as HTMLDivElement;
    const urlInput = within(urlParent).getByRole("textbox");

    fireEvent.change(nameInput, { target: { value: "Test Webapp" } });
    fireEvent.change(urlInput, {
      target: { value: "http://test-webapp.com" },
    });
    fireEvent.change(screen.getByLabelText("Change Icon"), {
      target: { files: [new File([""], "icon.png", { type: "image/png" })] },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Webapp created successfully");
    });
  });
});
