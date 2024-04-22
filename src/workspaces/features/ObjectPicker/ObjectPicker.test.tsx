import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { useQuery } from "@apollo/client";
import ObjectPicker from "./ObjectPicker";

jest.mock("@apollo/client", () => ({
  __esModule: true,
  useQuery: jest.fn(),
  gql: jest.fn(() => "GQL"),
}));

const useQueryMock = useQuery as jest.Mock;

const WORKSPACE = {
  slug: faker.string.uuid(),
  bucket: {
    objects: {
      items: [
        {
          name: "notebook_1_copy.ipynb",
          key: "Notebooks/notebook_1_copy.ipynb",
          path: "hexa-bucket-name/Notebooks/notebook_1.ipynb",
        },
        {
          name: "notebook_1.ipynb",
          key: "Notebooks/notebook_1.ipynb",
          path: "hexa-bucket-name/Notebooks/notebook_1.ipynb",
        },
        {
          name: "file.csv",
          key: "Notebooks/output.ipynb",
          path: "hexa-bucket-name/Notebooks/output.ipynb",
        },
      ],
    },
  },
};

describe("ObjectPicker", () => {
  it("display all objects", async () => {
    const user = userEvent.setup();

    useQueryMock.mockReturnValue({
      loading: true,
      data: {
        workspace: WORKSPACE,
      },
    });

    const onChange = jest.fn();
    const { container } = render(
      <ObjectPicker workspaceSlug={WORKSPACE.slug} onChange={onChange} />,
    );
    const { objects } = WORKSPACE.bucket;
    await user.click(await screen.findByTestId("combobox-button"));
    const option = await screen.queryAllByRole("option");
    expect(option.length).toBe(objects.items.length);

    await user.click(await screen.findByText(objects.items[0].name));
    expect(onChange).toHaveBeenCalledWith(objects.items[0]);
    expect(container).toMatchSnapshot();
  });

  it("display only filtered objects", async () => {
    const user = userEvent.setup();
    useQueryMock.mockReturnValue({
      loading: true,
      data: {
        workspace: {
          ...WORKSPACE,
          bucket: {
            objects: {
              items: [
                {
                  name: "file.csv",
                  key: "Notebooks/output.ipynb",
                  path: "hexa-bucket-name/Notebooks/output.ipynb",
                },
              ],
            },
          },
        },
      },
    });

    const onChange = jest.fn();
    const { container } = render(
      <ObjectPicker
        workspaceSlug={WORKSPACE.slug}
        onChange={onChange}
        filter="csv"
      />,
    );
    const { objects } = WORKSPACE.bucket;
    const filtered = objects.items.filter((o) => o.name.endsWith("csv"));

    await user.click(await screen.findByTestId("combobox-button"));

    const option = await screen.queryAllByRole("option");
    expect(option.length).toBe(filtered.length);
  });
});
