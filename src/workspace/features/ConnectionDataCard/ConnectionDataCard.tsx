import {
  Cog8ToothIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Block from "core/components/Block";
import Link from "core/components/Link";
import { capitalize } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface ConnectionDataCardProps {
  connection: {
    id: string;
    name: string;
    description: string;
    type: string;
    owner: string;
  };
}

const ConnectionDataCard = ({ connection }: ConnectionDataCardProps) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  return (
    <Block className="grid grid-cols-3 gap-2 p-4">
      <div className="col-span-3 col-start-1 col-end-3">
        <section>
          <div
            className="text-sm font-medium text-gray-900"
            title={connection.name}
          >
            {capitalize(connection.name)}
          </div>
          <div className="text-sm text-gray-700">
            <span>{connection.type}</span>
          </div>
          <div className="h-10 text-sm italic text-gray-600">
            <span>
              {t("This Data source is owned by ")}
              {connection.owner}
            </span>
          </div>
        </section>
        <section className="col-span-3 mt-4 h-24">
          <div className=" col-span-3 h-24 break-all text-sm font-normal text-gray-900 line-clamp-4">
            {connection.description}
          </div>
        </section>
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <div className="flex justify-end space-x-4">
          <Link
            className="flex items-end space-x-2 text-blue-500 text-blue-500"
            href={{
              pathname: `${asPath}/[connectionId]`,
              query: { connectionId: connection.id },
            }}
          >
            <Cog8ToothIcon className="h-6 w-6" />
            {t("Settings")}
          </Link>
          <Link
            className="flex items-end space-x-2 text-blue-500 text-blue-500"
            href={{
              pathname: `${asPath}/[connectionId]`,
              query: { connectionId: connection.id },
            }}
          >
            <InformationCircleIcon className="w-6" />
            <span>{t("Usage & details")} </span>
          </Link>
        </div>
      </div>
    </Block>
  );
};

export default ConnectionDataCard;
