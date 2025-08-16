# API Documentation: /api/remember-plan

This document provides details about the `/api/remember-plan` endpoint.

## GET /api/remember-plan

Remembers the user's selected subscription plan by setting a cookie and then redirects them to the `/subscribe` page.

### Query Parameters

- `plan` (optional): The selected plan.
- `interval` (optional): The selected billing interval.

### Responses

- **302 Found**: Redirects the user to the `/subscribe` page.
