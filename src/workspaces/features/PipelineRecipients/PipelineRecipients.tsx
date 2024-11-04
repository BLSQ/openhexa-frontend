import { gql, useQuery } from "@apollo/client";
import {
  PipelineNotificationEvent,
  PipelineRecipient,
  User,
} from "graphql/types";
import {
  PipelineRecipientQuery,
  PipelineRecipients_PipelineFragment,
} from "./PipelineRecipients.generated";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckIcon,
  PencilIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "core/components/Button";
import Select from "core/components/forms/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "core/components/Table";
import WorkspaceMemberPicker from "../WorkspaceMemberPicker";
import { WorkspaceMemberOption } from "../WorkspaceMemberPicker/WorkspaceMemberPicker";
import DeletePipelineRecipientTrigger from "./DeletePipelineRecipientTrigger/DeletePipelineRecipientTrigger";
import { i18n } from "next-i18next";
import { updatePipelineRecipient } from "workspaces/helpers/pipelines";
import useCacheKey from "core/hooks/useCacheKey";

const formatNotificationEvent = (status: PipelineNotificationEvent) => {
  switch (status) {
    case PipelineNotificationEvent.AllEvents:
      return i18n!.t("All events");
    case PipelineNotificationEvent.PipelineFailed:
      return i18n!.t("Pipeline failed");
  }
};

export const NotificationEventSelect = ({
  value,
  onChange,
}: {
  value?: PipelineNotificationEvent | null | undefined;
  onChange: (notificationEvent: PipelineNotificationEvent) => void;
}) => {
  return (
    <Select
      value={value}
      displayValue={(v) => formatNotificationEvent(value!)}
      placeholder={i18n!.t("Select event")}
      onChange={onChange}
      getOptionLabel={(option) => formatNotificationEvent(option!)}
      options={[
        PipelineNotificationEvent.AllEvents,
        PipelineNotificationEvent.PipelineFailed,
      ]}
    />
  );
};

type Recipient = Pick<PipelineRecipient, "id" | "notificationEvent"> & {
  user: Pick<User, "displayName">;
};

type CreatePipelineRecipientInput = {
  member: WorkspaceMemberOption | null;
  notificationEvent: PipelineNotificationEvent | null;
};

type PipelineRecipientsProps = {
  pipeline: PipelineRecipients_PipelineFragment;
};

const PipelineRecipients = (props: PipelineRecipientsProps) => {
  const { t } = useTranslation();

  const [selectedRecipient, setSelectedRecipient] =
    useState<Recipient | null>();
  const [newRecipient, setNewRecipient] =
    useState<CreatePipelineRecipientInput | null>();

  const { data, refetch } = useQuery<PipelineRecipientQuery>(
    gql`
      query PipelineRecipient($id: UUID!) {
        pipeline(id: $id) {
          id
          code
          permissions {
            update
          }
          recipients {
            id
            user {
              id
              displayName
            }
            notificationEvent
          }
          workspace {
            slug
          }
        }
      }
    `,
    { variables: { id: props.pipeline.id } },
  );

  const clearCache = useCacheKey(["pipelines", props.pipeline.id], refetch);

  const handleAddRecipient = () => {
    setNewRecipient({
      notificationEvent: null,
      member: null,
    });
  };

  const editPipelineRecipient = async (recipient: Recipient) => {
    await updatePipelineRecipient(recipient.id, recipient.notificationEvent);
    clearCache();
    setSelectedRecipient(null);
  };

  const handleCancelEdit = () => {
    setSelectedRecipient(null);
  };

  const addRecipient = (recipient: CreatePipelineRecipientInput) => {};

  const pipeline = data?.pipeline;
  if (!pipeline) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button
          className="flex justify-end"
          variant="secondary"
          onClick={handleAddRecipient}
        >
          <PlusCircleIcon className="h-4" />
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell heading>{t("User")}</TableCell>
            <TableCell heading>{t("Event")}</TableCell>
            <TableCell heading></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newRecipient && (
            <TableRow>
              <TableCell>
                <WorkspaceMemberPicker
                  workspaceSlug={pipeline.workspace.slug}
                  value={newRecipient.member}
                  onChange={(member: WorkspaceMemberOption) =>
                    console.log(member)
                  }
                  placeholder={t("Select recipient")}
                  withPortal
                  exclude={pipeline.recipients.map((r) => r.user.id)}
                />
              </TableCell>
              <TableCell className="max-w-[20ch] py-3 ">
                <NotificationEventSelect
                  value={newRecipient.notificationEvent}
                  onChange={(event: PipelineNotificationEvent) =>
                    setNewRecipient({
                      ...newRecipient,
                      notificationEvent: event,
                    })
                  }
                />
              </TableCell>
              <TableCell className="flex justify-end gap-x-2">
                <Button
                  onClick={() => addRecipient(newRecipient)}
                  size="sm"
                  variant="secondary"
                >
                  <CheckIcon className="h-4" />
                </Button>
                <Button
                  onClick={() => setNewRecipient(null)}
                  size="sm"
                  variant="secondary"
                >
                  <XMarkIcon className="h-4" />
                </Button>
              </TableCell>
            </TableRow>
          )}
          {pipeline.recipients.map((recipient, i: number) => (
            <TableRow key={i}>
              <TableCell>{recipient.user.displayName}</TableCell>
              <TableCell className="max-w-[20ch]">
                {selectedRecipient && selectedRecipient?.id === recipient.id ? (
                  <NotificationEventSelect
                    value={selectedRecipient.notificationEvent}
                    onChange={(event: PipelineNotificationEvent) =>
                      setSelectedRecipient({
                        ...selectedRecipient,
                        notificationEvent: event,
                      })
                    }
                  />
                ) : (
                  formatNotificationEvent(recipient.notificationEvent)
                )}
              </TableCell>
              {pipeline.permissions.update && (
                <TableCell className="flex justify-end gap-x-2">
                  {selectedRecipient &&
                  selectedRecipient?.id === recipient.id ? (
                    <>
                      <Button
                        onClick={() => editPipelineRecipient(selectedRecipient)}
                        size="sm"
                        variant="secondary"
                      >
                        <CheckIcon className="h-4" />
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        size="sm"
                        variant="secondary"
                      >
                        <XMarkIcon className="h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setSelectedRecipient(recipient)}
                        size="sm"
                        variant="secondary"
                      >
                        <PencilIcon className="h-4" />
                      </Button>
                      <DeletePipelineRecipientTrigger
                        recipient={recipient}
                        pipeline={pipeline}
                      >
                        {({ onClick }) => (
                          <Button
                            onClick={onClick}
                            size="sm"
                            variant="secondary"
                          >
                            <TrashIcon className="h-4" />
                          </Button>
                        )}
                      </DeletePipelineRecipientTrigger>
                    </>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

PipelineRecipients.fragments = {
  pipeline: gql`
    fragment PipelineRecipients_pipeline on Pipeline {
      id
      code
    }
  `,
};

export default PipelineRecipients;
