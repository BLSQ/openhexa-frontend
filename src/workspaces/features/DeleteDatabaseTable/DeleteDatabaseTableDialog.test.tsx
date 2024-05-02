import { faker } from "@faker-js/faker";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestApp } from "core/helpers/testutils";
import router from "next/router";
import DeleteDatabaseTableDialog from "./DeleteDatabaseTableDialog";
import {
  DeleteWorkspaceDatabaseTableDocument,
  useDeleteWorkspaceDatabaseTableMutation,
} from "workspaces/graphql/mutations.generated";

jest.mock("workspaces/graphql/mutations.generated", () => ({
  ...jest.requireActual("workspaces/graphql/mutations.generated"),
  __esModule: true,
  useDeleteWorkspaceDatabaseTableMutation: jest.fn().mockReturnValue([]),
}));

const useDeleteWorkspaceDatabaseTableMutationMock =
  useDeleteWorkspaceDatabaseTableMutation as jest.Mock;

const TABLE = {
  name: faker.company.name(),
};
const WORKSPACE = {
  slug: faker.lorem.slug(5),
};

describe("DeleteDatabaseTableDialog", () => {
  const onClose = jest.fn();
  beforeEach(() => {
    useDeleteWorkspaceDatabaseTableMutationMock.mockClear();
  });

  it("Deletes a database table", async () => {
    const pushSpy = jest.spyOn(router, "push");
    const { useDeleteWorkspaceDatabaseTableMutation } = jest.requireActual(
      "workspaces/graphql/mutations.generated",
    );
    useDeleteWorkspaceDatabaseTableMutationMock.mockImplementation(
      useDeleteWorkspaceDatabaseTableMutation,
    );

    const user = userEvent.setup();
    const mocks = [
      {
        request: {
          query: DeleteWorkspaceDatabaseTableDocument,
          variables: {
            input: {
              workspaceSlug: WORKSPACE.slug,
              table: TABLE.name,
            },
          },
        },
        result: {
          data: {
            deleteWorkspaceDatabaseTable: {
              success: true,
              errors: [],
            },
          },
        },
      },
    ];
    render(
      <TestApp mocks={mocks}>
        <DeleteDatabaseTableDialog
          open
          table={TABLE}
          workspace={WORKSPACE}
          onClose={onClose}
        />
      </TestApp>,
    );
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteButton);
    waitFor(() => {
      expect(pushSpy).toHaveBeenCalledWith("/");
    });
    expect(useDeleteWorkspaceDatabaseTableMutationMock).toHaveBeenCalled();
  });
});
