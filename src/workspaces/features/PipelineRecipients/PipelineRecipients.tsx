import { gql } from "@apollo/client";
import {
  PipelineNotificationEvent,
  PipelineRecipient,
  User,
} from "graphql/types";
import { PipelineRecipients_PipelineFragment } from "./PipelineRecipients.generated";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
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
import { i18n } from "next-i18next";
import UpdatePipelineRecipientDialog from "./UpdatePipelineRecipientDialog";
import DeletePipelineRecipientTrigger from "./DeletePipelineRecipientTrigger/DeletePipelineRecipientTrigger";

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
      onChange={onChange}
      getOptionLabel={(option) => option && formatNotificationEvent(option)}
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

type PipelineRecipientsProps = {
  pipeline: PipelineRecipients_PipelineFragment;
};

type CreatePipelineRecipientInput = {
  member: WorkspaceMemberOption | null;
  notificationEvent: PipelineNotificationEvent | null;
};

const PipelineRecipients = (props: PipelineRecipientsProps) => {
  const { pipeline } = props;

  const { t } = useTranslation();
  const [newRecipient, setNewRecipient] =
    useState<CreatePipelineRecipientInput | null>();

  const [currentRecipient, setCurrentRecipient] = useState<Recipient>();
  const [openEditRecipientDialog, setOpenEditRecipientDialog] = useState(false);

  const handleAddRecipient = () => {
    setNewRecipient({
      notificationEvent: null,
      member: null,
    });
  };

  const handleEditPipelineRecipient = (r: Recipient) => {
    setCurrentRecipient(r);
    setOpenEditRecipientDialog(true);
  };

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
                    setNewRecipient({
                      ...newRecipient,
                      member: { id: member.id, user: member.user },
                    })
                  }
                  withPortal
                />
              </TableCell>
              <TableCell>
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
            </TableRow>
          )}

          {pipeline.recipients.map((recipient, i) => (
            <TableRow key={i}>
              <TableCell>{recipient.user.displayName}</TableCell>
              <TableCell>
                {formatNotificationEvent(recipient.notificationEvent)}
              </TableCell>
              <TableCell className="flex justify-end gap-x-2">
                <Button
                  onClick={() => handleEditPipelineRecipient(recipient)}
                  size="sm"
                  variant="secondary"
                >
                  <PencilIcon className="h-4" />
                </Button>
                <DeletePipelineRecipientTrigger recipient={recipient}>
                  {({ onClick }) => (
                    <Button onClick={onClick} size="sm" variant="secondary">
                      <TrashIcon className="h-4" />
                    </Button>
                  )}
                </DeletePipelineRecipientTrigger>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {currentRecipient && (
        <UpdatePipelineRecipientDialog
          open={openEditRecipientDialog}
          onClose={() => setOpenEditRecipientDialog(false)}
          recipient={currentRecipient}
        />
      )}
    </div>
  );
};

PipelineRecipients.fragments = {
  pipeline: gql`
    fragment PipelineRecipients_pipeline on Pipeline {
      id
      permissions {
        update
      }
      recipients {
        id
        user {
          displayName
        }
        notificationEvent
        ...DeletePipelineRecipientTrigger_recipient
      }
      workspace {
        slug
      }
    }
  `,
};

export default PipelineRecipients;
