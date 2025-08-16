# API Documentation: /api/admin/users

This document provides details about the `/api/admin/users` endpoint. This endpoint is for administrative use only.

## GET /api/admin/users

Retrieves a paginated and filtered list of users.

### Query Parameters

- `q` (optional): Search query to filter users by email or name.
- `status` (optional): Filter users by status (`active` or `suspended`).
- `page` (optional, default: 1): The page number for pagination.
- `pageSize` (optional, default: 20): The number of users to return per page.

### Responses

- **200 OK**: Returns a paginated list of users.
- **401 Unauthorized**: If the user is not an administrator.
- **500 Internal Server Error**: If an unexpected error occurs.
