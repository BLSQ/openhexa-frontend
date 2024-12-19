import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { act } from "react-dom/test-utils";
import PipelineTemplatesTable from "./PipelineTemplateTable";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

const useGetPipelineTemplatesQueryMock = jest.fn();
jest.mock("./PipelineTemplateTable.generated", () => ({
  useGetPipelineTemplatesQuery: () => useGetPipelineTemplatesQueryMock(),
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
    useGetPipelineTemplatesQueryMock.mockReturnValue({
      loading: false,
      data: {
        pipelineTemplates: {
          pageNumber: 1,
          totalPages: 2,
          totalItems: 10,
          items: [
            {
              id: "1",
              name: "Template 1",
              currentVersion: {
                id: "1",
                versionNumber: "1.0",
                createdAt: "2023-01-01T00:00:00Z",
              },
            },
            {
              id: "2",
              name: "Template 2",
              currentVersion: {
                id: "2",
                versionNumber: "1.1",
                createdAt: "2023-01-02T00:00:00Z",
              },
            },
            {
              id: "3",
              name: "Template 3",
              currentVersion: {
                id: "3",
                versionNumber: "1.2",
                createdAt: "2023-01-03T00:00:00Z",
              },
            },
          ],
        },
      },
      error: null,
    });

    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <PipelineTemplatesTable />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByText("Next"));
    });

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
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
              id: "4",
              name: "Template 4",
              currentVersion: {
                id: "4",
                versionNumber: "2.0",
                createdAt: "2023-01-04T00:00:00Z",
              },
            },
            {
              id: "5",
              name: "Template 5",
              currentVersion: {
                id: "5",
                versionNumber: "2.1",
                createdAt: "2023-01-05T00:00:00Z",
              },
            },
          ],
        },
      },
      error: null,
    });

    await waitFor(() => {
      expect(screen.getByText("Template 4")).toBeInTheDocument();
      expect(screen.getByText("v2.0")).toBeInTheDocument();
      expect(screen.getByText("2023-01-04T00:00:00Z")).toBeInTheDocument();
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
