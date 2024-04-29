import {PrismaClient } from '@prisma/client';
import Session from '../data/Session';

const prisma = new PrismaClient();
class SessionService{
    async getSessionInfo(idSession: string) {
        try {
            const session = await prisma.session.findUnique({
                where: {
                  id_session : idSession
                }
            });
            if (!session) return null;

            return new Session(session.id_session,session.date,session.nb_students,session.name)

        }catch (error: any) {
            throw new Error(`Une erreur s'est produite lors de la récupération des données de la session: ${error.message}`);
        }

    }
}

export default SessionService;