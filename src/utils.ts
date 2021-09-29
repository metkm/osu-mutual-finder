import axios from "axios";
import { useStore } from "vuex";
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

export async function updateFriends(): Promise<void> {
  const store = useStore();

  const response = await axios.get("https://osu.ppy.sh/home/friends");
  const dom = new DOMParser().parseFromString(response.data, "text/html");
  let jsonUsers = JSON.parse(dom.getElementById("json-users")!.innerText) as UserObject[];
  store.dispatch("setFriends", jsonUsers.map(user => user.id));

  const token = dom.getElementsByName("csrf-token")[0].getAttribute("content");
  axios.defaults.headers.common["x-csrf-token"] = token;
  axios.defaults.headers.common["x-requested-with"] = "XMLHttpRequest";
}

export async function addFriend(userId: number): Promise<UserObjectAdded[] | undefined> {
  await sleep(6000);
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

interface country {
  code: string,
  name: string,
  display: number
}

export async function getCountries(): Promise<country[]> {
  const response = await axios.get("https://osu.ppy.sh/rankings/osu/country");
  const dom = new DOMParser().parseFromString(response.data, "text/html");
  return JSON.parse(dom.getElementById("json-countries")!.innerText);
}
