<script lang="ts" setup>
import {watch} from 'vue';
// Information given by the parent
const props = defineProps<{
  // ID question
  id?: string,
  // Number associated with each question
  answers?: string[],
  // Number of answers per question
  nbanswers?: number[],
  // Number associated with the correct answer : 1 is for a correct answer, 0 otherwise
  correct?: number[],
}>()

function changeGraph() {
  // initialization of the legend with numbers (can't recover the answers in IntuiNote)
  graphData.value.labels = [1];
  for (const i = ref(1); i.value < props.answers!.length; i.value++) {
    graphData.value.labels.push(i.value+1);

  }
  // add the number of answers for each one
  graphData.value.datasets[0].data = props.nbanswers!;
  // Change colors
  colors();
}

function colors() {
  // SETTING OF COLORS
  const documentStyle = getComputedStyle(document.body);
  // If correct has at least one value
  if (props.correct!.length>0){
    let i = 1;
    graphData.value.datasets[0].backgroundColor = props.correct!.map((n: number) => {
      i += 1 % 5;
      return n == 1
          ? documentStyle.getPropertyValue(`--green-${i}00`) // correct answer
          : documentStyle.getPropertyValue(`--red-${i}00`); // wrong answer
    });
  }else{ // if there is nothing in correct
    let i = 1;
    graphData.value.datasets[0].backgroundColor = props.answers!.map(() => {
      i += 1 % 5;
      return documentStyle.getPropertyValue(`--blue-${i}00`);
    });
  }
}

/// Data of the graph
const graphData = ref({
  // X horizontal axis : The answers
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

// if props change, the function "changeGraph" is called
watch(props, changeGraph);
</script>

<template>
  <!-- GRAPH -->
  <Chart
      ref="graphQuestion"
      :data="graphData"
      :options="options"
      class="h-30rem"
      type="pie"
  />
</template>
