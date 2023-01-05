import { render, screen } from "@testing-library/react";
import { TestApp } from "core/helpers/testutils";
import WorkspacePage from "pages/workspaces/[workspaceId]";
import { WorkspacePageDocument } from "workspaces/graphql/queries.generated";

describe("Workspaces", () => {
  it("renders the workspace page", async () => {
    const id = "a303ff37-644b-4080-83d9-a42bd2712f63";
    const graphqlMocks = [
      {
        request: {
          query: WorkspacePageDocument,
          variables: {
            id,
          },
        },
        result: {
          data: {
            workspace: {
              id: id,
              name: "Rwanda Workspace",
              description: "This is a description",
              countries: [],
              memberships: {
                totalItems: 0,
                items: [],
              },
            },
          },
        },
      },
    ];

    const { container } = render(
      <TestApp mocks={graphqlMocks}>
        <WorkspacePage page={1} perPage={1} workspaceId={id} />
      </TestApp>
    );
    const elm = await screen.findByText("Rwanda Workspace", { selector: "a" });
    expect(container).toMatchSnapshot();
  });

  it("renders null as workspace doesn't exist", async () => {
    const id = "a303ff37-644b-4080-83d9-a42bd2712f63";
    const graphqlMocks = [
      {
        request: {
          query: WorkspacePageDocument,
          variables: {
            id,
          },
        },
        result: {
          data: {
            workspace: null,
          },
        },
      },
    ];

    const { container } = render(
      <TestApp mocks={graphqlMocks}>
        <WorkspacePage page={1} perPage={1} workspaceId={id} />
      </TestApp>
    );

    expect(container.firstChild).toBeNull();
    expect(container).toMatchSnapshot();
  });
});
