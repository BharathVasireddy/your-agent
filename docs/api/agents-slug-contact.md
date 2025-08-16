# API Documentation: /api/agents/{slug}/contact

This document provides details about the `/api/agents/{slug}/contact` endpoint.

## POST /api/agents/{slug}/contact

Handles contact form submissions for an agent. It creates a new lead, sends an email notification to the agent, and sends an acknowledgment email to the sender.

### Path Parameters

- `slug`: The slug of the agent.

### Request Body

A JSON object with the following fields:

- `name`: The name of the person submitting the form.
- `email`: The email address of the person submitting the form.
- `phone` (optional): The phone number of the person submitting the form.
- `subject` (optional): The subject of the message.
- `message`: The message content.
- `propertySlug` (optional): The slug of the property the inquiry is about.
- `source` (optional): The source of the lead (e.g., `contact-form`).

### Responses

- **200 OK**: Returns `{ "success": true }`.
- **400 Bad Request**: If the request body is invalid or missing required fields.
- **404 Not Found**: If the agent is not found.
- **500 Internal Server Error**: If an unexpected error occurs.
