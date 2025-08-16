# API Documentation: /api/upload-image

This document provides details about the `/api/upload-image` endpoint.

## POST /api/upload-image

Handles image uploads to Cloudinary. The request should be a `multipart/form-data` request.

### Form Data

- `file`: The image file to upload.
- `folder` (optional, default: `agent-profiles`): The folder in Cloudinary to upload the image to.
- `aspectRatio` (optional, default: `auto`): The desired aspect ratio of the image (`square`, `wide`, or `auto`).
- `maxWidth` (optional, default: `400`): The maximum width of the image.
- `maxHeight` (optional, default: `400`): The maximum height of the image.

### Responses

- **200 OK**: Returns the URL and public ID of the uploaded image.
  - **Content:** `{ "success": true, "url": "string", "publicId": "string" }`
- **400 Bad Request**: If no file is provided, the file type is invalid, or the file is too large.
- **401 Unauthorized**: If the user is not authenticated.
- **500 Internal Server Error**: If Cloudinary is not configured or if there's an error uploading the image.
