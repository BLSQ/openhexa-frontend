import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DHIS2Widget, GET_CONNECTION_METADATA } from "./DHIS2Widget";
import { useGetConnectionBySlugLazyQuery } from "./DHIS2Widget.generated";
import { TestApp } from "core/helpers/testutils";

jest.mock("./DHIS2Widget.generated", () => ({
  useGetConnectionBySlugLazyQuery: jest.fn(),
}));

const mockLazyQuery = useGetConnectionBySlugLazyQuery as jest.Mock;

jest.mock("core/hooks/useDebounce", () => ({
  __esModule: true,
  default: jest.fn((value) => value),
}));

const generateMockedParameterField = (multiple = false) => ({
  parameter: {
    code: "test_param",
    widget: "DHIS2_DATASET",
    multiple: true,
    type: "str",
    connection: "test_connection",
  },
  connection: "test_connection",
  widget: "DHIS2_DATASET",
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
    const parameterField = generateMockedParameterField();
    mockLazyQuery.mockReturnValue([jest.fn(), { data: null, loading: false }]);

    render(
      <TestApp>
        <DHIS2Widget {...parameterField} />
      </TestApp>,
    );

    expect(screen.getByPlaceholderText("Select options")).toBeInTheDocument();
  });

  it("fetches data when connection is provided", async () => {
    const pipeline = generateMockedParameterField();
    const mockFetch = jest.fn().mockResolvedValue({
      data: {
        connectionBySlug: {
          queryMetadata: {
            items: [{ id: "1", label: "Test Item" }],
            totalItems: 1,
          },
        },
      },
    });

    mockLazyQuery.mockReturnValue([mockFetch, { data: null, loading: false }]);

    render(
      <TestApp>
        <DHIS2Widget {...pipeline} />
      </TestApp>,
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith({
        variables: {
          workspaceSlug: "mock_workspace",
          connectionSlug: "mock_connection_slug",
          type: "DATASETS",
          filters: [],
          perPage: 10,
          page: 1,
        },
      });
    });
  });

  it("updates selected value in single select mode", async () => {
    const pipeline = generateMockedParameterField(false);
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
        <DHIS2Widget {...pipeline} />
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
    const pipeline = generateMockedParameterField(true);
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
        <DHIS2Widget {...pipeline} />
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
    const pipeline = generateMockedParameterField(false);
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
        <DHIS2Widget {...pipeline} />
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
