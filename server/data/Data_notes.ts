const Data = require('./Data.js');

class Data_notes extends Data {
  constructor(id: number, num_slide: number, id_cours: number, list: any[]) {
    super(id, num_slide, id_cours, list);
  }

    updateList(list : Array<string>){
        this.list = list;
    }
  }
