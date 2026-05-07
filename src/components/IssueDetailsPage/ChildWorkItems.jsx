import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEpicChildren } from "../../services/apiClient";
import { priorityColors } from "../../utils/priorityColors";
import { statusStyles } from "../../utils/statusStyles";

const ChildWorkItems = ({ issueKey }) => {
  const navigate = useNavigate();
  const [childWorkItems, setChildWorkItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {
  if (!issueKey) return;

  // setChildWorkItems([
  //   {
  //     projectName: "Web Services",
  //     issueKey: "WS-101",
  //     summary: "Fix API authentication issue",
  //     priority: "High",
  //     assignee: "John Doe",
  //     reporter: "Alice Smith",
  //     status: "In Progress"
  //   },
  //   {
  //     projectName: "Web Services",
  //     issueKey: "WS-102",
  //     summary: "Improve error handling",
  //     priority: "Medium",
  //     assignee: "Jane Roe",
  //     reporter: "Bob Martin",
  //     status: "Open"
  //   },
  //   {
  //     projectName: "Web Services",
  //     issueKey: "WS-103",
  //     summary: "Update documentation",
  //     priority: "Low",
  //     assignee: "Unassigned",
  //     reporter: "Chris Evans",
  //     status: "To Do"
  //   }
  // ]);
  // setLoading(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchEpicChildren(issueKey);
      const items = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];
      setChildWorkItems(items);
    } catch (error) {
      console.error(error);
      setError("Failed to load child work items");
      setChildWorkItems([]);
    } finally {
      setLoading(false);
    }
  };

  fetchItems();
}, [issueKey]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading child work items...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (childWorkItems.length === 0) {
    return <p className="text-sm text-gray-500">No child work items found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full border-collapse bg-white text-sm">
        <thead>
          <tr>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Issue Key</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Summary</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Priority</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Assignee</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Reporter</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
          </tr>
        </thead>

        <tbody className="text-sm text-gray-800">
          {childWorkItems.map((item) => (
            <tr key={item.issueKey} className="border-t cursor-pointer transition-colors group hover:bg-blue-50" onClick={()=>{navigate(`/issue/${item.issueKey}`)}}>
              <td className="px-4 py-2 font-semibold text-[#0747a6] group-hover:underline whitespace-nowrap">
                {item.issueKey}
              </td>
              <td className="px-4 py-2">{item.summary}</td>
              <td className={`px-4 py-2 ${priorityColors[item.priority]}`}>{item.priority}</td>
              <td className="px-4 py-2">{item.assigneeName || item.assignee || "Unassigned"}</td>
              <td className="px-4 py-2">{item.reporterName || item.reporter || "Unassigned"}</td>
             
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ring-black/10 ${statusStyles[item.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {item.status}
                  </span>
                </td>
 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChildWorkItems;