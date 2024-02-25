import { logErrorToFirestore } from "../api/Firebase/LogErrorToFirestore";
import AppMeta from "../variables/AppMeta";
import store from "../store";
import { setHttpError } from "../features/error/slice";

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
  const {
    timeout = AppMeta?.fetchTimeout || 6500,
    cadeyUserId,
    requestName = "Not Provided",
  } = context; // Default timeout to if not provided
  let { currentUrl } = context;
  if (!currentUrl) {
    // set to current window URL
    currentUrl = window.location.href;
  }
  if (AppMeta.fetchTimeout < 0) {
    try {
      const response = await fetch(url, opts);
      return response;
    } catch (error) {
      store.dispatch(setHttpError(true));
      throw error; // Rethrow the error for the caller to handle
    }
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
      store.dispatch(setHttpError(true));
      throw new Error("Request timed out");
    } else {
      throw error;
    }
  }
};

export default fetchWithTimeout;
