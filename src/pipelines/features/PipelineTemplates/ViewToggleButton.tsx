import React from "react";
import clsx from "clsx";
import Button from "core/components/Button";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

type ViewToggleButtonProps = {
  view: "grid" | "card";
  setView: (view: "grid" | "card") => void;
};

const ViewToggleButton = ({ view, setView }: ViewToggleButtonProps) => {
  return (
    <div className={"bg-gray-50 rounded"}>
      <Button
        data-testid={"card-view"}
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
        data-testid={"grid-view"}
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
  );
};

export default ViewToggleButton;
