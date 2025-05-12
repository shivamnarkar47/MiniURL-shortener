import { API_BASE_URL } from "@/api/urlShortner"
import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
}

export function getShortUrl(shortCode: string): string {
  return `${API_BASE_URL}/${shortCode}`
}
