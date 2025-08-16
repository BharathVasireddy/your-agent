# API Documentation: /api/admin/agents

This document provides details about the `/api/admin/agents` endpoint. This endpoint is for administrative use only.

## GET /api/admin/agents

Retrieves a paginated and filtered list of agents.

### Query Parameters

- `q` (optional): Search query to filter agents by slug, email, or city.
- `city` (optional): Filter agents by city.
- `subscribed` (optional): Filter agents by subscription status (`true` or `false`).
- `page` (optional, default: 1): The page number for pagination.
- `pageSize` (optional, default: 20): The number of agents to return per page.

### Responses

- **200 OK**: Returns a paginated list of agents.
  - **Content:**
    ```json
    {
      "total": "number",
      "page": "number",
      "pageSize": "number",
      "items": [
        {
          "id": "string",
          "slug": "string",
          "city": "string",
          "area": "string",
          "isSubscribed": "boolean",
          "createdAt": "string",
          "user": {
            "email": "string",
            "id": "string"
          },
          "_count": {
            "properties": "number",
            "leads": "number"
          }
        }
      ]
    }
    ```
- **401 Unauthorized**: If the user is not an administrator.
