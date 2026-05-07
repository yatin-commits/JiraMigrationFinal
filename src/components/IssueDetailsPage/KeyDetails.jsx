import { parseJiraMarkup } from "../../utils/parseJiraMarkup";

const KeyDetails = ({ issue }) => {
  return (
    <section className="space-y-4">
        <div>
        <h3 className="font-semibold text-gray-700">Description</h3>
        <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {parseJiraMarkup(issue?.description) || "None"}
        </div>
      </div>

        <div>
            <h3 className="font-semibold text-gray-700">Release Notes</h3>
            <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {issue?.releaseNotes || "None"}
            </div>
        </div>

        <div>
            <h3 className="font-semibold text-gray-700">Root Cause</h3>
            <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {issue?.rootCause || "None"}
            </div>
        </div>
    </section>
  );
};

export default KeyDetails;