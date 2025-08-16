# API Documentation: /api/subscription/entitlements

This document provides details about the `/api/subscription/entitlements` endpoint.

## GET /api/subscription/entitleaments

Retrieves the user's subscription plan and entitlements.

### Responses

- **200 OK**: Returns a JSON object with the user's plan, subscription status, and entitlements.
  - **Content:** `{ "plan": "string", "active": "boolean", "entitlements": "object" }`
- **200 OK (on error)**: Returns the default "starter" plan entitlements.
