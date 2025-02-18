import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GenericConnectionWidget, {
  GET_CONNECTION_METADATA,
} from "./GenericConnectionWidget";
import { useGetConnectionBySlugLazyQuery } from "./GenericConnectionWidget.generated";
import { TestApp } from "core/helpers/testutils";

jest.mock("./GenericConnectionWidget.generated", () => ({
  useGetConnectionBySlugLazyQuery: jest.fn(),
}));

const mockLazyQuery = useGetConnectionBySlugLazyQuery as jest.Mock;

jest.mock("core/hooks/useDebounce", () => ({
  __esModule: true,
  default: jest.fn((value) => value),
}));

const generateMockPipeline = (multiple = false) => ({
  parameter: {
    code: "test_param",
    widget: "datasets_picker",
    multiple,
    type: "str",
    connection: "test_connection",
  },
  form: {
    formData: { test_connection: "mock_connection_slug", test_param: null },
    setFieldValue: jest.fn(),
  },
  workspaceSlug: "mock_workspace",
});

describe("GenericConnectionWidget", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component correctly", async () => {
    const pipeline = generateMockPipeline();
    mockLazyQuery.mockReturnValue([jest.fn(), { data: null, loading: false }]);

    render(
      <TestApp>
        <GenericConnectionWidget {...pipeline} />
      </TestApp>,
    );

    expect(screen.getByPlaceholderText("Select options")).toBeInTheDocument();
  });

  it("fetches data when connection is provided", async () => {
    const pipeline = generateMockPipeline();
    const mockFetch = jest.fn().mockResolvedValue({
      data: {
        connectionBySlug: {
          queryMetadata: {
            items: [{ id: "1", name: "Test Item" }],
            totalItems: 1,
          },
        },
      },
    });

    mockLazyQuery.mockReturnValue([mockFetch, { data: null, loading: false }]);

    render(
      <TestApp>
        <GenericConnectionWidget {...pipeline} />
      </TestApp>,
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith({
        variables: {
          workspaceSlug: "mock_workspace",
          connectionSlug: "mock_connection_slug",
          type: "DATASETS",
          search: "",
          perPage: 10,
          page: 1,
        },
      });
    });
  });

  it("updates selected value in single select mode", async () => {
    const pipeline = generateMockPipeline(false);
    const mockFetch = jest.fn().mockResolvedValue({
      data: {
        connectionBySlug: {
          queryMetadata: {
            items: [{ id: "1", name: "Test Item" }],
            totalItems: 1,
          },
        },
      },
    });

    mockLazyQuery.mockReturnValue([mockFetch, { data: null, loading: false }]);

    const { container } = render(
      <TestApp>
        <GenericConnectionWidget {...pipeline} />
      </TestApp>,
    );
    const user = userEvent.setup();
    await user.click(await screen.findByTestId("combobox-button"));
    waitFor(() => {
      const options = screen.queryAllByTestId("combobox-options");
      expect(options.length).toBe(1);
    });
  });

  it("updates selected values in multiple mode", async () => {
    const pipeline = generateMockPipeline(true);
    const mockFetch = jest.fn().mockResolvedValue({
      data: {
        connectionBySlug: {
          queryMetadata: {
            items: [
              { id: "1", name: "Item 1" },
              { id: "2", name: "Item 2" },
            ],
            totalItems: 2,
          },
        },
      },
    });

    mockLazyQuery.mockReturnValue([mockFetch, { data: null, loading: false }]);

    render(
      <TestApp>
        <GenericConnectionWidget {...pipeline} />
      </TestApp>,
    );
    const user = userEvent.setup();
    await user.click(await screen.findByTestId("combobox-button"));
    waitFor(() => {
      const options = screen.queryAllByTestId("combobox-options");
      expect(options.length).toBe(2);
    });
  });

  it("handles missing id and uses level instead", async () => {
    const pipeline = generateMockPipeline(false);
    const mockFetch = jest.fn().mockResolvedValue({
      data: {
        connectionBySlug: {
          queryMetadata: {
            items: [{ level: 3, name: "District" }],
            totalItems: 1,
          },
        },
      },
    });

    mockLazyQuery.mockReturnValue([mockFetch, { data: null, loading: false }]);

    render(
      <TestApp>
        <GenericConnectionWidget {...pipeline} />
      </TestApp>,
    );

    const user = userEvent.setup();
    await user.click(await screen.findByTestId("combobox-button"));
    waitFor(() => {
      user.click(screen.getByText("District"));
      expect(pipeline.form.setFieldValue).toHaveBeenCalledWith("test_param", 3);
    });
  });
});
