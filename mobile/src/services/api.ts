const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro inesperado." }));
    throw new Error(error.message ?? "Erro inesperado.");
  }

  return response.json() as Promise<T>;
}
