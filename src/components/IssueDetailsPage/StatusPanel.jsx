import { SEVERITY_COLOR_MAP } from "../../utils/severityColors";
import { statusStyles } from "../../utils/statusStyles.js";
const StatusPanel = ({ status, severity }) => {
  const severityClasses =
    SEVERITY_COLOR_MAP[severity] ||
    "bg-gray-100 text-gray-600 border-gray-300";

  const statusStyle = statusStyles[status] || "bg-gray-100 text-gray-500";
  return (
    <section className="rounded-md border border-gray-200 p-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Status</h3>

      <div className="flex flex-wrap gap-2">
        {/* Status */}
        <span
          className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-black/10 ${statusStyle}`}
        >
          Status: {status || "—"}
        </span>

        {/* Severity */}
        {severity && (
          <span
            className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold border bg-gray-50 ${severityClasses}`}
          >
            Severity: {severity}
          </span>
        )}
      </div>
    </section>
  );
};

export default StatusPanel;