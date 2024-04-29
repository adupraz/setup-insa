class Session {
    id_session : string;
    date : string;
    nb_student : number;
    name : string;

    constructor(id_session: string, date: string, nb_student: number, name: string) {
        this.id_session = id_session;
        this.date = date;
        this.nb_student = nb_student;
        this.name = name;
      }
}
export default Session;
