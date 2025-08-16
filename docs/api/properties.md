# API Documentation: /api/properties

This document provides details about the `/api/properties` endpoint.

## GET /api/properties

Retrieves a list of properties for the authenticated agent. Can also be used to get a count of properties.

### Query Parameters

- `count` (optional): If set to `1`, returns the count of properties, the agent's plan, and the listing limit.

### Responses

- **200 OK**: Returns a list of properties or the count information.
  - **Content (if `count` is not `1`):** `{ "count": number }`
  - **Content (if `count` is `1`):** `{ "count": number, "plan": string, "limit": number }`
- **401 Unauthorized**: If the user is not authenticated.
- **404 Not Found**: If the agent profile is not found.
- **500 Internal Server Error**: If there's an error fetching properties.

## POST /api/properties

Creates a new property for the authenticated agent.

### Request Body

The request body should be a JSON object with the following structure (`BasePropertyFormData`):

```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "location": "string",
  "amenities": ["string"],
  "photos": ["string"],
  "status": "string",
  "listingType": "Sale" | "Rent",
  "propertyType": "string",
  "slug": "string" (optional),
  "brochureUrl": "string" (optional),
  "agriculturalLandData": "object" (optional),
  "plotData": "object" (optional),
  "flatApartmentData": "object" (optional),
  "villaIndependentHouseData": "object" (optional),
  "itCommercialSpaceData": "object" (optional),
  "farmHouseData": "object" (optional)
}
```

For detailed information about the `...Data` objects, refer to the `src/types/property.ts` file.

### Responses

- **200 OK**: Returns the newly created property's ID, slug, and title.
  - **Content:** `{ "success": true, "property": { "id": "string", "slug": "string", "title": "string" } }`
- **401 Unauthorized**: If the user is not authenticated.
- **403 Forbidden**: If the user's subscription plan does not allow creating more properties.
- **404 Not Found**: If the agent profile is not found.
- **500 Internal Server Error**: If there's an error creating the property.
