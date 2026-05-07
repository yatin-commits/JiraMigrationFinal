import { useState } from "react";

export default function IssueKeyFilter({
  value,
  onChange,
  options = [],
  onSelect,
  showNoResults
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = isOpen && Boolean(value);

  return (
    <div className="relative flex flex-col gap-1 w-full sm:w-64">
      <label className="text-sm font-medium text-gray-700">
        Issue Key
      </label>

      <input
        type="text"
        value={value}
        placeholder="e.g. WS-8"
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onBlur={() => {
          //small delay to register
          setTimeout(() => setIsOpen(false), 150);
        }}
        className="
          border border-gray-300
          rounded-md
          px-3 py-2
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

      {open && (
        <div className="absolute top-full mt-1 w-full bg-white border rounded-md shadow z-10 max-h-48 overflow-auto">
          {options.length > 0 ? (
            options.map((key) => (
              <div
                key={key}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onMouseDown={() => {
                  onSelect(key);
                  setIsOpen(false); //close dropdown
                }}
              >
                {key}
              </div>
            ))
          ) : (
            showNoResults && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No records found for this issue key
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
