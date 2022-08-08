import * as React from "react";
import { Cell } from "react-table";

export const CellContext = React.createContext<Cell<any> | null>(null);

export function useCellContext() {
  const cell = React.useContext(CellContext);
  if (!cell) {
    throw new Error("useCellContext muse be used inside a CellContext wrapper");
  }
  return cell;
}

export function CellContextProvider(props: {
  cell: Cell;
  children: React.ReactNode;
}) {
  return (
    <CellContext.Provider value={props.cell}>
      {props.children}
    </CellContext.Provider>
  );
}
