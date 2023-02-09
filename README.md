Be sure to add countries to check from settings. You can double click to country name to add it.

It doesn't store your passwords in any way. If you are still can't trust it what you can do is since it's already open source you can read the code and build the app yourself.

# Some screenshots!

![mutuals](https://user-images.githubusercontent.com/54271295/215283839-d6751112-21a9-4b5a-b7b5-8bae26b6914b.png)
![settings](https://user-images.githubusercontent.com/54271295/181880677-24d09633-95c0-4ae9-a715-7fc9da76865c.png)

# Running the project
### For the app
`.env.development`
```
VITE_API_BASE_URL=http://localhost:3001
```
```
npm run tauri dev
```
### For the server
`.env.development`
```
DATABASE_URL=postgres://user:password@localhost:5432/mutualfinder
CLIENT_ID=123
CLIENT_SECRET=123
AUTH_REDIRECT_URI=http://localhost:3001/api/authorize
REDIRECT_URI=http://localhost:3001
```
