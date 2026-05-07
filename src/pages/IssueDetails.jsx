import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LeftPanel from "../components/IssueDetailsPage/LeftPanel";
import RightPanel from "../components/IssueDetailsPage/RightPanel";
import Navbar from "../components/Navbar";
import { fetchIssueDetail } from "../services/apiClient";

const IssueDetails = () => {
  const { key } = useParams();
  const [issueData, setIssueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIssueDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchIssueDetail(key);
        setIssueData(data);
      } catch (err) {
        console.error("Error loading issue detail:", err);
        setError("Failed to load issue: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (key) {
      loadIssueDetail();
    }
  }, [key]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-56px)] w-full bg-gray-50 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
            <p className="text-sm font-medium">Loading issue details…</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !issueData) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-56px)] w-full bg-gray-50 flex items-center justify-center">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <p className="font-semibold mb-2">Could not load issue</p>
            <p className="text-sm">{error || "Issue not found"}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-56px)] w-full bg-gray-50 w-screen p-3 sm:p-4 lg:h-[calc(100vh-56px)]">
        <div className="min-h-[calc(100vh-56px)] w-full bg-gray-50 p-3 sm:p-4 lg:h-[calc(100vh-56px)]">
  <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-full">

    {/* LEFT PANEL */}
    <div className="lg:col-span-7 h-full">
      <LeftPanel
        issue={issueData}
        comments={issueData.comments || []}
        attachments={issueData.attachments || []}
      />
    </div>

    {/* RIGHT PANEL */}
    <div className="lg:col-span-5 h-full">
      <RightPanel issue={issueData} />
    </div>

  </div>
</div>
      </div>
    </>
  );
};

export default IssueDetails;