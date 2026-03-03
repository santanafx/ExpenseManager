export class InvalidUsersCredentials extends Error {
  constructor() {
    super('Invalid user credentials.')
  }
}