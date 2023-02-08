import { http } from "@tauri-apps/api";
import { SessionLoginUser } from "../types";
import { getCookies, parseCookies } from "./cookies";
import { useAuthStore, useSettingsStore, useUserStore } from "../store";
import { notify } from "../plugin/notification";

interface Login {
  header: string,
  header_popup: string,
  user: SessionLoginUser,
  
  error?: string
}

export const triggerVerification = async (cookie: string) => {
  const client = await http.getClient();
  const response = await client.get("https://osu.ppy.sh/home/account/edit", {
    headers: {
      cookie
    }
  });

  if (response.status !== 401) {
    notify(`Verification request returned ${response.status} code.`, {
      description: "Expected status code is 401"
    });
    return false;
  }

  let cookies = getCookies(response.rawHeaders);

  const authStore = useAuthStore();
  authStore.session = cookies["osu_session"];
  authStore.token = cookies["XSRF-TOKEN"];

  return true;
}

export const emailVerification = async (code: string) => {
  const authStore = useAuthStore();

  const client = await http.getClient();
  const response = await client.post<{ error: string }>("https://osu.ppy.sh/home/account/verify", {
    payload: {
      verification_key: code
    },
    type: "Json"
  }, {
    headers: {
      "cookie": `osu_session=${authStore.session}; XSRF-TOKEN=${authStore.token}`,
      "referer": "https://osu.ppy.sh",
      "x-csrf-token": authStore.token 
    }
  });

  if (!response.ok) {
    notify(`Verification request returned ${response.status} error code.`, {
      description: response.data.error
    });
    return false;
  }

  let cookies = getCookies(response.rawHeaders);
  authStore.session = cookies["osu_session"];
  authStore.token = cookies["XSRF-TOKEN"];

  return true;
}


export const login = async (username: string, password: string) => {
  const client = await http.getClient();
  const response = await client.get("https://osu.ppy.sh/home", { responseType: 2 });
  
  if (!response.ok) {
    notify(`Can't make request to osu's website. ${response.status}`, {
      description: "If osu.ppy.sh isn't down then you've probably made too many requests to website."
    });
    return false;
  }

  let cookies = getCookies(response.rawHeaders);
  let cookieString = parseCookies(cookies);

  const sessionResponse = await client.post<Login>("https://osu.ppy.sh/session", {
    payload: {
      "_token": cookies["XSRF-TOKEN"],
      "username": username,
      "password": password
    },
    type: "Form"
  }, {
    headers: {
      "referer": "https://osu.ppy.sh",
      "cookie": cookieString
    }
  });
  
  if (!sessionResponse.ok) {
    notify(`Login request returned ${sessionResponse.status} error code.`, {
      description: sessionResponse.data.error
    });
    return false;
  }

  const settingsStore = useSettingsStore();
  const userStore = useUserStore();
  userStore.user = sessionResponse.data.user;
  settingsStore.toggleBlacklistId(sessionResponse.data.user.id);

  cookies = getCookies(sessionResponse.rawHeaders);
  cookieString = parseCookies(cookies);

  return await triggerVerification(cookieString);
}
