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

export function getHostInfo(host?: string | null) {
  const primaryDomain = process.env.PRIMARY_DOMAIN || 'youragent.cloud9digital.in'
  const hostname = (host || '').split(':')[0]
  const isPrimary = hostname === primaryDomain || hostname.endsWith(`.${primaryDomain}`)
  const parts = isPrimary ? hostname.replace(`.${primaryDomain}`, '').split('.') : hostname.split('.')
  const subdomain = isPrimary ? (parts[0] || '') : ''
  return { hostname, primaryDomain, subdomain }
}
