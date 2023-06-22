import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TestApp } from "core/helpers/testutils";
import { v4 } from "uuid";

import RunPipelineDialog from "../RunPipelineDialog";
import { useLazyQuery } from "@apollo/client";
import { ParameterField_ParameterFragment } from "./ParameterField.generated";

jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  __esModule: true,
  useLazyQuery: jest.fn(),
}));

const useLazyQueryMock = useLazyQuery as jest.Mock;

const pipelineWithParameters = (
  parameters: Array<ParameterField_ParameterFragment>
) => {
  return {
    id: v4(),
    code: "code",
    workspace: {
      slug: "slug",
    },
    permissions: {
      run: true,
    },
    currentVersion: {
      id: v4(),
      number: 3,
      createdAt: "2023-06-21T13:27:59.928Z",
      user: {
        displayName: "test",
      },
      parameters,
    },
    versions: {
      items: [...parameters],
    },
  };
};

describe("RunPipelineDialog", () => {
  it("enables the submit button when there's a boolean parameter required", async () => {
    const pipeline = pipelineWithParameters([
      {
        code: "code",
        name: "code",
        help: "A boolean parameter.",
        type: "bool",
        default: null,
        required: true,
        choices: null,
        multiple: true,
      },
    ]);
    useLazyQueryMock.mockReturnValue([
      jest.fn(),
      { loading: false, data: { pipelineByCode: pipeline } },
    ]);

    const user = userEvent.setup();
    render(
      <TestApp>
        <RunPipelineDialog open={true} pipeline={pipeline} onClose={() => {}} />
      </TestApp>
    );

    const submitBtn = await screen.getByRole("button", { name: "Run" });
    expect(submitBtn).toBeEnabled();
  });

  it("disables the submit button when there's at least one required field without value", async () => {
    const pipeline = pipelineWithParameters([
      {
        code: "code",
        name: "code",
        help: "This is string parameter",
        type: "str",
        default: null,
        required: false,
        choices: null,
        multiple: false,
      },
      {
        code: "code1",
        name: "code1",
        help: "A parameter that accepts a list of values, separated by a newline.",
        type: "str",
        default: null,
        required: true,
        choices: null,
        multiple: true,
      },
    ]);
    useLazyQueryMock.mockReturnValue([
      jest.fn(),
      { loading: false, data: { pipelineByCode: pipeline } },
    ]);

    const user = userEvent.setup();
    render(
      <TestApp>
        <RunPipelineDialog open={true} pipeline={pipeline} onClose={() => {}} />
      </TestApp>
    );
    const submitBtn = await screen.getByRole("button", { name: "Run" });
    expect(submitBtn).toBeDisabled();
  });

  it("enables the submit button when all required fields are filled", async () => {
    const pipeline = pipelineWithParameters([
      {
        code: "code",
        name: "code",
        help: "This is string parameter",
        type: "str",
        default: null,
        required: true,
        choices: null,
        multiple: false,
      },
      {
        name: "code1",
        code: "code1",
        required: true,
        help: null,
        type: "int",
        default: 0,
        choices: [0, 2, 5, 10],
        multiple: false,
      },
    ]);

    useLazyQueryMock.mockReturnValue([
      jest.fn(),
      { loading: true, data: { pipelineByCode: pipeline } },
    ]);

    const user = userEvent.setup();
    const { container, debug } = render(
      <TestApp>
        <RunPipelineDialog open={true} pipeline={pipeline} onClose={() => {}} />
      </TestApp>
    );

    const submitBtn = await screen.getByRole("button", { name: "Run" });
    expect(submitBtn).toBeDisabled();
    const periodsInput = await screen.getByRole("textbox", { name: "code" });
    await user.type(periodsInput, "2021");
    expect(submitBtn).toBeEnabled();
  });

  it("accepts zero values", async () => {
    const pipeline = pipelineWithParameters([
      {
        name: "code",
        code: "code",
        required: true,
        help: null,
        type: "float",
        default: 0.0,
        choices: [1.0, 0.0, 3.0, 10.5],
        multiple: false,
      },
    ]);

    useLazyQueryMock.mockReturnValue([
      jest.fn(),
      { loading: true, data: { pipelineByCode: pipeline } },
    ]);

    const user = userEvent.setup();
    const { container } = render(
      <TestApp>
        <RunPipelineDialog open={true} pipeline={pipeline} onClose={() => {}} />
      </TestApp>
    );

    const submitBtn = await screen.getByRole("button", { name: "Run" });
    expect(submitBtn).toBeEnabled();
  });
});
