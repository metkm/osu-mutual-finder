const cookieRegex = /(?<key>.*?)=(?<value>.*?);/;

export const getCookies = (headers: Record<string, string[]>) => {
  let cookies: Record<string, string> = {};

  for (const cookie of headers["set-cookie"]) {
    let match = cookie.match(cookieRegex);
    if (!match || !match.groups || match.groups.value === "deleted") continue;

    if (match.groups.key === "osu_session" && match.groups.value.length < 262) {
      continue;
    }
    
    cookies[match.groups.key] = match.groups.value;
  }

  return cookies;
}

export const parseCookies = (cookies: Record<string, string>) => {
  let cookieString = "";

  for (const [key, value] of Object.entries(cookies)) {
    cookieString += `${key}=${value}; `;
  }

  return cookieString.slice(0, -2);
}
