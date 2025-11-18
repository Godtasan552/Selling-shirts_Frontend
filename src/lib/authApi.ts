
// --------------------------
// POST JSON API
// --------------------------
export const post = async <
  TBody extends Record<string, unknown>,
  TResponse extends Record<string, unknown> = Record<string, unknown>
>(
  url: string,
  body: TBody
): Promise<{ status: number; data: TResponse }> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = (await response.json()) as TResponse;
    return { status: response.status, data };
  } catch {
    // ✅ cast ผ่าน unknown ก่อน แล้วค่อยเป็น TResponse
    return {
      status: 500,
      data: { message: "Server Error" } as unknown as TResponse,
    };
  }
};


// --------------------------
// GET API แบบใช้ cookie
// --------------------------
export async function authGetCookie<
  TResponse extends Record<string, unknown> = Record<string, unknown>
>(url: string): Promise<{ status: number } & TResponse> {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const data = (await res.json()) as TResponse;
  return { status: res.status, ...data };
}

// --------------------------
// GET API แบบ Bearer Token + fallback cookie/localStorage
// --------------------------
export async function authGet<
  TResponse extends Record<string, unknown> = Record<string, unknown>
>(url: string): Promise<{ status: number } & TResponse> {
  // หา token จาก cookie
  let token =
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

  // fallback localStorage
  if (!token) {
    try {
      token = localStorage.getItem("auth_token") || undefined;
    } catch {
      token = undefined;
    }
  }

  // headers dynamic
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const data = (await res.json()) as TResponse;
  return { status: res.status, ...data };
}
