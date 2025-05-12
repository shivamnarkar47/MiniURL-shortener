import axios from "axios"

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

export interface ShortenResponse {
  original_url: string,
  short_code: string,
  created_at?: string
}

export const shortenUrl = async (url: string): Promise<ShortenResponse> => {
  const response = await axios.post(`${API_BASE_URL}/shorten`, {
    original_url: url
  })

  return response.data
}

export const getRecentUrls = async (): Promise<ShortenResponse[]> => {
  const response = await axios.get(`${API_BASE_URL}/recent`)
  return response.data
}
