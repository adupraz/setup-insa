import {PrismaClient } from '@prisma/client';
import Data_question from '../data/Data_question'; // Data_question class import

const prisma = new PrismaClient();

class QuestionReponseService {
  /**
    * Retrieve instances of data_Question from the database for a given session and slide.
    * @param {string} idSession - Number of ID of the session from which we want to retrieve the questions
    * @param {number} numSlide - Number of the slide from which we want to retrieve a questions
    */
    async getDataQuestionByIdAndNumSlide(idSession: string, numSlide: number) {
        try {
            // Recherche d'un élément de la classe data_question par id_cours et num_slide
            const questions = await prisma.data_Question.findMany({
                where: {
                  id_session : idSession,
                  num_slide : numSlide
                }
            });
            if (!questions) return null;
            const res : Data_question[] = [];

            for (const question of questions){
              res.push(new Data_question(question.id, question.num_slide, question.id_session, question.list, question.answers_id, question.id_question, question.question_url, question.list_tdr, question.right_answers, question.type));
            }
            return res;
            
        } catch (error: any) {
            throw new Error(`Une erreur s'est produite lors de la récupération des données: ${error.message}`);
        }
    }

  /**
    * Retrieve all instances of data_Question from the database for a given session.
    * @param {string} idSession - Number of ID of the session from which we want to retrieve all the questions
    */
  async getDataQuestionById(idSession: string) {
    try {
      // Search every question from the course with id "idCours"
      const questions = await prisma.data_Question.findMany({
        where: {
          id_session : idSession
        }
      });
      const res : Data_question[] = [];

      for (const question of questions) {
        res.push(new Data_question(question.id, question.num_slide, question.id_session, question.list, question.answers_id, question.id_question, question.question_url, question.list_tdr, question.right_answers, question.type));
      }
      return res;
      
    } catch (error: any) {
      throw new Error(`Une erreur s'est produite lors de la récupération des données: ${error.message}`);
    }
  }
}

export default QuestionReponseService;