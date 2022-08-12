import CountryBadge from "core/features/CountryBadge";
import { ReactElement, useMemo } from "react";
import { BaseColumnProps } from "./BaseColumn";
import { useCellContext } from "./helpers";

type CountryColumnProps = {
  max?: number;
  defaultValue?: ReactElement | string;
} & BaseColumnProps;

const CountryColumn = (props: CountryColumnProps) => {
  const { max, defaultValue } = props;
  const cell = useCellContext();
  const allCountries = useMemo(() => {
    if (!cell.value) return [];

    return Array.isArray(cell.value) ? cell.value : [cell.value];
  }, [cell.value]);

  const countries = useMemo(
    () => (max ? allCountries.slice(0, max) : allCountries),
    [max, allCountries]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!allCountries?.length && defaultValue}
      {countries.map((country) => (
        <CountryBadge key={country.code} country={country} />
      ))}
      {allCountries.length !== countries.length && (
        <span>(+ {allCountries.length - countries.length})</span>
      )}
    </div>
  );
};

export default CountryColumn;
