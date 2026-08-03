export async function validateSession(setStatus) {
  const url = `${import.meta.env.VITE_SERVER_URL}/session`;

  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = res.ok ? await res.json() : { username: null };
    setStatus(res.status);
    return { status: res.status, username: data.username };
  } catch (error) {
    // Network error / server unreachable — e.g. a cold start that never answered.
    // Fail closed (treat as logged out) instead of throwing an uncaught rejection.
    console.error("Session check failed:", error);
    setStatus(401);
    return { status: 401, username: null };
  }
}
