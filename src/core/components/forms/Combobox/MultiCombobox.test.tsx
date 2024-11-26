import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MultiCombobox from "./MultiCombobox";
import userEvent from "@testing-library/user-event";

type Item = { id: number; name: string };

const items: Item[] = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 0, name: "Item 0" },
  { id: 3, name: "Item 3" },
];

describe("MultiCombobox", () => {
  test("renders sorting by id", async () => {
    const handleChange = jest.fn();
    render(
      <MultiCombobox<Item>
        value={[]}
        onChange={handleChange}
        displayValue={(item: Item) => item.name}
        onInputChange={() => {}}
        by={(a: Item, b: Item) => a.id === b.id}
      >
        {items.map((item) => (
          <MultiCombobox.CheckOption key={item.id} value={item}>
            {item.name}
          </MultiCombobox.CheckOption>
        ))}
      </MultiCombobox>,
    );

    const comboboxButton = screen.getByRole("button");
    const comboboxInput = screen.getByRole("combobox");
    expect(comboboxButton).toBeInTheDocument();
    expect(comboboxInput).toBeInTheDocument();

    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId("combobox-options")).toBe(null);

    await waitFor(async () => {
      await userEvent.click(comboboxButton);
      expect(screen.getByTestId("combobox-options")).toBeInTheDocument();
      const allOptions = screen.getAllByRole("option");
      expect(allOptions.length === 4).toBeTruthy();
      await userEvent.click(allOptions[2]);
    });
    expect(handleChange).toHaveBeenCalledWith(items.at(2));
  });
});
