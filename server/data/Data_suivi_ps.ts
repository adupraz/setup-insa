// Import de l'interface Data
import type { Data } from './Data' ;


class Data_suivi_ps implements Data {
    id : string;
    num_slide: number;
    id_cours: string;

    index: number[]; 

    list : any;

    nb_datas: number;

    retard: number;
    current: number;
    early: number;

    constructor(id: string, id_session: string, num_slide: number, list: any, index: any, nb_datas: number, retard: number, current: number, early: number) {
      this.id = id;
      this.num_slide = num_slide;
      this.id_cours = id_session;

      this.list = list;
      this.index =index; 
      
      this.nb_datas = nb_datas;

      this.retard = retard;
      this.current = current;
      this.early = early;
    }

    updateList(list: any): void {
      this.list = list;
    }
  }
  
  export default Data_suivi_ps;
  
  