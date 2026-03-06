export class LoginInputModel {
  constructor(readonly email: string, readonly password: string) {
    this.email = email;
    this.password = password
  }
}