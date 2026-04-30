const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Generic fetch wrapper with error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

/**
 * 1) List Projects
 * GET /api/projects
 */
export const fetchProjects = async () => {
  return fetchAPI("/projects");
};

/**
 * 2) List Issue Types
 * GET /api/issue-types
 */
export const fetchIssueTypes = async () => {
  return fetchAPI("/issue-types");
};

/**
 * 3) Issue Key Autocomplete
 * GET /api/issue-keys?query=...
 */
export const fetchIssueKeys = async (query = "") => {
  const params = new URLSearchParams();
  if (query) {
    params.append("query", query);
  }
  return fetchAPI(`/issue-keys?${params.toString()}`);
};

/**
 * 4) Issues List (filtered + paged)
 * GET /api/issues
 */
export const fetchIssues = async (filters = {}) => {
  const {
    projectKey,
    issueType,
    issueKey,
    search,
    prioritySort,
    page = 1,
    pageSize = 20,
  } = filters;

  const params = new URLSearchParams();
  if (projectKey) params.append("projectKey", projectKey);
  if (issueType) params.append("issueType", issueType);
  if (issueKey) params.append("issueKey", issueKey);
  if (search) params.append("search", search);
  if (prioritySort) params.append("prioritySort", prioritySort);
  params.append("page", page);
  params.append("pageSize", pageSize);

  return fetchAPI(`/issues?${params.toString()}`);
};

/**
 * 5) Issue Detail
 * GET /api/issues/{issueKey}
 */
export const fetchIssueDetail = async (issueKey) => {
  return fetchAPI(`/issues/${issueKey}`);
};

/**
 * 6) Children Issues (Epic children)
 * GET /api/issues/{issueKey}/children
 */
export const fetchEpicChildren = async (issueKey) => {
  return fetchAPI(`/issues/${issueKey}/children`);
};

/**
 * 7) Attachment Download
 * GET /api/attachments/{id}/download
 */
export const getAttachmentDownloadUrl = (attachmentId) => {
  return `${API_BASE_URL}/attachments/${attachmentId}/download`;
};
