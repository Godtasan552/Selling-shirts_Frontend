export async function post(url: string, body: any) {
  const respoens = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await respoens.json();
  return {
    status: respoens.status,
    ...data
  };
}
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
