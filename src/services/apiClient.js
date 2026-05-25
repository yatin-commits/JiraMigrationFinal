const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ── JWT Helpers ──────────────────────────────────────────────
export const saveToken = (token) => localStorage.setItem("jwt_token", token);
export const getToken = () => localStorage.getItem("jwt_token");
export const removeToken = () => localStorage.removeItem("jwt_token");
export const isLoggedIn = () => !!getToken();

export const saveUserEmail = (email) =>
  localStorage.setItem("user_email", email);
export const getUserEmail = () => localStorage.getItem("user_email");
export const removeUserEmail = () => localStorage.removeItem("user_email");

// ── Generic fetch wrapper ────────────────────────────────────
const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        // ← JWT token har request mein
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    // Token expire ho gaya → login pe bhejo
    if (response.status === 401) {
      removeToken();
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

// ── Auth APIs ────────────────────────────────────────────────

/**
 * Send OTP to email
 * POST /auth/send-otp
 */
export const sendOtp = async (email) => {
  const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg);
  }
  return await response.text();
};

/**
 * Verify OTP → get JWT token
 * POST /auth/verify-otp
 */
export const verifyOtp = async (email, otp) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "OTP verification failed");
  }
  // Token save karo
  saveToken(data.token);
  return data;
};

// ── Protected APIs ───────────────────────────────────────────

export const fetchProjects = async () => fetchAPI("/projects");

export const fetchIssueTypes = async () => fetchAPI("/issue-types");

export const fetchIssueKeys = async (query = "") => {
  const params = new URLSearchParams();
  if (query) params.append("query", query);
  return fetchAPI(`/issue-keys?${params.toString()}`);
};

export const fetchIssues = async (filters = {}) => {
  const {
    projectKey, issueType, issueKey,
    search, prioritySort, page = 1, pageSize = 20,
  } = filters;

  const params = new URLSearchParams();
  if (projectKey)  params.append("projectKey", projectKey);
  if (issueType)   params.append("issueType", issueType);
  if (issueKey)    params.append("issueKey", issueKey);
  if (search)      params.append("search", search);
  if (prioritySort) params.append("prioritySort", prioritySort);
  params.append("page", page);
  params.append("pageSize", pageSize);

  return fetchAPI(`/issues?${params.toString()}`);
};

export const fetchIssueDetail = async (issueKey) =>
  fetchAPI(`/issues/${issueKey}`);

export const fetchEpicChildren = async (issueKey) =>
  fetchAPI(`/issues/${issueKey}/children`);

export const getAttachmentDownloadUrl = (attachmentId) =>
  `${API_BASE_URL}/attachments/${attachmentId}/download`;