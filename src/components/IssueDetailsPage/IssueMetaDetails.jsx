import { useState } from "react";
import { LabelsField } from "./LabelsField";
import IssueInField from "./IssueInField";
import ClientsField from "./ClientsField";
import { IssueReasonRCA } from "./IssueReasonRCA";
import { formatDate } from "../../utils/formatDate";
import { priorityColors } from "../../utils/priorityColors";
const MetaField = ({ label, value, style = "" }) => {
  const isEmpty = value === undefined || value === null || value === "";
  const displayValue = isEmpty ? "None" : value;
  const valueClasses = isEmpty
    ? "text-gray-500"
    : `text-gray-900 ${style}`;

  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
      <p className={`text-sm leading-snug ${valueClasses}`}>{displayValue}</p>
    </div>
  );
};

const MetaItemWrapper = ({ children }) => (
  <div className="w-full sm:w-[48%]">
    {children}
  </div>
);

const IssueMetaDetails = ({ issue }) => {
  const [isOpen, setIsOpen] = useState(true);

  const labels = (Array.isArray(issue?.labels) ? issue.labels : []).filter((label) => label);
  const issueInList = (Array.isArray(issue?.issueInList) ? issue.issueInList : []).filter((issueIn) => issueIn);
  const clients = (Array.isArray(issue?.clients) ? issue.clients : []).filter((client) => client);
  const issueReasons = (Array.isArray(issue?.issueReasons) ? issue.issueReasons : []).filter((issueReason) => issueReason);
  return (
    <section className="rounded-md border border-gray-200">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
      >
        <h3 className="text-xs font-bold text-gray-500 uppercase">
          Details
        </h3>
        <span className="text-gray-400 text-base leading-none">
          {isOpen ? "▾" : "▸"}
        </span>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="w-full px-3 pb-3 pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:flex-wrap gap-4">
          <MetaItemWrapper>
            <MetaField label="Reporter" value={issue?.reporterName} />
          </MetaItemWrapper>

          <MetaItemWrapper>
            <MetaField label="Assignee" value={issue?.assigneeName} />
          </MetaItemWrapper>

          <MetaItemWrapper>
            <MetaField label="Start Date" value={formatDate(issue?.startDate)} />
          </MetaItemWrapper>

          <MetaItemWrapper>
            <MetaField label="Actual Start Date" value={formatDate(issue?.actualStartDate)} />
          </MetaItemWrapper>

          <MetaItemWrapper>
            <MetaField label="Actual End Date" value={formatDate(issue?.actualEndDate)} />
          </MetaItemWrapper>

          <MetaItemWrapper>
            <LabelsField labels={labels} />
          </MetaItemWrapper>

          <MetaItemWrapper>
            <IssueInField issueIn={issueInList} />
          </MetaItemWrapper>

          <MetaItemWrapper>
            <ClientsField clients={clients} />
          </MetaItemWrapper>

          <MetaItemWrapper>
            <IssueReasonRCA issueReasons={issueReasons} />
          </MetaItemWrapper>

          <MetaItemWrapper>
            <MetaField
              label="Priority"
              value={issue?.priority}
              style={`${priorityColors[issue?.priority] || "text-gray-800"} font-medium`}
            />
          </MetaItemWrapper>

          <MetaItemWrapper>
            <MetaField
              label="Redmine Tracker ID"
              value={issue?.redmineTrackerId}
            />
          </MetaItemWrapper>

          {/* <MetaItemWrapper>
            
          </MetaItemWrapper> */}
        </div>
      )}
    </section>
  );
};

export default IssueMetaDetails;
