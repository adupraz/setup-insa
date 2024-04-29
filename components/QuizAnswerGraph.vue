<script lang="ts" setup>
// ID of the session
const session = ref('53a7c105-36f3-4965-84f1-baa2d4798b2a');
// URL to fetch the informations of Data_Question -> the session id must be added to the url
const url = ref('/routes/data/promotion?id_session=');

// Recover all questions from one session
const { data, pending, error, refresh } = await useFetch('/data/promotion?id_session=53a7c105-36f3-4965-84f1-baa2d4798b2a');
const allQuestions = data.value;
// ID of the question we want to display the answers
const selectedQuestion = ref(0);
// Hardcoded data that could have been fetched from server
const receivedData = ref({
  // Number associated with each question
  answers: [1, 2, 3, 4],
  // Number of answers per question
  nbanswers: [7, 12, 42, 20],
  // Number associated with the correct answer
  correct: [1, 3],
});
function changeQuestion(){
  if (!('error' in allQuestions!.body)){
    //allQuestions! -> it means allQuestions is not null
    const question = allQuestions!.body.find((element:any) => element.question_url === selectedQuestion.value);
    receivedData.value.answers = question!.answers_id;
    receivedData.value.nbanswers = question!.list;
    receivedData.value.correct = question!.right_answers;

    // selectedQuestion.value = question!.id_question;
    graphData.value.labels = receivedData.value.answers;
    graphData.value.datasets[0].data = receivedData.value.nbanswers;

    // Used change colors
    colors();
  }
}

function colors(){
  // SETTING OF COLORS
  const documentStyle = getComputedStyle(document.body);
  // Used to alternate colors
  let i = 1;
  graphData.value.datasets[0].backgroundColor = receivedData.value.correct.map((n: number) => {
    i += 1 % 5;
    return n==1
      //return n === receivedData.value.correct
      ? documentStyle.getPropertyValue(`--green-${i}00`)
      : documentStyle.getPropertyValue(`--red-${i}00`);
  });
}

/// Hardcoded data (array of objects)
const graphData = ref({
  // X horizontal axis : The questions
  labels: [] as number[],
  // Y vertical axis : The number of answers per question
  datasets: [{
    label: 'Nombre de réponses',
    data: [] as number[],
    backgroundColor: [] as string[],
  }],
});

// Graph config
const options = ref({
  // Visual options for responsiveness (adaptation to different screen sizes)
  responsive: true,
  maintainAspectRatio: false,
  // Legend (of dataset) and title (of graph)
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Question du QCM',
    },
  },
});

onMounted(() => {
  // After having fetched the information, we must process it
  graphData.value.labels = receivedData.value.answers;
  graphData.value.datasets[0].data = receivedData.value.nbanswers;

  // SETTING OF COLORS
  const documentStyle = getComputedStyle(document.body);

  // Used to alternate colors
  let i = 1;
  graphData.value.datasets[0].backgroundColor = receivedData.value.answers.map((n: number) => {
    i += 1 % 5;
    return receivedData.value.correct.includes(n)
    //return n === receivedData.value.correct
      ? documentStyle.getPropertyValue(`--green-${i}00`)
      : documentStyle.getPropertyValue(`--red-${i}00`);
  });
});

</script>

<template>
  <div id="selectIdQuestion" v-if="!('error' in allQuestions!.body)">
    <select v-model="selectedQuestion" @change="changeQuestion">
      <option v-for="elt in allQuestions!.body" :key="elt.id_question">
        {{ elt.question_url }}
      </option>
    </select>
  </div>
  <div v-else>
    <p>Aucune question à afficher</p>
  </div>
  <!-- GRAPH -->
  <Chart
    ref="graphQuestion"
    :data="graphData"
    :options="options"
    class="h-30rem"
    type="pie"
  />
</template>
