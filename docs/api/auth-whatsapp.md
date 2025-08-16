# API Documentation: /api/auth/whatsapp

This document provides details about the WhatsApp authentication endpoints.

## GET /api/auth/whatsapp/debug-template

A debug route to fetch and inspect WhatsApp message templates.

### Query Parameters

- `wabaId` (optional): The WhatsApp Business Account ID.
- `name` (optional): The name of the template to inspect.

### Responses

- **200 OK**: Returns information about the message templates.
- **400 Bad Request**: If `wabaId` or `token` are missing.
- **500 Internal Server Error**: If there's an error fetching the template.
- **502 Bad Gateway**: If there's an error from the Graph API.

## POST /api/auth/whatsapp/send-otp

Sends a one-time password (OTP) to a phone number via WhatsApp.

### Request Body

```json
{
  "phone": "string"
}
```

### Responses

- **200 OK**: Returns `{ "success": true }`.
- **400 Bad Request**: If the `phone` is missing from the request body.
- **500 Internal Server Error**: If WhatsApp credentials are not configured or if there's an error sending the OTP.
- **502 Bad Gateway**: If the WhatsApp API returns an error.

## POST /api/auth/whatsapp/verify

Verifies the OTP and either creates a new user or links the phone number to an existing user.

### Request Body

```json
{
  "phone": "string",
  "code": "string"
}
```

### Responses

- **200 OK**: Returns a JSON object with information about the user and the verification status.
- **400 Bad Request**: If `phone` or `code` are missing, or if the code is invalid or expired.
- **409 Conflict**: If the phone number is already linked to another account.
- **500 Internal Server Error**: If there's an error verifying the OTP.
