import axios from "axios";
import { useStore } from "vuex";
import { Country, UserObject, UserObjectAdded, WebCountry } from "./types";

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
  let element = responseDom.getElementsByClassName("js-react--profile-page")[0]!;
  let userJson = JSON.parse(element.getAttribute("data-initial-data")!);

  return userJson.user
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
  await sleep(6500);
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

export const jsonCountries: WebCountry[] = [
  { flag_url: "1f1fa-1f1f8.svg", code: "US", name: "United States" },
  { flag_url: "1f1f7-1f1fa.svg", code: "RU", name: "Russian Federation" },
  { flag_url: "1f1e9-1f1ea.svg", code: "DE", name: "Germany" },
  { flag_url: "1f1e8-1f1e6.svg", code: "CA", name: "Canada" },
  { flag_url: "1f1f5-1f1f1.svg", code: "PL", name: "Poland" },
  { flag_url: "1f1eb-1f1f7.svg", code: "FR", name: "France" },
  { flag_url: "1f1f5-1f1ed.svg", code: "PH", name: "Philippines" },
  { flag_url: "1f1e7-1f1f7.svg", code: "BR", name: "Brazil" },
  { flag_url: "1f1ef-1f1f5.svg", code: "JP", name: "Japan" },
  { flag_url: "1f1ec-1f1e7.svg", code: "GB", name: "United Kingdom" },
  { flag_url: "1f1ee-1f1e9.svg", code: "ID", name: "Indonesia" },
  { flag_url: "1f1e6-1f1fa.svg", code: "AU", name: "Australia" },
  { flag_url: "1f1f9-1f1fc.svg", code: "TW", name: "Taiwan" },
  { flag_url: "1f1e8-1f1f1.svg", code: "CL", name: "Chile" },
  { flag_url: "1f1f2-1f1fe.svg", code: "MY", name: "Malaysia" },
  { flag_url: "1f1f0-1f1f7.svg", code: "KR", name: "South Korea" },
  { flag_url: "1f1fa-1f1e6.svg", code: "UA", name: "Ukraine" },
  { flag_url: "1f1f2-1f1fd.svg", code: "MX", name: "Mexico" },
  { flag_url: "1f1e6-1f1f7.svg", code: "AR", name: "Argentina" },
  { flag_url: "1f1f9-1f1ed.svg", code: "TH", name: "Thailand" },
  { flag_url: "1f1e8-1f1f3.svg", code: "CN", name: "China" },
  { flag_url: "1f1f8-1f1ec.svg", code: "SG", name: "Singapore" },
  { flag_url: "1f1ee-1f1f9.svg", code: "IT", name: "Italy" },
  { flag_url: "1f1fb-1f1f3.svg", code: "VN", name: "Vietnam" },
  { flag_url: "1f1ea-1f1f8.svg", code: "ES", name: "Spain" },
  { flag_url: "1f1eb-1f1ee.svg", code: "FI", name: "Finland" },
  { flag_url: "1f1ed-1f1f0.svg", code: "HK", name: "Hong Kong" },
  { flag_url: "1f1f3-1f1f1.svg", code: "NL", name: "Netherlands" },
  { flag_url: "1f1f8-1f1ea.svg", code: "SE", name: "Sweden" },
  { flag_url: "1f1f9-1f1f7.svg", code: "TR", name: "Turkey" },
  { flag_url: "1f1f5-1f1ea.svg", code: "PE", name: "Peru" },
  { flag_url: "1f1e8-1f1ff.svg", code: "CZ", name: "Czech Republic" },
  { flag_url: "1f1f7-1f1f4.svg", code: "RO", name: "Romania" },
  { flag_url: "1f1f5-1f1f9.svg", code: "PT", name: "Portugal" },
  { flag_url: "1f1e8-1f1f4.svg", code: "CO", name: "Colombia" },
  { flag_url: "1f1f3-1f1f4.svg", code: "NO", name: "Norway" },
  { flag_url: "1f1ed-1f1fa.svg", code: "HU", name: "Hungary" },
  { flag_url: "1f1e6-1f1f9.svg", code: "AT", name: "Austria" },
  { flag_url: "1f1e7-1f1ea.svg", code: "BE", name: "Belgium" },
  { flag_url: "1f1f0-1f1ff.svg", code: "KZ", name: "Kazakhstan" },
  { flag_url: "1f1e7-1f1fe.svg", code: "BY", name: "Belarus" },
  { flag_url: "1f1f1-1f1f9.svg", code: "LT", name: "Lithuania" },
  { flag_url: "1f1f3-1f1ff.svg", code: "NZ", name: "New Zealand" },
  { flag_url: "1f1ee-1f1f1.svg", code: "IL", name: "Israel" },
  { flag_url: "1f1e9-1f1f0.svg", code: "DK", name: "Denmark" },
  { flag_url: "1f1ee-1f1f3.svg", code: "IN", name: "India" },
  { flag_url: "1f1e8-1f1ed.svg", code: "CH", name: "Switzerland" },
  { flag_url: "1f1ec-1f1f7.svg", code: "GR", name: "Greece" },
  { flag_url: "1f1ea-1f1ea.svg", code: "EE", name: "Estonia" },
  { flag_url: "1f1e7-1f1ec.svg", code: "BG", name: "Bulgaria" },
  { flag_url: "1f1f1-1f1fb.svg", code: "LV", name: "Latvia" },
  { flag_url: "1f1f8-1f1f0.svg", code: "SK", name: "Slovakia" },
  { flag_url: "1f1ea-1f1e8.svg", code: "EC", name: "Ecuador" },
  { flag_url: "1f1fb-1f1ea.svg", code: "VE", name: "Venezuela" },
  { flag_url: "1f1f7-1f1f8.svg", code: "RS", name: "Serbia" },
  { flag_url: "1f1f8-1f1e6.svg", code: "SA", name: "Saudi Arabia" },
  { flag_url: "1f1ee-1f1ea.svg", code: "IE", name: "Ireland" },
  { flag_url: "1f1e6-1f1ea.svg", code: "AE", name: "United Arab Emirates" },
  { flag_url: "1f1ff-1f1e6.svg", code: "ZA", name: "South Africa" },
  { flag_url: "1f1ed-1f1f7.svg", code: "HR", name: "Croatia" },
  { flag_url: "1f1fa-1f1fe.svg", code: "UY", name: "Uruguay" },
  { flag_url: "1f1e8-1f1f7.svg", code: "CR", name: "Costa Rica" },
  { flag_url: "1f1f8-1f1ee.svg", code: "SI", name: "Slovenia" },
  { flag_url: "1f1f2-1f1e6.svg", code: "MA", name: "Morocco" },
  { flag_url: "1f1ea-1f1ec.svg", code: "EG", name: "Egypt" },
  { flag_url: "1f1e9-1f1f4.svg", code: "DO", name: "Dominican Republic" },
  { flag_url: "1f1f2-1f1e9.svg", code: "MD", name: "Moldova" },
  { flag_url: "1f1f5-1f1e6.svg", code: "PA", name: "Panama" },
  { flag_url: "1f1ec-1f1f9.svg", code: "GT", name: "Guatemala" },
  { flag_url: "1f1e9-1f1ff.svg", code: "DZ", name: "Algeria" },
  { flag_url: "1f1e7-1f1f4.svg", code: "BO", name: "Bolivia" },
  { flag_url: "1f1f2-1f1f3.svg", code: "MN", name: "Mongolia" },
  { flag_url: "1f1f0-1f1ed.svg", code: "KH", name: "Cambodia" },
  { flag_url: "1f1f9-1f1f3.svg", code: "TN", name: "Tunisia" },
  { flag_url: "1f1e7-1f1f3.svg", code: "BN", name: "Brunei" },
  { flag_url: "1f1f5-1f1f7.svg", code: "PR", name: "Puerto Rico" },
  { flag_url: "1f1f5-1f1fe.svg", code: "PY", name: "Paraguay" },
  { flag_url: "1f1f0-1f1fc.svg", code: "KW", name: "Kuwait" },
  { flag_url: "1f1f6-1f1e6.svg", code: "QA", name: "Qatar" },
  { flag_url: "1f1f3-1f1f5.svg", code: "NP", name: "Nepal" },
  { flag_url: "1f1f8-1f1fb.svg", code: "SV", name: "El Salvador" },
  { flag_url: "1f1ec-1f1ea.svg", code: "GE", name: "Georgia" },
  { flag_url: "1f1f2-1f1f2.svg", code: "MM", name: "Myanmar" },
  { flag_url: "1f1f7-1f1ea.svg", code: "RE", name: "Reunion" },
  { flag_url: "1f1f5-1f1f0.svg", code: "PK", name: "Pakistan" },
  { flag_url: "1f1e7-1f1e9.svg", code: "BD", name: "Bangladesh" },
  { flag_url: "1f1f9-1f1f9.svg", code: "TT", name: "Trinidad and Tobago" },
  { flag_url: "1f1f2-1f1f4.svg", code: "MO", name: "Macau" },
  { flag_url: "1f1ed-1f1f3.svg", code: "HN", name: "Honduras" },
  { flag_url: "1f1f1-1f1fa.svg", code: "LU", name: "Luxembourg" },
  { flag_url: "1f1f2-1f1f0.svg", code: "MK", name: "North Macedonia" },
  { flag_url: "1f1ef-1f1f4.svg", code: "JO", name: "Jordan" },
  { flag_url: "1f1e7-1f1e6.svg", code: "BA", name: "Bosnia and Herzegovina" },
  { flag_url: "1f1fa-1f1ff.svg", code: "UZ", name: "Uzbekistan" },
  { flag_url: "1f1f0-1f1ec.svg", code: "KG", name: "Kyrgyzstan" },
  { flag_url: "1f1e8-1f1fe.svg", code: "CY", name: "Cyprus" },
  { flag_url: "1f1e7-1f1ed.svg", code: "BH", name: "Bahrain" },
  { flag_url: "1f1ec-1f1fa.svg", code: "GU", name: "Guam" },
  { flag_url: "1f1f1-1f1e7.svg", code: "LB", name: "Lebanon" },
  { flag_url: "1f1ee-1f1f8.svg", code: "IS", name: "Iceland" },
  { flag_url: "1f1f3-1f1ee.svg", code: "NI", name: "Nicaragua" },
  { flag_url: "1f1f2-1f1fb.svg", code: "MV", name: "Maldives" },
  { flag_url: "1f1ee-1f1f6.svg", code: "IQ", name: "Iraq" },
  { flag_url: "1f1ef-1f1f2.svg", code: "JM", name: "Jamaica" },
  { flag_url: "1f1e6-1f1ff.svg", code: "AZ", name: "Azerbaijan" },
  { flag_url: "1f1f4-1f1f2.svg", code: "OM", name: "Oman" },
  { flag_url: "1f1f1-1f1f0.svg", code: "LK", name: "Sri Lanka" },
  { flag_url: "1f1f2-1f1f9.svg", code: "MT", name: "Malta" },
  { flag_url: "1f1f5-1f1eb.svg", code: "PF", name: "French Polynesia" },
  { flag_url: "1f1e6-1f1f1.svg", code: "AL", name: "Albania" },
  { flag_url: "1f1f1-1f1e6.svg", code: "LA", name: "Lao People's Democratic Republic" },
  { flag_url: "1f1ee-1f1f7.svg", code: "IR", name: "Islamic Republic of Iran" },
  { flag_url: "1f1ec-1f1f5.svg", code: "GP", name: "Guadeloupe" },
  { flag_url: "1f1e6-1f1f2.svg", code: "AM", name: "Armenia" },
  { flag_url: "1f1f2-1f1fa.svg", code: "MU", name: "Mauritius" },
  { flag_url: "1f1f2-1f1f5.svg", code: "MP", name: "Northern Mariana Islands" },
  { flag_url: "1f1f5-1f1f8.svg", code: "PS", name: "State of Palestine" },
  { flag_url: "1f1f2-1f1f6.svg", code: "MQ", name: "Martinique" },
  { flag_url: "1f1f3-1f1e8.svg", code: "NC", name: "New Caledonia" },
  { flag_url: "1f1f8-1f1fe.svg", code: "SY", name: "Syrian Arab Republic" },
  { flag_url: "1f1f2-1f1ea.svg", code: "ME", name: "Montenegro" },
  { flag_url: "1f1e7-1f1ff.svg", code: "BZ", name: "Belize" },
  { flag_url: "1f1f2-1f1ec.svg", code: "MG", name: "Madagascar" },
  { flag_url: "1f1e7-1f1e7.svg", code: "BB", name: "Barbados" },
  { flag_url: "1f1f8-1f1f7.svg", code: "SR", name: "Suriname" },
  { flag_url: "1f1e7-1f1f8.svg", code: "BS", name: "Bahamas" },
  { flag_url: "1f1f0-1f1ea.svg", code: "KE", name: "Kenya" },
  { flag_url: "1f1ef-1f1ea.svg", code: "JE", name: "Jersey" },
  { flag_url: "1f1ee-1f1f2.svg", code: "IM", name: "Isle of Man" },
  { flag_url: "1f1ec-1f1eb.svg", code: "GF", name: "French Guiana" },
  { flag_url: "1f1f3-1f1ec.svg", code: "NG", name: "Nigeria" },
  { flag_url: "1f1eb-1f1f4.svg", code: "FO", name: "Faroe Islands" },
  { flag_url: "1f1f1-1f1fe.svg", code: "LY", name: "Libya" },
  { flag_url: "1f1ec-1f1fe.svg", code: "GY", name: "Guyana" },
  { flag_url: "1f1e6-1f1fc.svg", code: "AW", name: "Aruba" },
  { flag_url: "1f1f8-1f1e9.svg", code: "SD", name: "Sudan" },
  { flag_url: "1f1ec-1f1f1.svg", code: "GL", name: "Greenland" },
  { flag_url: "1f1ec-1f1ed.svg", code: "GH", name: "Ghana" },
  { flag_url: "1f1e7-1f1f2.svg", code: "BM", name: "Bermuda" },
  { flag_url: "1f1f3-1f1e6.svg", code: "NA", name: "Namibia" },
  { flag_url: "1f1ec-1f1ec.svg", code: "GG", name: "Guernsey" },
  { flag_url: "1f1e6-1f1fd.svg", code: "AX", name: "Aland Islands" },
  { flag_url: "1f1ec-1f1ee.svg", code: "GI", name: "Gibraltar" },
  { flag_url: "1f1e8-1f1ee.svg", code: "CI", name: "Cote D'Ivoire" },
  { flag_url: "1f1fb-1f1ee.svg", code: "VI", name: "Virgin Islands, U.S." },
  { flag_url: "1f1e8-1f1fc.svg", code: "CW", name: "Curaçao" },
  { flag_url: "1f1f1-1f1e8.svg", code: "LC", name: "Saint Lucia" },
  { flag_url: "1f1f1-1f1ee.svg", code: "LI", name: "Liechtenstein" },
  { flag_url: "1f1e7-1f1fc.svg", code: "BW", name: "Botswana" },
  { flag_url: "1f1eb-1f1ef.svg", code: "FJ", name: "Fiji" },
  { flag_url: "1f1e6-1f1e9.svg", code: "AD", name: "Andorra" },
  { flag_url: "1f1fe-1f1f9.svg", code: "YT", name: "Mayotte" },
  { flag_url: "1f1e8-1f1fb.svg", code: "CV", name: "Cabo Verde" },
  { flag_url: "1f1f0-1f1fe.svg", code: "KY", name: "Cayman Islands" },
  { flag_url: "1f1e6-1f1f4.svg", code: "AO", name: "Angola" },
  { flag_url: "1f1e9-1f1f2.svg", code: "DM", name: "Dominica" },
  { flag_url: "1f1e6-1f1ec.svg", code: "AG", name: "Antigua and Barbuda" },
  { flag_url: "1f1e8-1f1fa.svg", code: "CU", name: "Cuba" },
  { flag_url: "1f1ea-1f1f9.svg", code: "ET", name: "Ethiopia" },
  { flag_url: "1f1f2-1f1eb.svg", code: "MF", name: "Saint Martin" },
  { flag_url: "1f1fd-1f1f0.svg", code: "XK", name: "Kosovo" },
  { flag_url: "1f1f8-1f1f3.svg", code: "SN", name: "Senegal" },
  { flag_url: "1f1ec-1f1e6.svg", code: "GA", name: "Gabon" },
  { flag_url: "1f1f2-1f1ff.svg", code: "MZ", name: "Mozambique" },
  { flag_url: "1f1f8-1f1f2.svg", code: "SM", name: "San Marino" },
  { flag_url: "1f1f2-1f1e8.svg", code: "MC", name: "Monaco" },
  { flag_url: "1f1ff-1f1f2.svg", code: "ZM", name: "Zambia" },
  { flag_url: "1f1fb-1f1e8.svg", code: "VC", name: "Saint Vincent and the Grenadines" },
  { flag_url: "1f1ff-1f1fc.svg", code: "ZW", name: "Zimbabwe" },
  { flag_url: "1f1f9-1f1ef.svg", code: "TJ", name: "Tajikistan" },
  { flag_url: "1f1f9-1f1ff.svg", code: "TZ", name: "United Republic of Tanzania" },
  { flag_url: "1f1f0-1f1f3.svg", code: "KN", name: "Saint Kitts and Nevis" },
  { flag_url: "1f1fa-1f1ec.svg", code: "UG", name: "Uganda" },
  { flag_url: "1f1f5-1f1f2.svg", code: "PM", name: "Saint Pierre and Miquelon" },
  { flag_url: "1f1f9-1f1f2.svg", code: "TM", name: "Turkmenistan" },
  { flag_url: "1f1e7-1f1f9.svg", code: "BT", name: "Bhutan" },
  { flag_url: "1f1ed-1f1f9.svg", code: "HT", name: "Haiti" },
  { flag_url: "1f1ec-1f1e9.svg", code: "GD", name: "Grenada" },
  { flag_url: "1f1fe-1f1ea.svg", code: "YE", name: "Yemen" },
  { flag_url: "1f1f9-1f1ec.svg", code: "TG", name: "Togo" },
  { flag_url: "1f1eb-1f1f2.svg", code: "FM", name: "Federated States of Micronesia" },
  { flag_url: "1f1e6-1f1f5.svg", code: "AP", name: "Asia/Pacific Region" },
  { flag_url: "1f1f7-1f1fc.svg", code: "RW", name: "Rwanda" },
  { flag_url: "1f1e6-1f1ee.svg", code: "AI", name: "Anguilla" },
  { flag_url: "1f1e8-1f1f2.svg", code: "CM", name: "Cameroon" },
  { flag_url: "1f1e9-1f1ef.svg", code: "DJ", name: "Djibouti" },
  { flag_url: "1f1fb-1f1fa.svg", code: "VU", name: "Vanuatu" },
  { flag_url: "1f1f2-1f1ed.svg", code: "MH", name: "Marshall Islands" },
  { flag_url: "1f1f9-1f1f1.svg", code: "TL", name: "Timor-Leste" },
  { flag_url: "1f1f8-1f1ef.svg", code: "SJ", name: "Svalbard and Jan Mayen" },
  { flag_url: "1f1f9-1f1e8.svg", code: "TC", name: "Turks and Caicos Islands" },
  { flag_url: "1f1e6-1f1f8.svg", code: "AS", name: "American Samoa" },
  { flag_url: "1f1ea-1f1fa.svg", code: "EU", name: "Europe" },
  { flag_url: "1f1f2-1f1fc.svg", code: "MW", name: "Malawi" },
  { flag_url: "1f1f8-1f1ff.svg", code: "SZ", name: "Eswatini" },
  { flag_url: "1f1f8-1f1e8.svg", code: "SC", name: "Seychelles" },
  { flag_url: "1f1f3-1f1ea.svg", code: "NE", name: "Niger" },
  { flag_url: "1f1e8-1f1f0.svg", code: "CK", name: "Cook Islands" },
  { flag_url: "1f1fc-1f1f8.svg", code: "WS", name: "Samoa" },
  { flag_url: "1f1e7-1f1f1.svg", code: "BL", name: "Saint Barthelemy" },
  { flag_url: "1f1e8-1f1e9.svg", code: "CD", name: "The Democratic Republic of the Congo" },
  { flag_url: "1f1e7-1f1ef.svg", code: "BJ", name: "Benin" },
  { flag_url: "1f1f5-1f1ec.svg", code: "PG", name: "Papua New Guinea" },
  { flag_url: "1f1f2-1f1f1.svg", code: "ML", name: "Mali" },
  { flag_url: "1f1f2-1f1f7.svg", code: "MR", name: "Mauritania" },
  { flag_url: "1f1e8-1f1ec.svg", code: "CG", name: "Congo" },
  { flag_url: "1f1f8-1f1fd.svg", code: "SX", name: "Sint Maarten" },
  { flag_url: "1f1e7-1f1f6.svg", code: "BQ", name: "Caribbean Netherlands" },
  { flag_url: "1f1fb-1f1ec.svg", code: "VG", name: "Virgin Islands, British" },
  { flag_url: "1f1f5-1f1fc.svg", code: "PW", name: "Palau" },
  { flag_url: "1f1e7-1f1eb.svg", code: "BF", name: "Burkina Faso" },
  { flag_url: "1f1e6-1f1eb.svg", code: "AF", name: "Afghanistan" },
  { flag_url: "1f1ec-1f1f3.svg", code: "GN", name: "Guinea" },
  { flag_url: "1f1ec-1f1f2.svg", code: "GM", name: "Gambia" },
  { flag_url: "1f1f9-1f1f0.svg", code: "TK", name: "Tokelau" },
  { flag_url: "1f1f8-1f1f4.svg", code: "SO", name: "Somalia" },
  { flag_url: "1f1f1-1f1f8.svg", code: "LS", name: "Lesotho" },
  { flag_url: "1f1f8-1f1f9.svg", code: "ST", name: "Sao Tome and Principe" },
  { flag_url: "1f1f8-1f1f1.svg", code: "SL", name: "Sierra Leone" },
  { flag_url: "1f1e8-1f1fd.svg", code: "CX", name: "Christmas Island" },
  { flag_url: "1f1f9-1f1e9.svg", code: "TD", name: "Chad" },
  { flag_url: "1f1e7-1f1ee.svg", code: "BI", name: "Burundi" },
  { flag_url: "1f1f3-1f1eb.svg", code: "NF", name: "Norfolk Island" },
  { flag_url: "1f1f0-1f1f2.svg", code: "KM", name: "Comoros" },
  { flag_url: "1f1eb-1f1f0.svg", code: "FK", name: "Falkland Islands (Malvinas)" },
  { flag_url: "1f1ec-1f1f6.svg", code: "GQ", name: "Equatorial Guinea" },
  { flag_url: "1f1ea-1f1f7.svg", code: "ER", name: "Eritrea" },
  { flag_url: "1f1f1-1f1f7.svg", code: "LR", name: "Liberia" },
  { flag_url: "1f1f9-1f1f4.svg", code: "TO", name: "Tonga" },
  { flag_url: "1f1fc-1f1eb.svg", code: "WF", name: "Wallis and Futuna" },
  { flag_url: "1f1ec-1f1fc.svg", code: "GW", name: "Guinea-Bissau" },
  { flag_url: "1f1f9-1f1fb.svg", code: "TV", name: "Tuvalu" },
  { flag_url: "1f1f8-1f1e7.svg", code: "SB", name: "Solomon Islands" },
  { flag_url: "1f1e8-1f1e8.svg", code: "CC", name: "Cocos (Keeling) Islands" },
  { flag_url: "1f1e7-1f1fb.svg", code: "BV", name: "Bouvet Island" },
  { flag_url: "1f1e6-1f1f3.svg", code: "AN", name: "Netherlands Antilles" },
  { flag_url: "1f1f0-1f1ee.svg", code: "KI", name: "Kiribati" },
  { flag_url: "1f1f2-1f1f8.svg", code: "MS", name: "Montserrat" },
  { flag_url: "1f1f3-1f1f7.svg", code: "NR", name: "Nauru" },
  { flag_url: "1f1f3-1f1fa.svg", code: "NU", name: "Niue" },
  { flag_url: "1f1f5-1f1f3.svg", code: "PN", name: "Pitcairn" },
  { flag_url: "1f1e8-1f1eb.svg", code: "CF", name: "Central African Republic" },
]

