

class DataSuivi extends Data {
  constructor(id: number, num_slide: number, id_cours: number, list: any) {
    super(id, num_slide, id_cours, list);
  }

  updateList(list: any): void {
    this.list = list;
  }
}

export default DataSuivi;

