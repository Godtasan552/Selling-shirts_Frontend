export const post = async (url: string, body: any) => {
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
      data, // { message: "...", token: "..." }
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: "Server Error" },
    };
  }
};
export async function authGetCookie(url: string) {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include", // ใช้ cookie เท่านั้น
    cache: "no-store",
  });

  const data = await res.json();
  return { status: res.status, ...data };
}
 
export async function authGet(url: string) {
  // 1) พยายามดึง token จาก cookie ก่อน
  let token =
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

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
    credentials: "include", // แนะนำให้ใส่ เพื่อรองรับ cookie-based auth
    cache: "no-store",
  });

  const data = await res.json();
  return { status: res.status, ...data };
}
