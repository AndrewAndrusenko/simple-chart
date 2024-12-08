/* interface IUser {
  name:string,
  password:string
}
class User implements IUser {
  name:string;
  password: string;
  constructor (name:string, password:string) {
    this.name = name;
    this.password = password;
  }
  getUserData () {
    console.log(`User name:${this.name} and password length is ${this.password.length}`);
  }
}
let newUser = new User ('test','some_pass')
newUser.getUserData() */