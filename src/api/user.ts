import { http } from "@tauri-apps/api";
import { UserObject } from "../types";
import { useAuthStore } from "../store";

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
