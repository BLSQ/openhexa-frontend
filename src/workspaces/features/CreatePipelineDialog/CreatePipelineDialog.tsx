import { gql, useMutation } from "@apollo/client";
import Button from "core/components/Button/Button";
import Dialog from "core/components/Dialog";
import Link from "core/components/Link";
import Field from "core/components/forms/Field/Field";
import { useEffect, useState } from "react";
import { useTranslation, Trans } from "next-i18next";
import {
  CreatePipelineDialog_WorkspaceFragment,
  GenerateWorkspaceTokenMutation,
} from "./CreatePipelineDialog.generated";
import Textarea from "core/components/forms/Textarea/Textarea";
import Tabs from "core/components/Tabs";
import { toSpinalCase } from "workspaces/helpers/pipelines";
import { NotebookPickerOption } from "../NotebooksPicker/NotebooksPicker";
import NotebooksPicker from "../NotebooksPicker";

type CreatePipelineDialogProps = {
  open: boolean;
  onClose: () => void;
  workspace: CreatePipelineDialog_WorkspaceFragment;
};

const CreatePipelineDialog = (props: CreatePipelineDialogProps) => {
  const { open, onClose, workspace } = props;
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState<number | null>(null);

  const [selectedNotebook, setSelectedNotebook] =
    useState<NotebookPickerOption>();

  const [mutate] = useCreatePipelineMutation();
  const createNotebookPipeline = async () => {
    if (selectedNotebook) {
      console.log("called");
      const code = selectedNotebook?.name.split(".")[0];
      const { data } = await mutate({
        variables: {
          input: {
            code,
            name: selectedNotebook.name,
            notebook: selectedNotebook.path,
            workspaceSlug: workspace.slug,
          },
        },
      });
      console.log(data);
    }
  };

  const [token, setToken] = useState<null | string>(null);
  const [generateToken] = useMutation<GenerateWorkspaceTokenMutation>(
    gql`
      mutation GenerateWorkspaceToken($input: GenerateWorkspaceTokenInput!) {
        generateWorkspaceToken(input: $input) {
          token
          success
        }
      }
    `,
    { variables: { input: { slug: workspace.slug } } },
  );

  const onTokenClick = async () => {
    if (!token) {
      const { data } = await generateToken();
      setToken(data?.generateWorkspaceToken?.token ?? null);
    }
  };

  useEffect(() => {
    if (open) {
      setToken(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="max-w-2xl">
      <Dialog.Title>{t("How to create a pipeline")}</Dialog.Title>
      <Dialog.Content className="space-y-4">
        <Tabs onChange={(index) => setTabIndex(index)}>
          <Tabs.Tab label={t("From Notebook")} className={"space-y-2 pt-2"}>
            <p className="mb-6">
              {t("You can create a pipeline by selecting a notebook.")}
            </p>
            <NotebooksPicker
              workspaceSlug={workspace.slug}
              onChange={(v) => {
                setSelectedNotebook(v);
                if (v) {
                  console.log(toSpinalCase(v?.name));
                }
              }}
              withPortal
              value={selectedNotebook}
            />
          </Tabs.Tab>
          <Tabs.Tab label={t("From OpenHEXA CLI")} className={"space-y-2 pt-2"}>
            <p className="mb-6">
              <Trans>
                In order to create pipelines, you need to setup the{" "}
                <code>openhexa</code> CLI using the{" "}
                <Link
                  target="_blank"
                  href="https://github.com/BLSQ/openhexa/wiki/Writing-OpenHexa-pipelines"
                >
                  guide
                </Link>{" "}
                on Github.
              </Trans>
            </p>
            <p>
              {t(
                "Configure the workspace in your terminal using the following commands:",
              )}
            </p>

            <pre className=" bg-slate-100 p-2 font-mono text-sm leading-6">
              <div>
                <span className="select-none text-gray-400">$ </span>pip install
                openhexa.sdk
                <span className="select-none text-gray-400">
                  {t("# if not installed")}
                </span>
              </div>
              <div>
                <span className="select-none text-gray-400">$ </span>
                <span className="whitespace-normal">
                  openhexa workspaces add <b>{workspace.slug}</b>
                </span>
              </div>
            </pre>
            <Field name="token" label={t("Access Token")} required>
              <div className="flex w-full flex-1 items-center gap-1">
                {token ? (
                  <Textarea className="font-mono" value={token} readOnly />
                ) : (
                  <Button variant="secondary" onClick={onTokenClick}>
                    {t("Show")}
                  </Button>
                )}
              </div>
            </Field>
          </Tabs.Tab>
        </Tabs>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={onClose} variant="outlined">
          {t("Close")}
        </Button>
        {tabIndex === 0 && (
          <Button onClick={createNotebookPipeline}>{t("Create")}</Button>
        )}
      </Dialog.Actions>
    </Dialog>
  );
};

CreatePipelineDialog.fragments = {
  workspace: gql`
    fragment CreatePipelineDialog_workspace on Workspace {
      slug
    }
  `,
};

export default CreatePipelineDialog;
