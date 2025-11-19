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

// ✅ Define types for post function
export const post = async <T = ApiResponseData>(
  url: string,
  body: Record<string, unknown>
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return {
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: "Server Error" } as T,
    };
  }
};

// ✅ Define types for authGetCookie
export async function authGetCookie<T = ApiResponseData>(
  url: string
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const data = await res.json();
  return { status: res.status, data } as ApiResponse<T>;
}

// ✅ Define types for authGet
export async function authGet<T = ApiResponseData>(
  url: string
): Promise<ApiResponse<T>> {
  // 1) พยายามดึง token จาก cookie ก่อน
  let token: string | undefined;
  
  try {
    token = document
      .cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];
  } catch (e) {
    // Server component ไม่มี document object
    token = undefined;
  }

  // 2) ถ้าไม่มีใน cookie → fallback ไป localStorage
  if (!token) {
    try {
      token = localStorage.getItem("auth_token") || undefined;
    } catch (e) {
      // เผื่อมีหน้า server component เรียก → localStorage error
      token = undefined;
    }
  }

  // 3) สร้าง header ให้แบบ dynamic (ถ้าไม่มี token ก็ไม่ส่ง)
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const data = await res.json();
  return { status: res.status, data } as ApiResponse<T>;
}

// ✅ Optional: Export helper types for use in components
export type { ApiResponse, ApiResponseData };