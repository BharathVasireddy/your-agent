import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cloudinary URL helper: add format/quality/size transforms safely
export function withCloudinaryTransforms(url: string, transforms: string) {
  try {
    if (!url.includes('res.cloudinary.com')) return url;
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    const prefix = parts[0];
    const rest = parts[1];
    // Avoid duplicating transforms
    if (rest.startsWith(transforms)) return url;
    return `${prefix}/upload/${transforms}/${rest}`;
  } catch {
    return url;
  }
}
