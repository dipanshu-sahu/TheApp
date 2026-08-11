/** Shape of an Axios-style error response body */
type AxiosErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

/**
 * Extracts a human-readable message from an unknown thrown value.
 *
 * Priority order:
 *  1. `error.response.data.message` (Axios API error with a structured body)
 *  2. `error.message` (any `Error` instance)
 *  3. `fallback` (provided default)
 */
export const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const message = (error as AxiosErrorShape).response?.data?.message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
