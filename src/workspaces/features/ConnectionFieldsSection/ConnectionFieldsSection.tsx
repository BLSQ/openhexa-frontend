import { gql } from "@apollo/client";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Button from "core/components/Button";
import DescriptionList, {
  DescriptionListDisplayMode,
} from "core/components/DescriptionList";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "core/components/Table";
import Time from "core/components/Time";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { ConnectionFieldsSection_ConnectionFragment } from "./ConnectionFieldsSection.generated";

type ConnectionFieldsSectionProps = {
  connection: ConnectionFieldsSection_ConnectionFragment;
};

const ConnectionFieldsSection = (props: ConnectionFieldsSectionProps) => {
  const { connection } = props;
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="text-right">
        <Button
          size="sm"
          variant="white"
          leadingIcon={<PlusIcon className="h-4 w-4" />}
        >
          {t("Add field")}
        </Button>
      </div>
      {connection.fields.length > 0 ? (
        <Table>
          <TableBody className="divide divide-y">
            {connection.fields.map((field) => (
              <TableRow key={field.code}>
                <TableCell className="py-3 font-medium">{field.code}</TableCell>
                <TableCell className="py-3">
                  {field.secret ? "***********" : field.value}
                </TableCell>
                <TableCell className="py-3" suppressHydrationWarning>
                  {t("Updated on {{time}}", {
                    time: DateTime.fromISO(field.updatedAt).toLocaleString(
                      DateTime.DATETIME_SHORT
                    ),
                  })}
                </TableCell>
                {connection.permissions.update && (
                  <TableCell className="py-3">
                    <div className="flex flex-1 items-center justify-end gap-2">
                      <Button title={t("Update")} size="sm" variant="secondary">
                        <PencilIcon className="h-3 w-3" />
                      </Button>
                      <Button title={t("Delete")} size="sm" variant="danger">
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-gray-500">
          {t("There are no fields for this connection yet.")}
        </div>
      )}
    </div>
  );
};

ConnectionFieldsSection.fragments = {
  connection: gql`
    fragment ConnectionFieldsSection_connection on Connection {
      id
      fields {
        code
        value
        secret
        updatedAt
      }
      permissions {
        update
      }
    }
  `,
};

export default ConnectionFieldsSection;
