<script lang="ts" setup>
import { watch } from 'vue';

const props = defineProps<{
  id?: string,
  answers?: number[],
  nbanswers?: number[],
  correct?: number[],
}>()

function changeGraph(){
  graphData.value.labels = props.answers!;
  graphData.value.datasets[0].data = props.nbanswers!;

  // Used change colors
  colors();
}

function colors(){
  // SETTING OF COLORS
  const documentStyle = getComputedStyle(document.body);
  // Used to alternate colors
  let i = 1;
  graphData.value.datasets[0].backgroundColor = props.correct!.map((n: number) => {
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
