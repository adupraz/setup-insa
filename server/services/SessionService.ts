import {PrismaClient } from '@prisma/client';
import Session from '../data/Session';
import QuestionReponseService from './QuestionReponseService';
import SynchroService from './SynchroService';

const prisma = new PrismaClient();
const questionReponseService = new QuestionReponseService(); 
const synchroService = new SynchroService(); 

class SessionService{
    async getSessionInfo(idSession: string) {
        try {
            const session = await prisma.session.findUnique({
                where: {
                  id_session : idSession
                }
            });
            if (!session) return null;

            console.log(session.nb_students);
            return new Session(session.id_session,session.date,session.nb_students,session.name)

        }catch (error: any) {
            throw new Error(`Une erreur s'est produite lors de la récupération des données de la session: ${error.message}`);
        }

    }

    async getAllSessions(id_user : string){
        // Retrieve all sessions of one user 
        try {
            const sessions  = await prisma.session.findMany({
                where: {
                  userId : id_user,
                }
            });
            console.log("Sessions : " , sessions);
            if (!sessions) return null;
            const res : Session[] = [];

            for (const session of sessions ){
              res.push(new Session(session.id_session, session.date, session.nb_students, session.name));
            }
            return res;

        } catch (error: any) {
            throw new Error(`Une erreur s'est produite : ${error.message}`);
        }

    }

    async getAllDatas(id_session : string){
        // Retrieve all sessions of one user 
        try {
            const res_question = await questionReponseService.getDataQuestionById(id_session);
            const res_synchro = await synchroService.getAllSynchro(id_session);

            let res : any = {};
            res.datas_question = res_question; 
            res.datas_suivi_RT = res_synchro; 

            return res;

        } catch (error: any) {
            throw new Error(`Une erreur s'est produite : ${error.message}`);
        }

    }

}

export default SessionService;