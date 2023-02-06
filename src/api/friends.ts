import { http } from "@tauri-apps/api"
import { Ref } from "vue";
import { useAuthStore, useSettingsStore } from "../store";
import { Tasks, UserObject, UserObjectAdded, UpdateCallback } from "../types";
import { sleep } from "../utils";
import { getCookies } from "./cookies";

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

export const getUserWeb = async (userId: number): Promise<UserObject> => {
  const response = await http.fetch<string>(`https://osu.ppy.sh/users/${userId}`, {
    method: "GET",
    responseType: 2
  });
  const responseDom = new DOMParser().parseFromString(response.data, "text/html");
  let element = responseDom.getElementsByClassName("js-react--profile-page")[0]!;
  let userJson = JSON.parse(element.getAttribute("data-initial-data")!);

  return userJson.user
}

export const getUserApi = async (userId: number, access_token: string): Promise<UserObject> => {
  const response = await http.fetch<UserObject>(`https://osu.ppy.sh/api/v2/users/${userId}`, {
    method: "GET",
    responseType: 1,
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  });

  return response.data
}

export const getUser = async (userId: number) => {
  const authStore = useAuthStore();

  if (authStore.access_token) {
    return getUserApi(userId, authStore.access_token);
  }

  return getUserWeb(userId);
}

export const getRankingElements = async (page: number, country: string, gamemode: string) => {
  let countryParam = country === "GLOBAL" ? "" : `&country=${country}`;

  const response = await http.fetch<string>(`https://osu.ppy.sh/rankings/${gamemode}/performance?page=${page}${countryParam}`, {
    method: "GET",
    responseType: 2
  })

  let dom = new DOMParser().parseFromString(response.data, "text/html");
  return Array.from(dom.getElementsByClassName("ranking-page-table__user-link-text js-usercard"));
}

export const addFriend = async (userId: number) => {
  await sleep(6000);
  const authStore = useAuthStore();

  const response = await http.fetch<UserObjectAdded[]>(`https://osu.ppy.sh/home/friends?target=${userId}`, {
    method: "POST",
    headers: {
      "cookie": `osu_session=${authStore.session}`,
      "x-csrf-token": authStore.token
    }
  });

  if (!response.ok) return null;

  let cookies = getCookies(response.rawHeaders);
  authStore.session = cookies["osu_session"];
  authStore.token = cookies["XSRF-TOKEN"];

  return response.data;
}

export async function removeFriend(userId: number) {
  const authStore = useAuthStore();

  const response = await http.fetch(`https://osu.ppy.sh/home/friends/${userId}`, {
    method: "DELETE",
    headers: {
      "cookie": `osu_session=${authStore.session}`,
      "x-csrf-token": authStore.token
    }
  });

  let cookies = getCookies(response.rawHeaders);
  authStore.session = cookies["osu_session"];
  authStore.token = cookies["XSRF-TOKEN"];
}

export const startChecking = async (taskId: number, tasks: Tasks, countryCode: string, currentChecking: Ref<number>, currentPage: Ref<number>, updateCallback?: UpdateCallback) => {
  const settingsStore = useSettingsStore();

  // limit for the country that will be started to check
  const limit = settingsStore.getLimit(countryCode) || { countryCode, end: 200, start: 1, index: 0 };

  for (let page = limit.start; page < limit.end; page++) {
    if (!tasks[taskId]) return;
    currentPage.value = page;

    let userRankingElements = await getRankingElements(page, limit.countryCode, settingsStore.gamemode);
    userRankingElements = userRankingElements.slice(limit.index);

    for (const [index, element] of userRankingElements.entries()) {
      if (!tasks[taskId]) continue;

      let userId = element.getAttribute("data-user-id");
      if (!userId) continue;
      let userIdNumber = parseInt(userId);

      if (settingsStore.friends.includes(userIdNumber) || settingsStore.blacklistIds.includes(userIdNumber)) continue;
      if (settingsStore.addBlacklist) {
        settingsStore.toggleBlacklistId(userIdNumber);
      }

      currentChecking.value = userIdNumber;
      const newFriendList = await addFriend(userIdNumber);
      if (!newFriendList) continue;

      let addedFriend = newFriendList.find(fr => fr.target_id === userIdNumber);
      if (!addedFriend) continue;

      if (!addedFriend.mutual && !settingsStore.addFriend) {
        await removeFriend(userIdNumber)
      }

      if (updateCallback) {
        updateCallback(userIdNumber, addedFriend.mutual ? userIdNumber : undefined)
      }

      settingsStore.updateLimit({
        countryCode,
        start: page,
        end: limit.end,
        index: index
      });
    }

    settingsStore.updateLimit({
      countryCode,
      start: page,
      end: limit.end,
      index: 0
    })

    await sleep(2500);
  }
}
