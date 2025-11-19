// lib/authApi.ts

// ✅ Define response types
interface ApiResponseData {
  message?: string;
  token?: string;
  [key: string]: unknown; // สำหรับ properties อื่นๆ
}

interface ApiResponse<T = ApiResponseData> {
  status: number;
  data: T;
}

// ✅ POST JSON API with proper typing
export const post = async <T = ApiResponseData>(
  url: string,
  body: Record<string, unknown>
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("POST API Error:", error);
    return {
      status: 500,
      data: { message: "Server Error" } as T,
    };
  }
};

// ✅ GET API using cookies
export async function authGetCookie<T = ApiResponseData>(
  url: string
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();
    return { status: res.status, data } as ApiResponse<T>;
  } catch (error) {
    console.error("GET Cookie API Error:", error);
    return {
      status: 500,
      data: { message: "Server Error" } as T,
    };
  }
}

// ✅ GET API with Bearer Token + fallback cookie/localStorage
export async function authGet<T = ApiResponseData>(
  url: string
): Promise<ApiResponse<T>> {
  let token: string | undefined;

  // 1) พยายามดึง token จาก cookie ก่อน
  try {
    token = document
      .cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];
  } catch (e) {
    // Server component ไม่มี document object
    console.warn("Cannot access document.cookie:", e);
    token = undefined;
  }

  // 2) fallback localStorage
  if (!token) {
    try {
      token = localStorage.getItem("auth_token") || undefined;
    } catch (e) {
      console.warn("Cannot access localStorage:", e);
      token = undefined;
    }
  }

  // 3) สร้าง headers แบบ dynamic
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();
    return { status: res.status, data } as ApiResponse<T>;
  } catch (error) {
    console.error("GET Auth API Error:", error);
    return {
      status: 500,
      data: { message: "Server Error" } as T,
    };
  }
}

// ✅ PUT API with Bearer Token + fallback cookie/localStorage
export async function authPut<T = ApiResponseData>(
  url: string,
  body: Record<string, unknown>
): Promise<ApiResponse<T>> {
  let token: string | undefined;

  // ดึง token
  try {
    token = document
      .cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];
  } catch (e) {
    token = undefined;
  }

  if (!token) {
    try {
      token = localStorage.getItem("auth_token") || undefined;
    } catch {
      token = undefined;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return { status: res.status, data } as ApiResponse<T>;
  } catch (error) {
    console.error("PUT Auth API Error:", error);
    return {
      status: 500,
      data: { message: "Server Error" } as T,
    };
  }
}

// ✅ DELETE API with Bearer Token + fallback cookie/localStorage
export async function authDelete<T = ApiResponseData>(
  url: string
): Promise<ApiResponse<T>> {
  let token: string | undefined;

  // ดึง token
  try {
    token = document
      .cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];
  } catch (e) {
    token = undefined;
  }

  if (!token) {
    try {
      token = localStorage.getItem("auth_token") || undefined;
    } catch {
      token = undefined;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers,
      credentials: "include",
    });

    const data = await res.json();
    return { status: res.status, data } as ApiResponse<T>;
  } catch (error) {
    console.error("DELETE Auth API Error:", error);
    return {
      status: 500,
      data: { message: "Server Error" } as T,
    };
  }
}

// ✅ Export helper types for use in components
export type { ApiResponse, ApiResponseData };