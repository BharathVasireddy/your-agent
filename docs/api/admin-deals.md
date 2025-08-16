# API Documentation: /api/admin/deals

This document provides details about the `/api/admin/deals` endpoint. This endpoint is for administrative use only.

## GET /api/admin/deals

Retrieves a paginated and filtered list of deals.

### Query Parameters

- `q` (optional): Search query to filter deals by title or location.
- `status` (optional): Filter deals by status.
- `page` (optional, default: 1): The page number for pagination.
- `pageSize` (optional, default: 20): The number of deals to return per page.

### Responses

- **200 OK**: Returns a paginated list of deals.
- **401 Unauthorized**: If the user is not an administrator.

## POST /api/admin/deals

Creates a new deal.

### Request Body

A JSON object representing the deal to be created. The exact structure is complex and includes many optional fields. Refer to the `POST` function in `src/app/api/admin/deals/route.ts` for details.

### Responses

- **200 OK**: Returns the newly created deal.
- **401 Unauthorized**: If the user is not an administrator.

## PUT /api/admin/deals

Updates an existing deal.

### Request Body

A JSON object containing the `id` of the deal to update and the fields to be updated.

### Responses

- **200 OK**: Returns the updated deal.
- **400 Bad Request**: If the `id` is missing from the request body.
- **401 Unauthorized**: If the user is not an administrator.

## DELETE /api/admin/deals

Deletes a deal (soft delete).

### Query Parameters

- `id`: The ID of the deal to delete.

### Responses

- **200 OK**: Returns `{ "success": true }`.
- **400 Bad Request**: If the `id` is missing from the query parameters.
- **401 Unauthorized**: If the user is not an administrator.
