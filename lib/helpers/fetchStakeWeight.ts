export async function fetchStakeWeight<T>(
  url: string,
  options: RequestInit,
  retries = 3,
  backoff = 300
): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, backoff));
    return fetchStakeWeight<T>(url, options, retries - 1, backoff * 2);
  }
}
