const BASE_URL =
  "http://localhost:5000/api";

export const apiFetch = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...(token && {
          Authorization: `Bearer ${token}`,
        }),

        ...options?.headers,
      },
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong"
    );
  }

  return data;
};