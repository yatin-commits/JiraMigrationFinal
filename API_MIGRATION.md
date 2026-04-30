# API Migration Guide

## Overview
The Jira Historical UI has been migrated from CSV data sources to backend API endpoints. This document outlines the changes made and configuration needed.

## Configuration

### Environment Variables
Set your backend API URL in `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**Note:** Change `http://localhost:8080` to your actual backend server address for production.

## Architecture Changes

### Before (CSV-based)
- Data loaded from CSV files (`Jira-Dump.csv`, `Jira-User-Data.csv`)
- Client-side filtering and pagination
- All data loaded upfront

### After (API-based)
- Data fetched from REST API endpoints
- Server-side pagination and filtering
- Dynamic data fetching based on user filters
- Better performance and scalability

## Modified Files

### 1. **UserContext.jsx** - Data Loading
**Changes:**
- Removed CSV parsing logic
- Now fetches `projects` and `issueTypes` from API on mount
- Removed user data mapping (userData)

**API Calls:**
- `GET /api/projects` - Gets all projects
- `GET /api/issue-types` - Gets all issue types

### 2. **ProjectIssuesPage.jsx** - Issues Listing
**Changes:**
- Replaced client-side filtering with server-side filtering
- Added API call in useEffect that triggers on filter changes
- Pagination handled by backend
- Removed CSV utilities imports

**API Call:**
- `GET /api/issues` - Gets paginated, filtered issues based on:
  - `projectKey` - Filter by project
  - `issueType` - Filter by issue type
  - `search` - Search in multiple fields
  - `prioritySort` - Sort by priority (asc/desc)
  - `page` - Current page (1-indexed)
  - `pageSize` - Items per page

### 3. **IssueDetails.jsx** - Issue Detail Page
**Changes:**
- Now fetches issue details from API instead of receiving via navigation state
- Uses `issueKey` from URL params to fetch data

**API Call:**
- `GET /api/issues/{issueKey}` - Gets complete issue details with attachments and comments

### 4. **Table.jsx** - Issue List Table
**Changes:**
- Removed passing `issueData` via navigation state
- Simplified navigation to just pass issue key

### 5. **Attachments.jsx** - File Attachments
**Changes:**
- Updated to use API field names: `id`, `filename`, `uploadedBy`, `uploadedAt`, `downloadUrl`
- Removed `userData` context dependency
- Direct download URL from API

**API Endpoint:**
- `GET /api/attachments/{id}/download` - Download attachment file

### 6. **Comments.jsx** - Issue Comments
**Changes:**
- Updated to use API field names: `userName`, `commentDate`, `commentText`
- Removed `userData` context dependency
- Direct access to user names from API

### 7. **KeyDetails.jsx** - Issue Description
**Changes:**
- Removed `userData` context dependency
- `parseJiraMarkup` now optional with userData

### 8. **parseJiraMarkup.jsx** - Markup Parser
**Changes:**
- Made `userData` parameter optional with default `null`
- Handles cases where user mention resolution isn't available

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/projects` | GET | List all projects |
| `/api/issue-types` | GET | List all issue types |
| `/api/issue-keys` | GET | Autocomplete issue keys |
| `/api/issues` | GET | List issues (paginated, filtered) |
| `/api/issues/{issueKey}` | GET | Get issue details |
| `/api/attachments/{id}/download` | GET | Download attachment |

## Data Flow

### Initial Load
1. App mounts → UserProvider loads projects and issue types
2. These are available via UserContext

### Issues List
1. User searches or applies filters
2. ProjectIssuesPage triggers API call with filter params
3. API returns paginated results
4. Table displays results
5. User clicks pagination → new API call

### Issue Details
1. User clicks issue key in table
2. Navigate to `/issue/:key`
3. IssueDetails component fetches full details from API
4. Displays with related attachments and comments

## Configuration Requirements

### Backend API Requirements
- CORS enabled (supports `*` origin based on spec)
- All endpoints return proper HTTP status codes
- Pagination with `page` (1-indexed) and `pageSize` parameters
- Filters applied server-side

### Frontend Setup
1. Update `.env` with correct API base URL
2. Ensure backend server is running
3. Start dev server: `npm run dev`

## Testing Checklist

- [ ] Projects load in filter dropdown
- [ ] Issue types load in filter dropdown
- [ ] Search/filter triggers API call
- [ ] Pagination works correctly
- [ ] Issue detail page loads with correct data
- [ ] Attachments display with correct download URL
- [ ] Comments render with correct user names and dates
- [ ] Error states display appropriately

## Notes

- CSV files in `public/` are no longer used
- User data mapping utilities (`userIdMapper.js`, CSV parsing) are deprecated but kept for reference
- All data now comes from the backend API
- Network requests will show in browser DevTools Network tab for debugging
