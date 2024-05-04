<script setup lang="ts">
import {ref} from 'vue';
// Information given by the parent
const props = defineProps<{
  // id_session of the lesson
  id_session?: string,
  // "dap" ou "dtr"
  dashboard?: string,
}>()

// Recover all questions from one session and store its result in list_question
const {data, pending, error, refresh} = await useFetch(`/data/promotion?id_session=${props.id_session}`);
const list_question = data.value;

// ID of the question that is display
const selected_question = ref(0);

// Information that is retrieve when a new question is selected
const receivedData = ref({
  // ID question
  id: "",
  // Number associated with each question
  answers: [0],
  // Number of answers per question
  nbanswers: [0],
  // Number associated with the correct answer
  correct: [0],
  // Temps de réponse
  times_tdr: [0.0],
  //slide
  slide: 0,
});

// Store error message
const erreur = ref("");

function changeQuestion() {
  // verification that list_question has no error
  if (!('error' in list_question!.body)) {
    // find the question that must be display and store the different elements in receivedData
    const question = list_question!.body.find((element: any) => element.question_url === selected_question.value);
    receivedData.value.id = question!.id_question;
    receivedData.value.answers = question!.answers_id;
    receivedData.value.nbanswers = question!.list;
    receivedData.value.correct = question!.right_answers;
    receivedData.value.times_tdr = question!.list_tdr;
    receivedData.value.slide = question!.num_slide;
  } else { //if there is an erreur, we store it
    erreur.value = "There is an error"
  }
}
</script>

<template>
  <!-- verification that list_question has no error -->
  <div class="choix" v-if="!('error' in list_question!.body)">
    <!-- verification that list_question contains a least 1 element -->
    <div v-if="list_question!.body.length!=0">
      <!-- menu to chose the question -->
      <select v-model="selected_question" @change="changeQuestion">
        <option v-for="elt in list_question!.body" :key="elt.id_question">
          {{ elt.question_url }}
        </option>
      </select>
      <!-- slide of the question -->
      <p class="choix"> Slide {{ receivedData.slide }}</p>
      <!-- if it's for the dap -->
      <div class="flexrow" v-if="dashboard==='dap'">
        <QuizAnswerGraph :id="receivedData.id" :answers="receivedData.answers" :nbanswers="receivedData.nbanswers"
                         :correct="receivedData.correct"/>
        <TempsReponseGraph :id="receivedData.id" :answers="receivedData.answers" :nbanswers="receivedData.nbanswers"
                           :times="receivedData.times_tdr"/>
      </div>
      <!-- if it's for the dtr or for the comparison -->
      <div class="flexrow" v-else-if="dashboard==='dtr'">
        <QuizAnswerGraph :id="receivedData.id" :answers="receivedData.answers" :nbanswers="receivedData.nbanswers"
                         :correct="receivedData.correct"/>
      </div>
      <!-- if there is an error -->
      <div class="flexrow" v-else>
        <p>Erreur, réessayer</p>
      </div>
    </div>
    <!-- if list_question contains nothing -->
    <div v-else>
      <p>Aucune question à afficher</p>
    </div>
  </div>
  <!-- if there is an error, display it -->
  <div v-else>
    <p>{{ erreur }}</p>
  </div>
</template>

<style scoped>
.flexrow {
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  justify-content: space-around;
}

.choix {
  text-align: center;
}

select {
  min-width: 100px;
}
</style>
