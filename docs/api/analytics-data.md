# API Documentation: /api/analytics-data

This document provides details about the `/api/analytics-data` endpoint.

## GET /api/analytics-data

Retrieves analytics data for the authenticated agent.

### Responses

- **200 OK**: Returns a JSON object with analytics data.
- **401 Unauthorized**: If the user is not authenticated.
- **404 Not Found**: If the agent profile is not found.
- **500 Internal Server Error**: If an unexpected error occurs.
