function post<T>(tableName: string, body: T[]) {
  const apiKey = Deno.env.get("SUPABASE_SERVICE_KEY").trim();
  return fetch(`${Deno.env.get("SUPABASE_API_HOST")}/rest/v1/${tableName}`, {
    method: "POST",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export default {
  post,
};
