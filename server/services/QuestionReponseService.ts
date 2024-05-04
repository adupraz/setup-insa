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
              const res_repartition : number[][] = [];

              //initialization of res_repartition according to the number of responses
              for (const answer of question.answers_id){
                res_repartition.push([0,0,0]);
              }

              //Creation of list_repartition according to list_responses and list_tdr
              for (let i = 0; i < question.list_tdr.length; i++) {
                const response = question.list_responses[i];
                const index = question.answers_id.indexOf(response)
                const tdr = question.list_tdr[i];
                
                if (tdr < 30){
                  res_repartition[index][0]++;
                }
                else if (tdr >= 30 && tdr < 120) {
                  res_repartition[index][1]++;
                }
                else{
                  res_repartition[index][2]++;
                }
              }
              res.push(new Data_question(question.id, question.num_slide, question.id_session, question.list, question.answers_id, question.id_question, question.question_url, question.list_tdr, question.right_answers, question.type, res_repartition));
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
        const res_repartition : number[][] = [];

          //initialization of res_repartition according to the number of responses
          for (const answer of question.answers_id){
            res_repartition.push([0,0,0]);
          }

          //Creation of list_repartition according to list_responses and list_tdr
          for (let i = 0; i < question.list_tdr.length; i++) {
            const response = question.list_responses[i];
            const index = question.answers_id.indexOf(response)
            const tdr = question.list_tdr[i];
            
            if (tdr < 30){
              res_repartition[index][0]++;
            }
            else if (tdr >= 30 && tdr < 120) {
              res_repartition[index][1]++;
            }
            else{
              res_repartition[index][2]++;
            }
          }
        res.push(new Data_question(question.id, question.num_slide, question.id_session, question.list, question.answers_id, question.id_question, question.question_url, question.list_tdr, question.right_answers, question.type, res_repartition));
      }
      return res;
      
    } catch (error: any) {
      throw new Error(`Une erreur s'est produite lors de la récupération des données: ${error.message}`);
    }
  }
}

export default QuestionReponseService;