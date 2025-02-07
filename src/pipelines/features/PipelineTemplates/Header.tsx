import React from "react";
import clsx from "clsx";
import Button from "core/components/Button";
import SearchInput from "core/features/SearchInput";
import Listbox from "core/components/Listbox";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { ViewOptions } from "./PipelineTemplates";

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  workspaceFilter: any;
  setWorkspaceFilter: (filter: any) => void;
  workspaceFilterOptions: any[];
  view: "grid" | "card";
  setView: (view: "grid" | "card") => void;
  viewOptions: ViewOptions;
};

const Header = ({
  searchQuery,
  setSearchQuery,
  searchInputRef,
  workspaceFilter,
  setWorkspaceFilter,
  workspaceFilterOptions,
  view,
  setView,
  viewOptions,
}: HeaderProps) => {
  return (
    <div className={"my-5 flex justify-between"}>
      <SearchInput
        ref={searchInputRef}
        onSubmit={(event) => event.preventDefault()}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value ?? "")}
        className="shadow-xs border-gray-50 w-96"
      />
      <div className={"flex gap-5"}>
        <Listbox
          value={workspaceFilter}
          onChange={setWorkspaceFilter}
          options={workspaceFilterOptions}
          by="id"
          getOptionLabel={(option) => option.label}
          className={"min-w-72"}
        />
        {viewOptions === ViewOptions.GRID_AND_CARD && (
          <div className={"bg-gray-50 rounded"}>
            <Button
              variant={"custom"}
              onClick={() => setView("card")}
              rounded={false}
              focusRing={false}
              className={clsx(
                view === "card" && "bg-white",
                "rounded-bl rounded-tl",
                "text-gray-800 border-transparent hover:bg-white",
              )}
            >
              <Squares2X2Icon
                className={clsx("h-4 w-4", view === "card" && "text-blue-400")}
              />
            </Button>
            <Button
              variant={"custom"}
              onClick={() => setView("grid")}
              rounded={false}
              focusRing={false}
              className={clsx(
                view === "grid" && "bg-white",
                "rounded-br rounded-tr",
                "text-gray-800 border-transparent hover:bg-white",
              )}
            >
              <ListBulletIcon
                className={clsx("h-4 w-4", view === "grid" && "text-blue-400")}
              />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
