import { useEffect, useState, useMemo, useContext } from "react";
import PageLayout from "../components/PageLayout";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import ProjectFilter from "../components/ProjectFilter";
import IssueTypeFilter from "../components/IssueTypeFilter";
import { UserContext } from "../UserContext";
import { fetchIssues } from "../services/apiClient";

const PAGE_SIZE = 20;

export default function ProjectIssuesPage() {
  const { projects, issueTypes, loading: contextLoading, error: contextError } = useContext(UserContext);

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalIssues, setTotalIssues] = useState(0);

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedIssueType, setSelectedIssueType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [prioritySortOrder, setPrioritySortOrder] = useState(null);
  const [issueTypeSortOrder, setIssueTypeSortOrder] = useState(null);
  const [showPrioritySort, setShowPrioritySort] = useState(false);

  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const clearAllFilters = () => {
    setSelectedProject("");
    setSelectedIssueType("");
    setSearchQuery("");
    setPrioritySortOrder(null);
    setIssueTypeSortOrder(null);
    setPage(1);
  };

  // Fetch issues when filters or page changes
  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await fetchIssues({
          projectKey: selectedProject || undefined,
          issueType: selectedIssueType || undefined,
          search: searchQuery || undefined,
          prioritySort: prioritySortOrder || undefined,
          page,
          pageSize: PAGE_SIZE,
        });

        setIssues(response.data || []);
        setTotalIssues(response.total || 0);
      } catch (err) {
        console.error("Error loading issues:", err);
        setError("Failed to load issues: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, [selectedProject, selectedIssueType, searchQuery, prioritySortOrder, page]);

  const hasActiveQuery = useMemo(
    () =>
      Boolean(
        searchQuery.trim() ||
          selectedProject ||
          selectedIssueType
      ),
    [searchQuery, selectedProject, selectedIssueType]
  );

  const totalPages = Math.ceil(totalIssues / PAGE_SIZE);

  // Handle issue type sorting on client side (since API handles priority sort)
  const displayedIssues = useMemo(() => {
    if (!issueTypeSortOrder) return issues;

    return [...issues].sort((a, b) => {
      const aType = (a.issueType || "").toLowerCase();
      const bType = (b.issueType || "").toLowerCase();
      return issueTypeSortOrder === "asc"
        ? aType.localeCompare(bType)
        : bType.localeCompare(aType);
    });
  }, [issues, issueTypeSortOrder]);

  function FilterPill({ label, value, onClear, variant = "green" }) {
    const styles = {
      green: "bg-green-50 border-green-300 text-gray-700",
      blue: "bg-blue-50 border-blue-300 text-gray-700",
    };

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${styles[variant]}`}
      >
        <span className="font-medium">{label}:</span>
        <span className="max-w-[160px] truncate">{value}</span>
        <button onClick={onClear} className="opacity-60 hover:opacity-100">
          ×
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <PageLayout title="">
        <h1 className="mt-6 mb-6 px-6 text-4xl font-semibold text-center mb-6 text-gray-900">
          Project Issues
        </h1>

        {/* SEARCH */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search by issue key, summary, description, assignee, reporter, type, status, priority..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="
                w-full border border-gray-300 rounded-md
                px-4 py-2 pl-10
                text-sm text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
              "
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.6-5.65a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* FILTER & SORT ROW */}
        <div className="px-6 mb-3 flex justify-between items-center">
          <button
            onClick={() => setShowFilters(p => !p)}
            className="
              bg-green-100 border border-green-300
              text-gray-700 px-3 py-1.5
              rounded-md text-sm font-medium
              hover:bg-green-200
            "
          >
            ☰ Filter
          </button>

          <div className="relative">
            <button
              onClick={() => setShowPrioritySort(p => !p)}
              className={`
                px-3 py-1.5 border rounded-md
                text-sm font-semibold text-gray-700
                ${
                  prioritySortOrder
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-300"
                }
                hover:bg-blue-100
              `}
            >
              Priority {prioritySortOrder === "desc" ? "↓" : prioritySortOrder === "asc" ? "↑" : "⬍"}
            </button>

            {showPrioritySort && (
              <div className="absolute right-4 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-20">
                <button
                  onClick={() => {
                    setPrioritySortOrder("desc");
                    setShowPrioritySort(false);
                    setPage(1);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Priority: High → Low
                </button>
                <button
                  onClick={() => {
                    setPrioritySortOrder("asc");
                    setShowPrioritySort(false);
                    setPage(1);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Priority: Low → High
                </button>
                {prioritySortOrder && (
                  <button
                    onClick={() => {
                      setPrioritySortOrder(null);
                      setShowPrioritySort(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-gray-100"
                  >
                    Clear sorting
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FILTERS */}
        {showFilters && (
          <div className="px-6 mb-3 flex gap-4 flex-wrap items-end">
            <ProjectFilter
              value={selectedProject}
              onChange={value => {
                setSelectedProject(value);
                setPage(1);
              }}
              projects={projects}
            />
            <IssueTypeFilter
              value={selectedIssueType}
              onChange={value => {
                setSelectedIssueType(value);
                setPage(1);
              }}
              issueTypes={issueTypes}
            />
          </div>
        )}

        {/* ACTIVE FILTER PILLS */}
        {(selectedProject || selectedIssueType || searchQuery) && (
          <div className="px-6 mb-4 flex flex-wrap gap-3 items-center">
            {selectedProject && (
              <FilterPill
                label="Project"
                value={projects.find(p => p.key === selectedProject)?.name}
                onClear={() => setSelectedProject("")}
              />
            )}
            {selectedIssueType && (
              <FilterPill
                label="Type"
                value={selectedIssueType}
                onClear={() => setSelectedIssueType("")}
              />
            )}
            {searchQuery && (
              <FilterPill
                label="Search"
                value={searchQuery}
                onClear={() => setSearchQuery("")}
              />
            )}
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {contextLoading ? (
          <div className="rounded-lg border border-gray-200 bg-white py-16 text-center text-gray-500">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
            <p className="text-sm font-medium">Loading projects…</p>
          </div>
        ) : contextError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <p className="font-semibold mb-2">Could not load filters</p>
            <p className="text-sm">{contextError}</p>
          </div>
        ) : loading ? (
          <div className="rounded-lg border border-gray-200 bg-white py-16 text-center text-gray-500">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
            <p className="text-sm font-medium">Loading issue data…</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <p className="font-semibold mb-2">Could not load issues</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : !hasActiveQuery ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
            <p className="text-lg font-semibold mb-2">Search or filter to view issues.</p>
            <p className="text-sm">
              No issue list is shown until you enter a search or select a filter.
            </p>
          </div>
        ) : (
          <>
            <Table
              data={displayedIssues}
              searchQuery={searchQuery}
              emptyMessage="No issues match your current search or filters."
              issueTypeSortOrder={issueTypeSortOrder}
              onTypeHeaderClick={() => {
                setIssueTypeSortOrder(prev =>
                  prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
                );
                setPrioritySortOrder(null);
                setPage(1);
              }}
            />
            {totalPages > 0 && (
              <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            )}
          </>
        )}
      </PageLayout>
    </>
  );
}
