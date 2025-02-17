import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import GenericConnectionWidget from "./GenericConnectionWidget";
import { useGetConnectionBySlugLazyQuery } from "./GenericConnectionWidget.generated";
import { GET_CONNECTION_METADATA } from "./GenericConnectionWidget";

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

jest.mock("./GenericConnectionWidget.generated", () => ({
  useGetConnectionBySlugLazyQuery: jest.fn(),
}));

const mockLazyQuery = useGetConnectionBySlugLazyQuery as jest.Mock;

jest.mock("../../../core/hooks/useDebounce", () => ({
  __esModule: true,
  default: jest.fn((value) => value),
}));

const generateMockPipeline = (multiple = false) => ({
  parameter: {
    code: "test_param",
    widget: "datasets_picker",
    multiple,
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
    mockLazyQuery.mockReturnValue([
      jest.fn().mockResolvedValue({ data: null }),
      { data: null, loading: false, fetchMore: jest.fn() },
    ]);

    render(
      <MockedProvider>
        <GenericConnectionWidget {...pipeline} />
      </MockedProvider>,
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

    mockLazyQuery.mockReturnValue([
      mockFetch,
      { data: null, loading: false, fetchMore: jest.fn() },
    ]);

    render(
      <MockedProvider>
        <GenericConnectionWidget {...pipeline} />
      </MockedProvider>,
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

    mockLazyQuery.mockReturnValue([
      mockFetch,
      { data: null, loading: false, fetchMore: jest.fn() },
    ]);

    render(
      <MockedProvider>
        <GenericConnectionWidget {...pipeline} />
      </MockedProvider>,
    );

    await userEvent.click(screen.getByPlaceholderText("Select options"));

    await waitFor(() =>
      expect(screen.getByText(/test item/i)).toBeInTheDocument(),
    );

    const item = await screen.findByText(/test item/i);
    await userEvent.click(item);

    expect(pipeline.form.setFieldValue).toHaveBeenCalledWith("test_param", {
      id: "1",
      name: "Test Item",
    });
  });
});
