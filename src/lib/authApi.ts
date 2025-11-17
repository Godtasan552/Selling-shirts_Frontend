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

export async function authGet(url: string) {
  const token = document.cookie
    .split("; ")
    .find((c) => c.startsWith("auth_token="))
    ?.split("=")[1];

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  return { status: res.status, ...data };
}
