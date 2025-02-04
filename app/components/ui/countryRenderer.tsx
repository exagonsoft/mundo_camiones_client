import { cn } from "@/lib/utils";
import Flag from "react-world-flags";
import countries from "world-countries";

const RenderCountry = ({ country, className, showName }: { country?: string, className?: string, showName?: boolean }) => {
    const _countryName = countries.find((_country) => _country.cca2 === country)
    return (
      <div className={cn("flex gap-2 justify-end items-center w-full", className)}>
        {showName && <span>{_countryName?.name.common}</span>}
        <Flag code={country} style={{ width: 30, height: 20 }} />
      </div>
    );
  };

  export default RenderCountry;