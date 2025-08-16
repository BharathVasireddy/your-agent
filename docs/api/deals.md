# API Documentation: /api/deals

This document provides details about the `/api/deals` endpoint.

## GET /api/deals

Retrieves a paginated list of deals that are visible to the authenticated agent based on targeting rules.

### Query Parameters

- `page` (optional, default: 1): The page number for pagination.
- `pageSize` (optional, default: 12): The number of deals to return per page.

### Responses

- **200 OK**: Returns a paginated list of deals.
- **401 Unauthorized**: If the user is not authenticated.
- **404 Not Found**: If the agent profile is not found.
