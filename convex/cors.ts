export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function cors(body: any, status: number = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

export function corsText(text: string, status: number = 200): Response {
  return new Response(text, {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "text/plain;charset=UTF-8" },
  });
}
