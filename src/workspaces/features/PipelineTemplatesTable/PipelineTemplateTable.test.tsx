import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import PipelineTemplatesTable from "./PipelineTemplateTable";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

const useGetPipelineTemplatesQueryMock = jest.fn();
const fetchMoreMock = jest.fn();
jest.mock("./PipelineTemplateTable.generated", () => ({
  useGetPipelineTemplatesQuery: () => ({
    ...useGetPipelineTemplatesQueryMock(),
    fetchMore: fetchMoreMock,
  }),
}));

const useGetPipelineTemplatesQueryResultMock = {
  loading: false,
  error: null,
  data: {
    pipelineTemplates: {
      pageNumber: 1,
      totalPages: 2,
      totalItems: 6,
      items: Array.from({ length: 6 }, (_, index) => {
        const indexAsString = (index + 1).toString();
        return {
          id: indexAsString,
          name: `Template ${indexAsString}`,
          currentVersion: {
            id: indexAsString,
            versionNumber: indexAsString,
            createdAt: `2023-01-01T00:0${indexAsString}:00Z`,
          },
        };
      }),
    },
  },
};

describe("PipelineTemplatesTable", () => {
  beforeEach(() => {
    useGetPipelineTemplatesQueryMock.mockReturnValue(
      useGetPipelineTemplatesQueryResultMock,
    );
  });

  it("renders loading state initially", () => {
    useGetPipelineTemplatesQueryMock.mockReturnValue({
      loading: true,
      data: null,
      error: null,
    });

    render(<PipelineTemplatesTable />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders data after loading", async () => {
    render(<PipelineTemplatesTable />);

    await waitFor(() => {
      expect(screen.getByText("Template 1")).toBeInTheDocument();
      expect(screen.getByText("v1")).toBeInTheDocument();
      expect(screen.getByText("1/1/2023, 1:01 AM")).toBeInTheDocument();
    });
  });

  it("handles pagination", async () => {
    render(<PipelineTemplatesTable />);

    const previousButton = screen.getByRole("button", { name: /Previous/i });
    const nextButton = previousButton.nextElementSibling as HTMLButtonElement;
    await waitFor(() => {
      expect(nextButton).toBeInTheDocument();
    });

    useGetPipelineTemplatesQueryMock.mockReturnValue({
      loading: false,
      data: {
        pipelineTemplates: {
          pageNumber: 2,
          totalPages: 2,
          totalItems: 10,
          items: [
            {
              id: "23",
              name: "Template 23",
              currentVersion: {
                id: "23",
                versionNumber: 23,
                createdAt: "2023-01-04T00:00:00Z",
              },
            },
          ],
        },
      },
      error: null,
    });

    fireEvent.click(nextButton);

    expect(fetchMoreMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByText("Template 23")).toBeInTheDocument();
    });
  });

  it("displays error message on error", async () => {
    useGetPipelineTemplatesQueryMock.mockReturnValue({
      loading: false,
      data: null,
      error: new Error("An error occurred"),
    });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <PipelineTemplatesTable />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Error loading templates")).toBeInTheDocument();
    });
  });
});
