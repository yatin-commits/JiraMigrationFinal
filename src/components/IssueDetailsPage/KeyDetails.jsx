import { parseJiraMarkup } from "../../utils/parseJiraMarkup";

const KeyDetails = ({ issue }) => {
  return (
    <section className="space-y-4">
        <div>
        <h3 className="font-semibold text-gray-600">Description</h3>
        <p className="text-base text-gray-700 whitespace-pre-line hover:bg-gray-50 p-4 hover:rounded-xl">
          {parseJiraMarkup(issue?.description) || "None"}
        </p>
      </div>

        <div>
            <h3 className="font-semibold text-gray-600">Release Notes</h3>
            <p className="text-base text-gray-700 whitespace-pre-line hover:bg-gray-50 hover:rounded-xl p-4">
            {issue?.releaseNotes || "None"}
            </p>
        </div>

        <div>
            <h3 className="font-semibold text-gray-600">Root Cause</h3>
            <p className="text-base text-gray-700 p-4 hover:bg-gray-50 hover:rounded-xl">
            {issue?.rootCause || "None"}
            </p>
        </div>
    </section>
  );
};

export default KeyDetails;