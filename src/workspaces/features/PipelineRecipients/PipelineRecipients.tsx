import { gql, useQuery } from "@apollo/client";
import {
  PipelineNotificationEvent,
  PipelineRecipient,
  User,
} from "graphql/types";
import {
  PipelineRecipientQuery,
  PipelineRecipients_PipelineFragment,
  PipelineRecipients_WorkspaceFragment,
} from "./PipelineRecipients.generated";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "core/components/Button";
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
import {
  createPipelineRecipient,
  updatePipelineRecipient,
} from "workspaces/helpers/pipelines";
import useCacheKey from "core/hooks/useCacheKey";
import {
  ActionButtonGroup,
  formatNotificationEvent,
  NotificationEventSelect,
} from "workspaces/helpers/utils";

type Recipient = Pick<PipelineRecipient, "id" | "notificationEvent"> & {
  user: Pick<User, "displayName">;
};

type CreatePipelineRecipientInput = {
  member?: WorkspaceMemberOption;
  notificationEvent?: PipelineNotificationEvent;
};

type PipelineRecipientsProps = {
  pipeline: PipelineRecipients_PipelineFragment;
  workspace: PipelineRecipients_WorkspaceFragment;
};

const PipelineRecipients = (props: PipelineRecipientsProps) => {
  const { t } = useTranslation();

  const { workspace } = props;
  const [selectedRecipient, setSelectedRecipient] =
    useState<Recipient | null>();
  const [newRecipient, setNewRecipient] =
    useState<CreatePipelineRecipientInput>();

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
              email
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
  const excludedRecipients = useMemo(
    () => data?.pipeline?.recipients.map((r) => r.user.id) ?? [],
    [data],
  );
  const canAddRecipient = useMemo(
    () => workspace.members.totalItems != data?.pipeline?.recipients.length,
    [workspace, data],
  );

  const pipeline = data?.pipeline;
  if (!pipeline) {
    return null;
  }

  const handleCreateRecipient = async () => {
    if (newRecipient?.member) {
      await createPipelineRecipient(
        pipeline.id,
        newRecipient.member.user.id,
        newRecipient.notificationEvent!,
      );
      setNewRecipient(undefined);
      clearCache();
    }
  };

  const handleUpdateRecipient = async (recipient: Recipient) => {
    await updatePipelineRecipient(recipient.id, recipient.notificationEvent);
    clearCache();
    setSelectedRecipient(null);
  };

  const handleCancelEdit = () => {
    setSelectedRecipient(null);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell heading>{t("User")}</TableCell>
          <TableCell heading>{t("Event")}</TableCell>
          <TableCell heading></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {canAddRecipient && (
          <TableRow>
            <TableCell>
              <WorkspaceMemberPicker
                workspaceSlug={pipeline.workspace.slug}
                value={newRecipient?.member || null}
                onChange={(member: WorkspaceMemberOption) =>
                  setNewRecipient({
                    ...newRecipient,
                    member,
                  })
                }
                withPortal
                exclude={excludedRecipients}
              />
            </TableCell>
            <TableCell>
              <NotificationEventSelect
                value={newRecipient?.notificationEvent}
                onChange={(event: PipelineNotificationEvent) =>
                  setNewRecipient({
                    ...newRecipient,
                    notificationEvent: event,
                  })
                }
              />
            </TableCell>
            <TableCell className="flex justify-end">
              <ActionButtonGroup
                buttons={[
                  {
                    icon: <CheckIcon className="h-4" />,
                    onClick: () => handleCreateRecipient(),
                  },
                  {
                    icon: <XMarkIcon className="h-4" />,
                    disabled: true,
                  },
                ]}
              />
            </TableCell>
          </TableRow>
        )}
        {pipeline.recipients.map((recipient, i: number) => (
          <TableRow key={i}>
            <TableCell className="max-w-[20ch]">
              {recipient.user.displayName}
            </TableCell>
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
              <TableCell className="flex justify-end gap-x-2 max-w-[24]">
                {selectedRecipient && selectedRecipient?.id === recipient.id ? (
                  <ActionButtonGroup
                    buttons={[
                      {
                        icon: <CheckIcon className="h-4" />,
                        onClick: () => handleUpdateRecipient(recipient),
                      },
                      {
                        icon: <XMarkIcon className="h-4" />,
                        onClick: handleCancelEdit,
                      },
                    ]}
                  />
                ) : (
                  <ActionButtonGroup
                    buttons={[
                      {
                        icon: <PencilIcon className="h-4" />,
                        onClick: () => setSelectedRecipient(recipient),
                      },
                      {
                        render: () => (
                          <DeletePipelineRecipientTrigger
                            pipeline={pipeline}
                            recipient={recipient}
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
                        ),
                      },
                    ]}
                  />
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

PipelineRecipients.fragments = {
  pipeline: gql`
    fragment PipelineRecipients_pipeline on Pipeline {
      id
      code
    }
  `,
  workspace: gql`
    fragment PipelineRecipients_workspace on Workspace {
      members {
        totalItems
      }
    }
  `,
};

export default PipelineRecipients;
