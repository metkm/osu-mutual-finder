import { http } from "@tauri-apps/api"
import { useAuthStore, useSettingsStore } from "../store";
import { UserObject } from "../types";

export const updateFriends = async () => {
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();

  const client = await http.getClient();
  const response = await client.get<string>("https://osu.ppy.sh/home/friends", {
    responseType: 2,
    headers: {
      "cookie": `osu_session=${authStore.session}`
    }
  });

  const dom = new DOMParser().parseFromString(response.data, "text/html");
  const jsonElements = dom.getElementById("json-users");
  if (!jsonElements) return null;

  let jsonUsers: UserObject[] = JSON.parse(jsonElements.innerText);
  settingsStore.friends = jsonUsers.map(user => user.id);
}
