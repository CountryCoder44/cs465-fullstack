// Mirrors the public fields of the Mongoose userSchema in app_api/models/user.js
// (the hash and salt never leave the server)
export class User {
  email: string = '';
  name: string = '';
}
