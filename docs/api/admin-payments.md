# API Documentation: /api/admin/payments

This document provides details about the `/api/admin/payments` endpoint. This endpoint is for administrative use only.

## GET /api/admin/payments

Retrieves a paginated and filtered list of payments.

### Query Parameters

- `status` (optional): Filter payments by status.
- `type` (optional): Filter payments by type.
- `page` (optional, default: 1): The page number for pagination.
- `pageSize` (optional, default: 20): The number of payments to return per page.

### Responses

- **200 OK**: Returns a paginated list of payments.
- **401 Unauthorized**: If the user is not an administrator.
