import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useMutation, useQuery } from "@apollo/client";
import WebappsPage from "./index";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
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

jest.mock("identity/hooks/useMe", () => () => mockMe());
jest.mock("identity/hooks/useFeature", () => jest.fn().mockReturnValue([true]));
jest.mock("@apollo/client", () => ({
  __esModule: true,
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  gql: jest.fn(() => "GQL"),
}));

const useQueryMock = useQuery as jest.Mock;
const useMutationMock = useMutation as jest.Mock;
useMutationMock.mockReturnValue([jest.fn(), { loading: false }]);

const mockWorkspace = {
  slug: "test-workspace",
  countries: [],
  permissions: {
    launchNotebookServer: false,
    manageMembers: false,
  },
};

const webapp = (id: string) => ({
  id: id,
  name: `Webapp ${id}`,
  isFavorite: false,
  icon: "",
  createdBy: {
    displayName: `User ${id}`,
    avatar: {
      initials: "U",
      color: "",
    },
  },
});
const mockWebapps = {
  pageNumber: 1,
  totalPages: 2,
  totalItems: 16,
  items: Array.from({ length: 15 }, (_, index) =>
    webapp((index + 1).toString()),
  ),
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

describe("WebappsPage", () => {
  it("renders the list of webapps", async () => {
    useQueryMock.mockReturnValue({
      loading: false,
      data: {
        workspace: mockWorkspace,
        webapps: mockWebapps,
        ...sideBarMocks,
      },
      error: null,
    });

    render(<WebappsPage page={1} perPage={15} />);

    await waitFor(() => {
      expect(screen.getByText("Webapp 1")).toBeInTheDocument();
    });
  });

  it("adds a webapp to favorites", async () => {
    useQueryMock.mockReturnValue({
      loading: false,
      data: {
        workspace: mockWorkspace,
        webapps: mockWebapps,
        ...sideBarMocks,
      },
      error: null,
    });

    render(<WebappsPage page={1} perPage={15} />);

    await waitFor(() => {
      expect(screen.getByText("Webapp 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("star-icon-1"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Added to favorites");
    });
  });

  it("removes a webapp from favorites", async () => {
    const updatedMocks = {
      ...mockWebapps,
      items: mockWebapps.items.map((item) =>
        item.id === "1" ? { ...item, isFavorite: true } : item,
      ),
    };

    useQueryMock.mockReturnValue({
      loading: false,
      data: {
        workspace: mockWorkspace,
        webapps: updatedMocks,
        ...sideBarMocks,
      },
      error: null,
    });

    render(<WebappsPage page={1} perPage={15} />);

    await waitFor(() => {
      expect(screen.getByText("Webapp 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("star-icon-1"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Removed from favorites");
    });
  });

  it("handles pagination", async () => {
    useQueryMock.mockReturnValue({
      loading: false,
      data: {
        workspace: mockWorkspace,
        webapps: mockWebapps,
        ...sideBarMocks,
      },
      error: null,
    });

    render(<WebappsPage page={1} perPage={15} />);
    const previousButton = screen.getByRole("button", { name: /Previous/i });
    const nextButton = previousButton.nextElementSibling as HTMLButtonElement;
    await waitFor(() => {
      expect(nextButton).toBeInTheDocument();
    });

    useQueryMock.mockReturnValue({
      loading: false,
      data: {
        workspace: mockWorkspace,
        webapps: {
          ...mockWebapps,
          items: [webapp("16")],
        },
        ...sideBarMocks,
      },
      error: null,
    });

    fireEvent.click(nextButton);

    screen.debug();
    await waitFor(() => {
      expect(screen.getByText("Webapp 16")).toBeInTheDocument();
    });
  });
});
