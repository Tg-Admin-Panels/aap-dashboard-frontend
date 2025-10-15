import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const ChartTab: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial period from URL or default to "monthly"
  const initialPeriod =
    (searchParams.get("period") as "weekly" | "monthly" | "yearly" | null) ||
    "monthly";

  const [selected, setSelected] = useState<"weekly" | "monthly" | "yearly">(
    initialPeriod
  );

  // Update URL whenever user changes tab
  const handleSelect = (option: "weekly" | "monthly" | "yearly") => {
    setSelected(option);
    searchParams.set("period", option);
    setSearchParams(searchParams);
  };

  // Button active/inactive styles
  const getButtonClass = (option: "weekly" | "monthly" | "yearly") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  // Keep tab in sync if user lands directly with ?period=...
  useEffect(() => {
    const period = searchParams.get("period");
    if (period && ["weekly", "monthly", "yearly"].includes(period)) {
      setSelected(period as any);
    }
  }, [searchParams]);

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => handleSelect("weekly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "weekly"
        )}`}
      >
        Weekly
      </button>

      <button
        onClick={() => handleSelect("monthly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "monthly"
        )}`}
      >
        Monthly
      </button>

      <button
        onClick={() => handleSelect("yearly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "yearly"
        )}`}
      >
        Yearly
      </button>
    </div>
  );
};

export default ChartTab;
