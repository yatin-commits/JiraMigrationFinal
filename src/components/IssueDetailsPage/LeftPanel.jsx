import { useNavigate } from "react-router-dom";
import Attachments from "./Attachments";
import CollapsibleSection from "./CollapsibleSection";
import Comments from "./Comments";
import KeyDetails from "./KeyDetails";
import ChildWorkItems from "./ChildWorkItems";


const LeftPanel = ({ issue, comments, attachments}) => {
  const navigate = useNavigate()
  return (
    <div className="lg:col-span-8 rounded-xl border border-gray-200/70 bg-white/80 shadow-sm ring-1 ring-black/5 p-4 sm:p-6 lg:overflow-y-auto space-y-6 backdrop-blur supports-[backdrop-filter]:bg-white/60">

      {/*Back to Home Page*/}
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-1 text-sm text-blue-800 font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 rounded"
      >
       ← Back To Issues
      </button>

      {/* Breadcrumb / Issue header */}
      <div className="text-sm text-gray-700 font-medium">
        {issue?.projectName} {"("} {issue?.projectKey} {")"} / {issue?.issueType} :{" "}
        <span className="text-blue-900 font-semibold">
          {issue?.issueKey}
        </span>
 
       
        {issue?.parentKey && (
          <span className="ml-3 text-gray-600">
            | Parent :{" "}
            <button
              onClick={() => navigate(`/issue/${issue.parentKey}`)}
              className="text-blue-800 font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 rounded"
            >
              {issue.parentKey}
            </button>
          </span>
        )}
 
      </div>

      {/* Summary */}
      <h1 className="text-2xl font-semibold text-gray-900">
        {issue?.summary}
      </h1>

      {/* Collapsible Sections */}
      <div className="space-y-4">
        <CollapsibleSection title="Key Details">
          <KeyDetails issue={issue} />
        </CollapsibleSection>

        <CollapsibleSection title="Attachments" defaultOpen={false}>
          <Attachments attachments={attachments} />
        </CollapsibleSection>

        <CollapsibleSection title="Child Work Items" defaultOpen={false}>
          <ChildWorkItems issueKey = {issue.issueKey}></ChildWorkItems>
        </CollapsibleSection>
        <CollapsibleSection title="Comments">
          <Comments comments={comments} />
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default LeftPanel;
