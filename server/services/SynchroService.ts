import {PrismaClient } from '@prisma/client';
import Data_suivi_rt from '../data/Data_suivi_rt'; 
import Data_suivi_ps from '../data/Data_suivi_ps';
import Session from '../data/Session';

const prisma = new PrismaClient();
class SynchroService {

  /**
   * Get the current slide of the connected professor from the database.
   * @returns {number} - The current slide number.
   */
  
  async getAllSynchro(idSession: string) {

    const session_en_cours = await prisma.session.findUnique({
      where:{
        id_session : idSession
      }
    })

    const current_slide = session_en_cours?.current_slide; 
    
    const datas_suivi_RT = await prisma.data_Suivi_RT.findMany({
      where: {
        id_session : idSession,
        num_slide: current_slide
      }
    }) 
    
    console.log(datas_suivi_RT);
  

    let i = 0; 
    let synchro = {
      nb_question: 0,
      retard: 0,
      en_phase: 0, 
      avance: 0
    }

    for(const data_suivi_RT of datas_suivi_RT){
      const nb_questions = await prisma.data_Question.count({
        where: {
          id_session : idSession,
          num_slide : data_suivi_RT.num_slide
        }
      })

      synchro.nb_question = nb_questions;

      i=0;
      for(const num_slide_students of data_suivi_RT.index){
        if(num_slide_students < data_suivi_RT.num_slide){
          synchro.retard += data_suivi_RT.list[i]
        }
        else if(num_slide_students > data_suivi_RT.num_slide){
          synchro.avance += data_suivi_RT.list[i]
        }
        else if(num_slide_students == data_suivi_RT.num_slide){
          synchro.en_phase += data_suivi_RT.list[i]
        }
        i++; 
      }
  
    }

    return synchro; 
  }

  async getAllSynchroPS (idSession : string){
    const datas_suivi_PS = await prisma.data_Suivi_PS.findMany({
      where: {
        id_session : idSession
      }
    })  

    const all_datas_suivi_ps: Data_suivi_ps[] = [];
    const res_datas_suivi_ps: Data_suivi_ps[] = [];

    //Initialization of the number of question
    const nb_question_by_slide = []; 
    nb_question_by_slide[0]=0;

    for(const elt_data_suivi_PS of datas_suivi_PS){
      //Check if there is another data for the slide of the current data
      let present: boolean = false;
      let index_data: number = 0;
      for (let i = 0; i<res_datas_suivi_ps.length;i++){
        if(elt_data_suivi_PS.num_slide == res_datas_suivi_ps[i].num_slide){
          present = true;//Detection of the data
          index_data = i;
        }
      }
    
      if (!present){
        //If the data of a slide doesn't exist, we put it in the result
        res_datas_suivi_ps.push(new Data_suivi_ps(elt_data_suivi_PS.id, elt_data_suivi_PS.id_session, elt_data_suivi_PS.num_slide, elt_data_suivi_PS.list, elt_data_suivi_PS.index,1,0,0,0));

        //And also get the number of questions for this slide
        const nb_questions = await prisma.data_Question.count({
          where: {
            id_session : idSession,
            num_slide : elt_data_suivi_PS.num_slide
          }
        })
        nb_question_by_slide[elt_data_suivi_PS.num_slide] = nb_questions; 
      }
      else{
        //Else we do a mean of all the datas of synchronisation
        if (res_datas_suivi_ps[index_data].list.length != elt_data_suivi_PS.list.length){
          console.error("Lists of the same slide should have the same number of slides in the synchronization list.")
        }
        else{
          const means:number[] = [];
          for (let i = 0; i<res_datas_suivi_ps[index_data].list.length;i++){
            const mean = (elt_data_suivi_PS.list[i] + res_datas_suivi_ps[index_data].list[i] * res_datas_suivi_ps[index_data].nb_datas)/(1 + res_datas_suivi_ps[index_data].nb_datas);
            means.push(mean);
          }
          res_datas_suivi_ps[index_data].list = means;
          res_datas_suivi_ps[index_data].nb_datas++;
        }
      }
    }

    //Calculus of the students in retard, on the current slide and early
    for (const elt of res_datas_suivi_ps){
      let retard: number = 0;
      let current: number = 0;
      let early: number = 0;
      current = elt.list[elt.num_slide];

      for (let i = 0; i < elt.num_slide; i++) {
        retard += elt.list[i];
      }
      for (let i = elt.num_slide + 1; i < elt.list.length; i++) {
        early += elt.list[i];
      }

      elt.retard = retard;
      elt.current = current;
      elt.early = early;
    }

    //Creation of the table of all the number of slides
    const res_slides = [];
    const nb_slides = res_datas_suivi_ps.length;
    for (let i = 0; i<nb_slides;i++){
      res_slides[i] = i+1;
    }

    return{
      datas_suivi_ps : res_datas_suivi_ps,//Table of one data per slide of the session
      slides : res_slides, // Table which length is the number of slides of the session
      nb_question_by_slide: nb_question_by_slide //Number of question by slide
    };
  }

}

export default SynchroService;