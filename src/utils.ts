import axios from "axios";
import { UserObject, UserObjectAdded } from "./types";

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms);
  })
}

export async function getUser(userId: number): Promise<UserObject> {
  const response = await axios.get(`https://osu.ppy.sh/users/${userId}`);
  const responseDom = new DOMParser().parseFromString(response.data, "text/html");
  return JSON.parse(responseDom.getElementById("json-user")!.innerText);
}

export async function getIdsOfFriends(): Promise<number[]> {
  const response = await axios.get("https://osu.ppy.sh/home/friends");
  const dom = new DOMParser().parseFromString(response.data, "text/html");
  let jsonUsers = JSON.parse(dom.getElementById("json-users")!.innerText) as UserObject[]
  return jsonUsers.map(user => user.id)
}

export async function addFriend(userId: number): Promise<UserObjectAdded[] | undefined> {
  await sleep(10000);
  try {
    const response = await axios.post("https://osu.ppy.sh/home/friends", null, {
      params: {
        target: userId
      }
    });

    return response.data
  } catch(error: any) {
    if (error.response.status == 429) {
      await sleep(10000);
      addFriend(userId);
    } else {
      console.log("Can't add:", userId);
    }
  }
}

export async function delUser(userId: number) {
  await axios.delete(`https://osu.ppy.sh/home/friends/${userId}`)
}
