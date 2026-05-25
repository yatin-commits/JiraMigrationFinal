import { useState } from "react";
import { formatDate } from "../../utils/formatDate";
 
const ITEMS_PER_PAGE = 4; // show 4 attachments at once
const DownloadIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);
 
const Attachments = ({ attachments = [] }) => {
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);

const handleDownloadClick = (e, att) => {
    e.preventDefault(); // ← default link behaviour rok do

    const token = localStorage.getItem("jwt_token");

    fetch(att.downloadUrl, {
        headers: {
            Authorization: `Bearer ${token}`  // ← JWT header
        }
    })
    .then(res => res.blob())
    .then(blob => {
        // File download karo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = att.filename;
        link.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(err => console.error("Download failed:", err));
};
 
  if (!attachments.length) {
    return (
      <section>
        <p className="text-sm text-gray-500">No attachments available</p>
      </section>
    );
  }
 
  // pagination calculations
  const totalPages = Math.ceil(attachments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAttachments = attachments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
 
  return (
    <section>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Attached by</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Attachment name</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Date added</th>
              <th className="px-4 py-2 text-center"></th>
            </tr>
          </thead>
 
          <tbody className="divide-y divide-gray-100">
            {paginatedAttachments.map((att) => (
              
              <tr key={att.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 text-gray-700">
                  {att.uploadedBy || "—"}
                </td>
 
                <td className="px-4 py-2 text-blue-800 truncate max-w-xs">
                  {att.filename}
                </td>
 
                <td className="px-4 py-2 text-gray-700">
                  {formatDate(att.uploadedAt)}
                </td>
 
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-3">
                    {/* Download */}
                    <a
                      title="Download"
    href={att.downloadUrl}
    onClick={(e) => handleDownloadClick(e, att)}  // ← e bhi pass karo
    className="text-gray-500 hover:text-green-600"
>
    <DownloadIcon />
</a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-3 text-sm">
        <span className="text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
 
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
          >
            Previous
          </button>
 
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
 
export default Attachments;