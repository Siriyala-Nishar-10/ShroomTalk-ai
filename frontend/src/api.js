const BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export function getToken() {
  return localStorage.getItem("shroomtalk_token");
}

export function setToken(token) {
  if (token) localStorage.setItem("shroomtalk_token", token);
  else localStorage.removeItem("shroomtalk_token");
}

function formatDetail(detail) {
  if (!detail) return "";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg || item.message || JSON.stringify(item))
      .join("; ");
  }
  return String(detail);
}

export async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE}/api/v1${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const error = new Error("offline");
    error.code = "offline";
    throw error;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401 && token) {
    setToken(null);
    window.dispatchEvent(new Event("shroomtalk-auth-lost"));
  }

  if (!response.ok) {
    const error = new Error(
      formatDetail(data?.detail) || `Request failed (${response.status})`,
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  health: () => request("/health"),
  register: (body) => request("/auth/register", { method: "POST", body }),
  login: (body) => request("/auth/login", { method: "POST", body }),
  me: () => request("/auth/me"),
  getProfile: () => request("/profile"),
  saveProfile: (body) => request("/profile", { method: "PUT", body }),
  schemes: (q, lang) =>
    request(`/schemes?q=${encodeURIComponent(q || "")}&lang=${lang}`),
  loan: (body) => request("/calculations/loan", { method: "POST", body }),
  cultivation: (body) =>
    request("/calculations/cultivation", { method: "POST", body }),
  business: (body) =>
    request("/calculations/business", { method: "POST", body }),
  calcHistory: () => request("/calculations/history"),
  chat: (body) => request("/chat", { method: "POST", body }),
  chatHistory: () => request("/chat/history"),
};
