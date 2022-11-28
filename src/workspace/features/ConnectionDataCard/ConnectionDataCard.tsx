import {
  Cog8ToothIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
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
    <Block className="p-4">
      <div className="grid grid-rows-3 gap-4">
        <div className="row-span-3 ">
          <section>
            <div
              className="text-sm font-medium text-gray-900"
              title={connection.name}
            >
              <Link
                className="flex items-end space-x-2 text-blue-500 text-blue-500"
                href={{
                  pathname: `${asPath}/[connectionId]`,
                  query: { connectionId: connection.id },
                }}
              >
                <span> {capitalize(connection.name)} </span>
              </Link>
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
          <section className="col-span-3 mt-4">
            <div className="col-span-3 h-16 text-sm font-normal text-gray-900 line-clamp-4">
              {connection.description}
            </div>
          </section>
        </div>
        <div className="row-span-3 ">
          <div className="flex justify-end space-x-4">
            <Link
              className="flex items-end space-x-2 text-blue-500 text-blue-500"
              href=""
            >
              <Cog8ToothIcon className="h-6 w-6" />
              {t("Settings")}
            </Link>
            <Link
              className="flex items-end space-x-2 text-blue-500 text-blue-500"
              href=""
            >
              <InformationCircleIcon className="w-6" />
              <span>{t("Usage & details")} </span>
            </Link>
          </div>
        </div>
      </div>
    </Block>
  );
};

export default ConnectionDataCard;
