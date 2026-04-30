# API Service Documentation

## Overview
The `apiClient.js` service provides typed functions for all backend API endpoints. This document details each function and its usage.

## Setup

### Environment Configuration
The API base URL is loaded from `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

All functions are available from:
```javascript
import { 
  fetchProjects, 
  fetchIssueTypes, 
  fetchIssueKeys,
  fetchIssues,
  fetchIssueDetail,
  fetchEpicChildren,
  getAttachmentDownloadUrl
} from '../services/apiClient';
```

## API Functions

### 1. **fetchProjects()**
Retrieves all projects.

**Example:**
```javascript
const projects = await fetchProjects();
// Returns: [{ key: "ABC", name: "Alpha Project" }, ...]
```

**Response:**
```typescript
Array<{
  key: string;
  name: string;
}>
```

---

### 2. **fetchIssueTypes()**
Retrieves all issue types.

**Example:**
```javascript
const types = await fetchIssueTypes();
// Returns: ["Bug", "Task", "Story", "Epic"]
```

**Response:**
```typescript
Array<string>
```

---

### 3. **fetchIssueKeys(query?: string)**
Autocomplete issue keys. Returns up to 10 matching keys.

**Parameters:**
- `query` (optional): Search query. If blank, returns empty array.

**Example:**
```javascript
const keys = await fetchIssueKeys("WS");
// Returns: ["WS-1", "WS-12", "WS-123"]
```

**Response:**
```typescript
Array<string>
```

---

### 4. **fetchIssues(filters: object)**
Retrieves paginated, filtered issue list.

**Parameters:**
```typescript
{
  projectKey?: string;      // Filter by project key
  issueType?: string;       // Filter by issue type
  issueKey?: string;        // Filter by specific issue key
  search?: string;          // Search across multiple fields
  prioritySort?: "asc" | "desc"; // Sort priority (asc: Low→High, desc: High→Low)
  page?: number;            // Current page (1-indexed, default: 1)
  pageSize?: number;        // Items per page (default: 20)
}
```

**Example:**
```javascript
const response = await fetchIssues({
  projectKey: "ABC",
  issueType: "Bug",
  search: "login",
  prioritySort: "desc",
  page: 1,
  pageSize: 20
});
```

**Response:**
```typescript
{
  data: Array<{
    issueKey: string;
    summary: string;
    description: string;
    projectKey: string;
    projectName: string;
    issueType: string;
    priority: string;
    status: string;
    assigneeName: string;
    reporterName: string;
  }>;
  page: number;
  pageSize: number;
  total: long;
}
```

---

### 5. **fetchIssueDetail(issueKey: string)**
Retrieves complete issue details including attachments and comments.

**Parameters:**
- `issueKey`: Issue key (e.g., "ABC-123")

**Example:**
```javascript
const issue = await fetchIssueDetail("ABC-123");
```

**Response:**
```typescript
{
  // Core fields
  issueKey: string;
  summary: string;
  description: string;
  projectKey: string;
  projectName: string;
  issueType: string;
  priority: string;
  status: string;
  statusCategory: string;
  assigneeName: string;
  reporterName: string;
  
  // Additional fields
  severity?: string;
  clientName?: string;
  labels?: Array<string>;
  components?: Array<string>;
  sprint?: string;
  created?: string;
  updated?: string;
  resolved?: string;
  startDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  parentKey?: string;
  parentSummary?: string;
  storyPoints?: number;
  epicName?: string;
  releaseNotes?: string;
  rootCause?: string;
  redmineTrackerId?: string;
  zohoDeskTicket?: string;
  environment?: string;
  issueReason?: string;
  issueIn?: string;
  ocrId?: string;
  fixVersions?: Array<string>;
  
  // Related lists
  attachments?: Array<{
    id: long;
    filename: string;
    uploadedAt: string;
    uploadedBy: string;
    downloadUrl: string;
  }>;
  comments?: Array<{
    userId: string;
    userName: string;
    commentText: string;
    commentDate: string;
  }>;
}
```

---

### 6. **fetchEpicChildren(issueKey: string)**
Retrieves child issues of an epic.

**Parameters:**
- `issueKey`: Epic key (e.g., "ABC-1")

**Example:**
```javascript
const children = await fetchEpicChildren("ABC-1");
```

**Response:**
```typescript
Array<{
  issueKey: string;
  summary: string;
  description: string;
  projectKey: string;
  projectName: string;
  issueType: string;
  priority: string;
  status: string;
  assigneeName: string;
  reporterName: string;
}>
```

---

### 7. **getAttachmentDownloadUrl(attachmentId: long)**
Constructs the download URL for an attachment. Does not make a request.

**Parameters:**
- `attachmentId`: Attachment ID from attachment data

**Example:**
```javascript
const url = getAttachmentDownloadUrl(123);
// Returns: "http://localhost:8080/api/attachments/123/download"
```

**Response:**
```typescript
string // Full download URL
```

---

## Error Handling

All functions throw errors on failure. Wrap calls in try-catch:

```javascript
try {
  const projects = await fetchProjects();
} catch (error) {
  console.error("Failed to load projects:", error.message);
  // Handle error...
}
```

Errors include HTTP status codes and response messages.

---

## Usage Examples

### Filter Issues by Multiple Criteria
```javascript
const issues = await fetchIssues({
  projectKey: "ABC",
  issueType: "Bug",
  prioritySort: "desc",
  page: 1,
  pageSize: 20
});
```

### Search for Issues
```javascript
const issues = await fetchIssues({
  search: "login error",
  page: 1,
  pageSize: 20
});
```

### Get Epic Children
```javascript
const epic = await fetchIssueDetail("ABC-100");
if (epic.issueType === "Epic") {
  const children = await fetchEpicChildren("ABC-100");
}
```

### Download an Attachment
```javascript
const issue = await fetchIssueDetail("ABC-123");
const attachment = issue.attachments[0];
const downloadUrl = getAttachmentDownloadUrl(attachment.id);
// Use in <a href={downloadUrl} download>Download</a>
```

---

## Notes

- All timestamps are in ISO 8601 format (use `formatDate()` utility for display)
- `total` in paginated responses represents total available items
- Priority values: Highest, High, Medium, Low, Lowest
- Status values depend on Jira configuration
