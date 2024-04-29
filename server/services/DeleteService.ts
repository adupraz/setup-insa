import { PrismaClient } from '@prisma/client';
import Session from '../data/Session';
import type { Data } from '../data/Data';

const prisma = new PrismaClient();
export default class DeleteService{
    /**
    * Delete instance of Session from the database for a given id.
    * @param {string} idSession - Number of ID of the session which we want to delete
    */
    async deleteSessionDatas (idSession: string) {
        try {
            // Delete all session instances of Data_Question
            const deletedData_Question = await prisma.data_Question.deleteMany({
                where: {
                  id_session : idSession
                }
            });

            // Delete all session instances of Data_Notes
            const deletedData_Notes = await prisma.data_Notes.deleteMany({
                where: {
                  id_session : idSession
                }
            });

            // Delete all session instances of Data_Fatigue
            const deletedData_Fatigue = await prisma.data_Fatigue.deleteMany({
                where: {
                  id_session : idSession
                }
            });

            // Delete all session instances of Data_Question
            const deletedData_Suivi = await prisma.data_Suivi.deleteMany({
                where: {
                  id_session : idSession
                }
            });

            //Delete the actual session
            const deletedSession = await prisma.session.delete({
                where: {
                  id_session : idSession
                }
            });
            if (!deletedSession) return null;

            return new Session(deletedSession.id_session,deletedSession.date,deletedSession.nb_students,deletedSession.name)

        }catch (error: any) {
            throw new Error(`Une erreur s'est produite lors de la suppression de la session: ${error.message}`);
        }
    }
}
