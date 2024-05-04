// Import de l'interface Data
import type { Data } from './Data' ;

// Import Prisma Client
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Enumeration type_question
/*
enum type_question {
  QCM = 'QCM',
  QCU = 'QCU',
  OUINON = 'OUINON',
  VRAIFAUX = 'VRAIFAUX'
}*/

//Définission du type Triplet
type Triplet<T, U, V> = [T, U, V];

// Definition of Data_question class who's inheriting Data interface
class Data_question implements Data {
  id : string;
  num_slide: number;
  id_cours: string;

  
  list: any[]; // list of number of answers chosen for each possible answer
  answers_id: string[]; // indice of each possible answer 

  id_question: string;
  question_url: string;
  
  list_tdr: Array<number>;
  right_answers: Array<number>;
  type: string;

  list_repartition:number[][];

  constructor(id: string, num_slide: number, id_cours: string, list: any[], answers_id: string[], id_question: string, question_url: string, list_tdr: Array<number>, right_answers: Array<number>, type: string, list_repartition:number[][]) {
    //super(id, num_slide, id_cours, list);
    this.id = id;
    this.num_slide = num_slide;
    this.id_cours = id_cours;

    this.list = list;
    this.answers_id = answers_id;
    
    this.id_question = id_question; 
    this.question_url = question_url;
    this.list_tdr = list_tdr;
    this.right_answers = right_answers;
    this.type = type;
    this.list_repartition = list_repartition;
  }


  /**
   * To save a question in the MongoDb
   */
  /*
  async saveQuestion(): Promise<void> {
    try {
      await prisma.question.create({
        data: {
          id: this.id,
          num_slide: this.num_slide,
          id_cours: this.id_cours,
          list: this.list
        }
      });
      console.log('Question enregistrée avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la question :', error);
    }
  }


   */
  /**
   * To update a question in the MongoDb
   */
  /*
  async updateQuestion(updatedList: any[]): Promise<void> {
    try {
      await prisma.question.update({
        where: {
          id: this.id
        },
        data: {
          list: updatedList
        }
      });
      console.log('Question mise à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la question :', error);
    }
  }


   */
  /**
   * To delete a question in the MongoDb
   */
  /*
  async deleteQuestion(): Promise<void> {
    try {
      await prisma.question.delete({
        where: {
          id: this.id
        }
      });
      console.log('Question supprimée avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression de la question :', error);
    }
  }


   */
}
// Export of Data_question class

export default Data_question;
