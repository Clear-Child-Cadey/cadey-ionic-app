const fetchWithTimeout = async (
  url: string,

  opts: RequestInit = {},
  timeout: null | number = null,
): Promise<Response> => {
  const effectiveTimeout = timeout === null ? 10000 : timeout;

  let controller: AbortController | undefined;
  let signal: AbortSignal | undefined;

  if (effectiveTimeout !== null) {
    controller = new AbortController();
    signal = controller.signal;
    setTimeout(() => {
      if (controller) {
        controller.abort();
      }
    }, effectiveTimeout);
  }

  try {
    const response = await fetch(url, { ...opts, signal });
    return response;
  } catch (error) {
    const e = error as Error; // Type assertion to Error
    if (e?.name === "AbortError") {
      throw new Error("Request timed out");
    } else {
      throw error;
    }
  }
};

export default fetchWithTimeout;
