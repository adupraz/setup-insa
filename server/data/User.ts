import Session from "./Session";

class User {
    id_user : string;
    name : string;
    sessions : Session[];

    constructor(id_user: string, name: string, sessions: Session[]) {
        this.id_user = id_user;
        this.name = name;
        this.sessions = sessions;
      }
}
export default User;
