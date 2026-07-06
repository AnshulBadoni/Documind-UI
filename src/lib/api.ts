// Client-side API wrapper to communicate with the FastAPI backend

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:8000`;
  }
  return "http://localhost:8000";
}

function getHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiRequest<T = any>(
  path: string,
  options?: RequestInit
): Promise<{ status: number; message: string; data?: T; detail?: string }> {
  const url = `${getApiBaseUrl()}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options?.headers || {}),
    },
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      // Only redirect if we are not already on the login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }

  const json = await response.json();
  return json;
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}

export async function regenerateDocument(projectId: number | string, documentType: string, accessToken?: string) {
  const query = accessToken ? `?access_token=${encodeURIComponent(accessToken)}` : "";
  return apiRequest(`/projects/${projectId}/documents/${documentType}/regenerate${query}`, {
    method: "POST",
  });
}

export async function deleteChatSession(sessionId: string) {
  return apiRequest(`/chat/sessions/${sessionId}`, {
    method: "DELETE",
  });
}

export async function deleteChatMessage(messageId: number) {
  return apiRequest(`/chat/messages/${messageId}`, {
    method: "DELETE",
  });
}
