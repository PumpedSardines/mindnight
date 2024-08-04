export const NAME_MIN_LENGTH = 3;
export const NAME_MAX_LENGTH = 10;

export const API_URL = import.meta.env.DEV
  ? "http://localhost:3000/api"
  : "/api";
export const SOCKET_API_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : null;
export const WEBSITE_URL = "http://localhost:5173";
