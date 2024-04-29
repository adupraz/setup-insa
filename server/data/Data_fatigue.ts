
import type { Data } from './Data';

class DataFatigue extends Data {
  fatigues : Array<string>
  constructor() {
    super();
    this.fatigues = new Array().fill(0);
  }


  /**
   * Enregistre la réponse d'un étudiant à la question de la fatigue.
   * @param {number} responseIndex - L'index représentant la réponse de l'étudiant.
   */
  /*
  recordResponse(responseIndex) {
    this.fatigues[responseIndex]++;
  }


   */
  /**
   * Calcule la réponse moyenne à la question de la fatigue.
   * @returns {number} La réponse moyenne, ou 0 si aucune réponse n'a été enregistrée.
   */
  /*
  averageResponse() {
    // Calcule le nombre total de réponses
    const totalResponses = this.fatigues.reduce((sum, count) => sum + count, 0);

    // Calcule la somme pondérée des réponses et retourne la moyenne s'il y a des réponses, sinon retourne 0
    return totalResponses > 0 ?
      this.fatigues.reduce((sum, count, index) => sum + index * count, 0) / totalResponses : 0;
  }

   */

}

module.exports = DataFatigue;
