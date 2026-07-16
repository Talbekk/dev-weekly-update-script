import { isAxiosError } from "axios";

export const handleApiError = (error: unknown): never => {
  if (isAxiosError(error)) {
    if (error.response) {
      console.error("❌ API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("❌ Network Error: No response received from Shortcut API");
    }
  } else if (error instanceof Error) {
    console.error("❌ Error:", error.message);
  }
  throw error;
};
