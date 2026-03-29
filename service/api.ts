const DEFAULT_API_URL = "https://fakestoreapi.com";

export function getBaseApiUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  return envUrl && envUrl.length > 0 ? envUrl : DEFAULT_API_URL;
}

export function buildUrl(endpoint: string) {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  const baseUrl = getBaseApiUrl().replace(/\/$/, "");
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${baseUrl}${normalizedEndpoint}`;
}

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const response = await fetch(buildUrl(endpoint), {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    let errorDetail = response.statusText;

    try {
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const errorBody = await response.json();
        if (typeof errorBody?.message === "string") {
          errorDetail = errorBody.message;
        } else if (typeof errorBody?.error === "string") {
          errorDetail = errorBody.error;
        } else {
          errorDetail = JSON.stringify(errorBody);
        }
      } else {
        const textError = await response.text();
        if (textError.trim()) {
          errorDetail = textError;
        }
      }
    } catch {
      // Si no se puede parsear el body, usamos statusText.
    }

    throw new Error(`Error ${response.status}: ${errorDetail}`);
  }

  return response.json();
}
