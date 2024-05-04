// Import de l'interface Data
import type { Data } from './Data' ;


class Data_suivi_rt implements Data {

    id : string;
    num_slide: number;
    id_cours: string;

    index: number[]; 
    id_slides: string[];
    id_slide:string;
    list : any;



    constructor(id: string, id_session: string, id_slides: string[], num_slide: number, id_slide: string, list: any, index: any) {
      // super(id, num_slide, id_session, list);
      this.id = id;
      this.num_slide = num_slide;
      this.id_cours = id_session;

      this.list = list;
      this.id_slides= id_slides;
      this.id_slide = id_slide;
      this.index =index; 
      
    }

    updateList(list: any): void {
      this.list = list;
    }
  }
  
  export default Data_suivi_rt;
  
  