import axios, { AxiosError } from 'axios';
import { TMDB_API_BASE_URL } from '@/constants/api';
const TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;

if (!TOKEN) {
  throw new Error(
    'TMDB API token is not defined. Please check your .env file and ensure NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN is set.'
  );
}

const http = axios.create({
  baseURL: TMDB_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export class TMDBError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'TMDBError';
  }
}

// Add response interceptor for error handling
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      throw new TMDBError(
        error.response.status,
        `TMDB API error: ${error.response.status} ${error.response.statusText}`
      );
    }
    throw error;
  }
);

export default http;
