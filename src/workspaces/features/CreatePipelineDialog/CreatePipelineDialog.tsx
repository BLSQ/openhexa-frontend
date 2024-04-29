import { gql, useMutation } from "@apollo/client";
import Button from "core/components/Button/Button";
import Dialog from "core/components/Dialog";
import Link from "core/components/Link";
import Tabs from "core/components/Tabs";
import Field from "core/components/forms/Field/Field";
import Textarea from "core/components/forms/Textarea/Textarea";
import useForm from "core/hooks/useForm";
import { PipelineError } from "graphql-types";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCreatePipelineMutation } from "workspaces/graphql/mutations.generated";
import { toSpinalCase } from "workspaces/helpers/pipelines";
import BucketObjectPicker from "../BucketObjectPicker";
import {
  CreatePipelineDialog_WorkspaceFragment,
  GenerateWorkspaceTokenMutation,
} from "./CreatePipelineDialog.generated";

type CreatePipelineDialogProps = {
  open: boolean;
  onClose: () => void;
  workspace: CreatePipelineDialog_WorkspaceFragment;
};

const CreatePipelineDialog = (props: CreatePipelineDialogProps) => {
  const { t } = useTranslation();
  const { open, onClose, workspace } = props;
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState<number | null>(0);

  const [mutate] = useCreatePipelineMutation();

  const form = useForm<{ notebook: ObjectPickerOption }>({
    onSubmit: async (values) => {
      const { notebook } = values;
      const code = toSpinalCase(notebook.name.split(".")[0]);

      const { data } = await mutate({
        variables: {
          input: {
            code,
            name: notebook.name,
            notebookPath: notebook.key,
            workspaceSlug: workspace.slug,
          },
        },
      });

      if (data?.createPipeline.success && data.createPipeline.pipeline) {
        const pipeline = data.createPipeline.pipeline;
        await router.push(
          `/workspaces/${encodeURIComponent(
            router.query.workspaceSlug as string,
          )}/pipelines/${encodeURIComponent(pipeline.code)}`,
        );
      } else if (
        data?.createPipeline.errors.includes(
          PipelineError.PipelineAlreadyExists,
        )
      ) {
        throw new Error(
          t("A pipeline with the selected notebook already exist"),
        );
      } else {
        throw new Error(t("An error occurred while linking this dataset"));
      }
    },
    validate(values) {
      const errors: any = {};
      if (!values.notebook) {
        errors.notebook = t("You have to select a notebook");
      }
      return errors;
    },
  });

  useEffect(() => {
    if (open) {
      form.resetForm();
    }
  }, [open, form]);

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
      <form onSubmit={form.handleSubmit}>
        <Dialog.Title>{t("How to create a pipeline")}</Dialog.Title>
        <Dialog.Content className="space-y-4">
          <Tabs onChange={(index) => setTabIndex(index)}>
            <Tabs.Tab label={t("From Notebook")} className={"space-y-2 pt-2"}>
              <p className="mb-6">
                <Trans>
                  You can use a Notebook from the workspace file system to be
                  run as a pipeline. This is the easiest way to create a
                  pipeline. Keep in my mind that Notebooks are not versioned. If
                  a user changes the notebook, the pipeline will be updated.
                </Trans>
              </p>
              <>
                <Field
                  name={"notebook"}
                  label={t("Notebook")}
                  required
                  error={form.touched.notebook && form.errors.notebook}
                >
                  <BucketObjectPicker
                    placeholder={t("Select a JupyterLab notebook")}
                    workspace={workspace}
                  />
                </Field>
                {form.submitError && (
                  <p className={"text-sm text-red-500"}>{form.submitError}</p>
                )}
              </>
            </Tabs.Tab>
            <Tabs.Tab
              label={t("From OpenHEXA CLI")}
              className={"space-y-2 pt-2"}
            >
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
                  <span className="select-none text-gray-400">$ </span>pip
                  install openhexa.sdk
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
          <Button onClick={onClose} type="button" variant="outlined">
            {t("Close")}
          </Button>
          {tabIndex === 0 && (
            <Button disabled={form.isSubmitting} type="submit">
              {t("Create")}
            </Button>
          )}
        </Dialog.Actions>
      </form>
    </Dialog>
  );
};

CreatePipelineDialog.fragments = {
  workspace: gql`
    fragment CreatePipelineDialog_workspace on Workspace {
      slug
      ...BucketObjectPicker_workspace
    }
    ${BucketObjectPicker.fragments.workspace}
  `,
};

export default CreatePipelineDialog;
