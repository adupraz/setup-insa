import {PrismaClient } from '@prisma/client';
import Data_suivi_rt from '../data/Data_suivi_rt'; 


const prisma = new PrismaClient();
class SynchroService {

  /**
   * Get the current slide of the connected professor from the database.
   * @returns {number} - The current slide number.
   */

  
  async getAllSynchro(idSession: string) {
    
    const datas_suivi_RT = await prisma.data_Suivi_RT.findMany({
      where: {
        id_session : idSession
      }
    })       

    console.log(datas_suivi_RT);
    
    const nb_question_by_slide = []; 
    nb_question_by_slide[0]=0; 
    const res : Data_suivi_rt[] = []; 
    let synchro = {
        retard : 0,
        en_phase : 0,
        avance : 0
      
    }
    

    for(const data_suivi_RT of datas_suivi_RT){
      const nb_questions = await prisma.data_Question.count({
        where: {
          id_session : idSession,
          num_slide : data_suivi_RT.num_slide
        }
      })

      res.push(new Data_suivi_rt(data_suivi_RT.id, data_suivi_RT.id_session, data_suivi_RT.id_slides, data_suivi_RT.num_slide, data_suivi_RT.id_slide, data_suivi_RT.list, data_suivi_RT.index));
      let i = 0; 
      for(const num_slide_students of data_suivi_RT.index){
        if(num_slide_students < data_suivi_RT.num_slide){
          synchro.retard += data_suivi_RT.list[i++]
        }
        else if(num_slide_students > data_suivi_RT.num_slide){
          synchro.avance += data_suivi_RT.list[i++]
        }
        else if(num_slide_students == data_suivi_RT.num_slide){
          synchro.en_phase += data_suivi_RT.list[i++]
        }
      }
      console.log("RES :", res)
  
      nb_question_by_slide[data_suivi_RT.num_slide] = nb_questions; 

      return {
        datas_suivi_RT : res, 
        synchro: synchro, 
        nb_question_by_slide: nb_question_by_slide
      }; 

      
    }

  }

  // private dbService: DatabaseService;

  // constructor() {
  //   this.dbService = new DatabaseService(); // Initialize the database service
  // }

  // /**
  //  * Get the current slide of the connected professor from the database.
  //  * @returns {number} - The current slide number.
  //  */
  // getSlideProfesseurEnCours(): number {
  //   // Implementation to query the database for the current slide of the connected professor
  //   // ...
  //   return 0; // Placeholder return value
  // }

  // /**
  //  * Get the current slides of all students from the database.
  //  * @returns {Array<number>} - List of current slide numbers for each student.
  //  */
  // getSlidesEtudiantsEnCours(): number[] {
  //   // Implementation to query the database for the current slides of all students
  //   // ...
  //   return []; // Placeholder return value
  // }

  // /**
  //  * Initialize a Data_suivi variable and increment its elements based on student presence.
  //  * @param {Array<number>} slidesEtudiants - List of current slide numbers for each student.
  //  * @param {number} slideProfesseur - Current slide number of the professor.
  //  * @returns {Data_suivi} - Initialized Data_suivi object.
  //  */
  // initialiserDataSuivi(slidesEtudiants: number[], slideProfesseur: number): Data_suivi {
  //   const dataSuivi = new Data_suivi(slidesEtudiants.length);

  //   // Implementation to increment elements of dataSuivi based on student presence
  //   // ...

  //   return dataSuivi;
  // }

  // /**
  //  * Store the Data_suivi variable in the database and return it for server controllers.
  //  * @param {Data_suivi} dataSuivi - Initialized Data_suivi object.
  //  * @returns {Data_suivi} - Stored Data_suivi object.
  //  */
  // stockerEtRetournerData(dataSuivi: Data_suivi): Data_suivi {
  //   // Implementation to store dataSuivi in the database
  //   // ...

  //   return dataSuivi;
  // }

  // /**
  //  * Retrieve all Data_suivi data by course ID for dashboard display.
  //  * @param {string} idCours - Course ID.
  //  * @returns {Map<number, Data_suivi>} - Map containing slide numbers and corresponding Data_suivi objects.
  //  */
  // recupererDataPourDashboard(idCours: string): Map<number, Data_suivi> {
  //   const dataMap = new Map<number, Data_suivi>();

  //   // Implementation to query the database for all Data_suivi data by course ID
  //   // ...

  //   return dataMap;
  // }
}

export default SynchroService;