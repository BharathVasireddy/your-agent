# API Documentation: /api/check-slug

This document provides details about the `/api/check-slug` endpoint.

## POST /api/check-slug

Checks if a given slug is available for an agent's profile.

### Request Body

```json
{
  "slug": "string"
}
```

### Responses

- **200 OK**: Returns a JSON object with the availability status, the cleaned slug, and a message.
  - **Content (if available):** `{ "available": true, "slug": "string", "message": "Slug is available" }`
  - **Content (if not available):** `{ "available": false, "slug": "string", "message": "This URL is already taken. Please try another one." }`
  - **Content (if invalid):** `{ "available": false, "slug": "string", "message": "..." }`
- **400 Bad Request**: If the `slug` is missing from the request body.
- **401 Unauthorized**: If the user is not authenticated.
- **500 Internal Server Error**: If there's an error checking the slug.
