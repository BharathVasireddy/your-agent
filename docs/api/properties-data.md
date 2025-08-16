# API Documentation: /api/properties-data

This document provides details about the `/api/properties-data` endpoint.

## GET /api/properties-data

Retrieves all properties for the authenticated agent, grouped by listing type (`Sale` and `Rent`).

### Responses

- **200 OK**: Returns a JSON object with `saleProperties` and `rentProperties` arrays.
- **401 Unauthorized**: If the user is not authenticated.
- **500 Internal Server Error**: If an unexpected error occurs.
