export async function fetchWithRefreshClient(url: string, options: RequestInit = {}) {
  // include cookies in every request
  let res = await fetch(url, { ...options, credentials: "include" });

  if (res.status === 401) {
    // Access token expired, try refresh
    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      // Redirect client-side
      window.location.href = "/auth/login";
      return;
    }

    // Retry original request after refresh
    res = await fetch(url, { ...options, credentials: "include" });
  }

  if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);

  return res.json();
}
