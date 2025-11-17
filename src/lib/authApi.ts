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
