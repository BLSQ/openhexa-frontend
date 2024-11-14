import { gql, useQuery } from "@apollo/client";
import {
  Pipeline,
  PipelineNotificationLevel,
  PipelineRecipient,
  User,
} from "graphql/types";
import {
  PipelineRecipientQuery,
  PipelineRecipients_PipelineFragment,
  PipelineRecipients_WorkspaceFragment,
} from "./PipelineRecipients.generated";
import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
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
  formatNotificationLevel,
  NotificationLevelSelect,
} from "workspaces/helpers/recipients/utils";

type Recipient = Pick<PipelineRecipient, "id" | "notificationLevel"> & {
  user: Pick<User, "displayName">;
};

type RecipientRowProps = {
  recipient: Recipient;
  pipeline: Pick<Pipeline, "id"> & {
    permissions: Pick<Pipeline["permissions"], "update">;
  };
  isEditing: boolean;
  onLevelChange: (level: PipelineNotificationLevel) => void;
  onSelect: (recipient: Recipient) => void;
  onUpdate: (recipient: Recipient) => void;
  onCancel: () => void;
  onDelete: () => void;
  className?: string;
};

const RecipientRow = ({
  recipient,
  isEditing,
  pipeline,
  onLevelChange,
  onSelect,
  onUpdate,
  onCancel,
  onDelete,
  className,
}: RecipientRowProps) => {
  return (
    <TableRow className={className}>
      <TableCell>{recipient.user.displayName}</TableCell>
      <TableCell className="max-w-[20ch]">
        {isEditing ? (
          <NotificationLevelSelect
            value={recipient.notificationLevel}
            onChange={onLevelChange}
          />
        ) : (
          formatNotificationLevel(recipient.notificationLevel)
        )}
      </TableCell>
      <TableCell className="flex justify-end gap-x-2">
        {isEditing ? (
          <ActionButtonGroup
            buttons={[
              {
                icon: <CheckIcon className="h-4" />,
                onClick: () => onUpdate(recipient),
              },
              {
                icon: <XMarkIcon className="h-4" />,
                onClick: () => onCancel(),
              },
            ]}
          />
        ) : (
          <ActionButtonGroup
            buttons={[
              {
                icon: <PencilIcon className="h-4" />,
                onClick: () => onSelect(recipient),
              },
              {
                render: () => (
                  <DeletePipelineRecipientTrigger
                    pipeline={pipeline}
                    recipient={recipient}
                  >
                    {({ onClick }) => (
                      <Button
                        onClick={() => {
                          onClick();
                          onDelete();
                        }}
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
    </TableRow>
  );
};

type NewRecipientRowProps = {
  workspaceSlug: string;
  newRecipient?: CreatePipelineRecipientInput;
  excludedRecipients?: string[];
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
};

const NewRecipientRow = ({
  workspaceSlug,
  newRecipient,
  excludedRecipients = [],
  onChange,
  onSave,
  onCancel,
}: NewRecipientRowProps) => {
  return (
    <TableRow>
      <TableCell className="max-w-[20ch]">
        <WorkspaceMemberPicker
          workspaceSlug={workspaceSlug}
          value={newRecipient?.member || null}
          onChange={(member: WorkspaceMemberOption) =>
            onChange("member", member)
          }
          withPortal
          exclude={excludedRecipients}
        />
      </TableCell>
      <TableCell className="max-w-[20ch]">
        <NotificationLevelSelect
          value={newRecipient?.notificationLevel}
          onChange={(level: PipelineNotificationLevel) =>
            onChange("notificationLevel", level)
          }
        />
      </TableCell>
      <TableCell className="flex justify-end gap-x-2">
        <ActionButtonGroup
          buttons={[
            {
              icon: <CheckIcon className="h-4" />,
              onClick: onSave,
              disabled:
                !newRecipient?.member || !newRecipient?.notificationLevel,
            },
            {
              icon: <XMarkIcon className="h-4" />,
              onClick: onCancel,
              disabled:
                !newRecipient?.member || !newRecipient?.notificationLevel,
            },
          ]}
        />
      </TableCell>
    </TableRow>
  );
};

type CreatePipelineRecipientInput = {
  member?: WorkspaceMemberOption;
  notificationLevel?: PipelineNotificationLevel;
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
            notificationLevel
          }
          workspace {
            slug
          }
        }
      }
    `,
    { variables: { id: props.pipeline.id } },
  );

  const clearCache = useCacheKey(["pipelines", props.pipeline.id], () =>
    refetch(),
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
        newRecipient.notificationLevel!,
      );
      setNewRecipient(null);
      clearCache();
    }
  };

  const handleUpdateRecipient = async (recipient: Recipient) => {
    await updatePipelineRecipient(recipient.id, recipient.notificationLevel);
    clearCache();
    setSelectedRecipient(null);
  };

  const handleCancelEdit = () => {
    setSelectedRecipient(null);
  };

  return (
    <Table className="-mx-2">
      <TableHead>
        <TableRow>
          <TableCell heading>{t("User")}</TableCell>
          <TableCell heading>{t("Level")}</TableCell>
          <TableCell heading></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {canAddRecipient && (
          <NewRecipientRow
            newRecipient={newRecipient!}
            workspaceSlug={workspace.slug}
            excludedRecipients={pipeline.recipients.map((r) => r.user.id) ?? []}
            onCancel={() => setNewRecipient(null)}
            onChange={(field: string, value: any) =>
              setNewRecipient({
                ...newRecipient,
                [field]: value,
              })
            }
            onSave={handleCreateRecipient}
          />
        )}
        {pipeline.recipients.map((recipient: Recipient, i: number) => (
          <RecipientRow
            className="py-4"
            key={i}
            recipient={
              selectedRecipient && selectedRecipient?.id === recipient.id
                ? selectedRecipient
                : recipient
            }
            pipeline={pipeline}
            isEditing={Boolean(
              selectedRecipient && selectedRecipient?.id === recipient.id,
            )}
            onLevelChange={(level: PipelineNotificationLevel) => {
              setSelectedRecipient({
                ...recipient,
                notificationLevel: level,
              });
            }}
            onSelect={(recipient: Recipient) => setSelectedRecipient(recipient)}
            onCancel={handleCancelEdit}
            onUpdate={handleUpdateRecipient}
            onDelete={() => clearCache()}
          />
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
      slug
      members {
        totalItems
      }
    }
  `,
};

export default PipelineRecipients;
