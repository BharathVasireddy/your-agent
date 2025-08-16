# API Documentation: /api/admin/properties

This document provides details about the `/api/admin/properties` endpoint. This endpoint is for administrative use only.

## GET /api/admin/properties

Retrieves a paginated and filtered list of properties.

### Query Parameters

- `q` (optional): Search query to filter properties by title, location, or agent slug.
- `status` (optional): Filter properties by status.
- `listingType` (optional): Filter properties by listing type.
- `page` (optional, default: 1): The page number for pagination.
- `pageSize` (optional, default: 20): The number of properties to return per page.

### Responses

- **200 OK**: Returns a paginated list of properties.
- **401 Unauthorized**: If the user is not an administrator.
