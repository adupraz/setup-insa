import Session from "./Session";

class User {
    id_user : string;
    name : string;
    password : string;
    sessions : string[];

    constructor(id_user: string, name: string, password: string, sessions: string[]) {
        this.id_user = id_user;
        this.name = name;
        this.password = password;
        this.sessions = sessions;
      }
}
export default User;
