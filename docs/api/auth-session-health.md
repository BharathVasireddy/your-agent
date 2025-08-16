# API Documentation: /api/auth/session-health

This document provides details about the `/api/auth/session-health` endpoint.

## GET /api/auth/session-health

Checks if the user's session is valid and returns the user flow status.

### Responses

- **200 OK**: Returns a JSON object with `valid: true` and the user flow status if the session is valid.
- **200 OK**: Returns a JSON object with `valid: false` if the session is not valid.
