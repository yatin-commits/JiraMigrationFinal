import StatusPanel from "./StatusPanel";
import IssueMetaDetails from "./IssueMetaDetails";

const RightPanel = ({ issue }) => {
  return (
    <div className="lg:col-span-4 rounded-xl border border-gray-200/70 bg-white/80 shadow-sm ring-1 ring-black/5 p-4 lg:overflow-y-auto space-y-4 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <StatusPanel status={issue?.status} severity={issue?.severity} />
      <IssueMetaDetails issue={issue} />
    </div>
  );
};

export default RightPanel;
