# API Documentation: /api/dashboard-data

This document provides details about the `/api/dashboard-data` endpoint.

## GET /api/dashboard-data

Retrieves data for the agent's dashboard.

### Responses

- **200 OK**: Returns a JSON object with the agent's profile, properties, and property counts.
- **401 Unauthorized**: If the user is not authenticated.
- **500 Internal Server Error**: If an unexpected error occurs.
