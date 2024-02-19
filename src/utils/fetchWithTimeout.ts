import { logErrorToFirestore } from "../api/Firebase/LogErrorToFirestore";

interface FetchWithTimeoutOptions {
  timeout?: number;
  cadeyUserId?: number | string;
  requestName?: string;
  currentUrl?: string;
}

const fetchWithTimeout = async (
  url: string,
  opts: RequestInit = {},
  context: FetchWithTimeoutOptions = {}, // Default to an empty object if context is not provided
): Promise<Response> => {
  const { timeout = 6500, cadeyUserId, requestName = "Not Provided" } = context; // Default timeout to if not provided
  let { currentUrl } = context;
  if (!currentUrl) {
    // set to current window URL
    currentUrl = window.location.href;
  }
  let controller: AbortController | undefined = new AbortController();
  setTimeout(() => {
    if (controller) {
      controller.abort();
    }
  }, timeout);

  try {
    const response = await fetch(url, { ...opts, signal: controller.signal });
    return response;
  } catch (error) {
    const e = error as Error; // Type assertion to Error
    if (e.name === "AbortError") {
      logErrorToFirestore({
        url: currentUrl,
        userID: cadeyUserId || "Not Provided", // Use a default or ensure cadeyUserId is provided
        error: `Request took longer than ${timeout} milliseconds`,
        request: requestName,
        context: "Fetching App Data",
      });
      throw new Error("Request timed out");
    } else {
      throw error;
    }
  }
};

export default fetchWithTimeout;
