import { AxiosError } from "axios";
import { ZodError } from "zod";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  details?: string;
}

/**
 * Parse API errors into user-friendly messages
 */
export function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined;

    // Check for duplicate/conflict messages
    const errorMessage = response?.message || response?.error || response?.details || "";
    const lowerMessage = errorMessage.toLowerCase();
    
    // Preserve specific location conflict messages (they contain the location name)
    if (lowerMessage.includes("already booked")) {
      return errorMessage;
    }
    
    if (
      lowerMessage.includes("duplicate") ||
      lowerMessage.includes("already exists") ||
      lowerMessage.includes("conflict") ||
      error.response?.status === 409
    ) {
      // Return the original message if it exists, otherwise use generic
      return errorMessage || "A schedule already exists for these teams at this time.";
    }

    // Return API message if available
    if (errorMessage) {
      return errorMessage;
    }

    // Handle different HTTP status codes
    switch (error.response?.status) {
      case 400:
        return "Invalid input data. Please check all fields and try again.";
      case 401:
        return "You are not authorized. Please log in and try again.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 422:
        return "Validation failed. Please check your input and try again.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
      case 503:
        return "Service temporarily unavailable. Please try again later.";
      case 504:
        return "Request timeout. Please check your connection and try again.";
      default:
        break;
    }

    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      return "Network error. Please check your internet connection and try again.";
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return "Request timeout. Please try again.";
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof ZodError) {
    const firstError = error.issues[0];
    return firstError?.message || "Validation error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Extract validation errors from Zod errors
 */
export function getValidationErrors(error: unknown): Record<string, string> {
  if (error instanceof ZodError) {
    const errors: Record<string, string> = {};
    error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      errors[path] = issue.message;
    });
    return errors;
  }
  return {};
}