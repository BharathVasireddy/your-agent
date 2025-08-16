# API Documentation: /api/admin/kpis

This document provides details about the `/api/admin/kpis` endpoint. This endpoint is for administrative use only.

## GET /api/admin/kpis

Retrieves key performance indicators (KPIs) for the admin dashboard.

### Responses

- **200 OK**: Returns a JSON object with the following KPIs:
  - `usersCount`: Total number of users.
  - `agentsCount`: Total number of agents.
  - `propertiesCount`: Total number of properties.
  - `paymentsLast30Days`: Number of payments in the last 30 days.
- **401 Unauthorized**: If the user is not an administrator.
