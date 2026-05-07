import { useState } from "react";
 
const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
 
  return (
    <div className="border border-gray-200/70 rounded-lg overflow-hidden bg-white/80 ring-1 ring-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50/80 hover:bg-gray-100/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <span className="text-gray-500 text-base leading-none">
          {open ? "▾" : "▸"}
        </span>
      </button>
 
      {/* Content */}
      {open && (
        <div className="px-4 py-4">
          {children}
        </div>
      )}
    </div>
  );
};
 
export default CollapsibleSection;
 