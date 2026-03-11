/// <reference types="vite/client" />
import { projectId, publicAnonKey } from "../../utils/supabase/info";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("admin_token", token);
  } else {
    localStorage.removeItem("admin_token");
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem("admin_token");
  }
  return authToken;
}

/**
 * Improved generic Fetch for TypeScript:
 * - sets Content-Type only when not sending FormData
 * - attaches Authorization for protected routes/uploads
 * - handles non-JSON responses gracefully by falling back to text()
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  // Flexible headers object
  const headers: Record<string, string> = {};

  // Add Content-Type only when not sending FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Merge user provided headers
  if (options.headers) {
    Object.assign(headers, options.headers as Record<string, string>);
  }

  // Attach Authorization when needed
  if (token) {
    const isProtectedProduct = endpoint.includes("/products") && options.method !== "GET";
    const isUpload = endpoint.includes("/upload-image");

    if (isProtectedProduct || isUpload) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Read as text first and try to parse as JSON; fallback to text for non-JSON responses
    const text = await response.text();

    if (!response.ok) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { error: text || `HTTP ${response.status}` };
      }
      throw new Error(parsed.error || `HTTP ${response.status}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ========== ADMIN AUTH ==========

export async function checkAdminExists() {
  const data = await fetchAPI("/admin/check", { method: "GET" });
  return data.exists;
}

export async function signupAdmin(email: string, password: string, name: string) {
  return await fetchAPI("/admin/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export async function loginAdmin(email: string, password: string) {
  const data = await fetchAPI("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.access_token);
  return data;
}

export function logoutAdmin() {
  setAuthToken(null);
}

// ========== PRODUCTS CRUD ==========

export async function getProducts() {
  const data = await fetchAPI("/products", { method: "GET" });
  return data.products || [];
}

export async function getProduct(id: string) {
  const data = await fetchAPI(`/products/${id}`, { method: "GET" });
  return data.product;
}

export async function createProduct(productData: any) {
  const data = await fetchAPI("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
  return data.product;
}

export async function updateProduct(id: string, updates: any) {
  const data = await fetchAPI(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.product;
}

export async function deleteProduct(id: string) {
  return await fetchAPI(`/products/${id}`, { method: "DELETE" });
}

// ✅ Upload d'image synchronisé avec le backend Node
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file); // Clé "file" attendue par ton index.js

  const data = await fetchAPI("/upload-image", {
    method: "POST",
    body: formData,
  });

  return data.url;
}
export async function getAdmins() {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/admin/list`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch admins' }));
    throw new Error(error.error || 'Failed to fetch admins');
  }

  const data = await response.json();
  return data.admins;
}

export async function addAdmin(email: string, password: string, name: string) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/admin/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to add admin' }));
    throw new Error(error.error || 'Failed to add admin');
  }

  const data = await response.json();
  return data.admin;
}

export async function deleteAdmin(adminId: string) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/admin/${adminId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to delete admin' }));
    throw new Error(error.error || 'Failed to delete admin');
  }

  return await response.json();
}