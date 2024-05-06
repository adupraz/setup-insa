<script lang="ts" setup>
import Chart from 'primevue/chart';
import {watch} from "vue";

// Information given by the parent
const props = defineProps<{
  // ID question
  id?: string,
  // Responses time
  times?: number[][],
}>()

// Reference of the graph
const chart = ref<Chart>();

function changeGraph() {
  // Add the first data in datasets -> erase the others data in it from the question before
  data.value.datasets = [{label:1, data:props.times![0]}];
  // Add the remaining data
  for(const i=ref(1);i.value<props.times!.length;i.value++){
    data.value.datasets.push({label:i.value+1, data:props.times![i.value]});
  }
  // Display the legend
  options.value.plugins.legend.display = true;
}

// Store the data of the graph
const data = ref({
  // X horizontal axis : Responses time
  labels: ['<30s','30s-2min','>2min'],
  // Y vertical axis : how much, each answer, has people for each labels
  datasets: [{}] as [{label: number, data: number[]}],
});

// Graph config
const options = ref({
  // Visual options for responsiveness (adaptation to different screen sizes)
  responsive: true,
  maintainAspectRatio: false,
  // Legend (of dataset -> not display) and title (of graph)
  plugins: {
    legend: {
      display:false,
    },
    title: {
      display: true,
      text: 'Temps de réponse',
    },
  },
  // Names of axis
  scales: {
    x: {
      title: {
        text: 'Temps de réponse',
        display: true,
      },
      stacked: true,
    },
    y: {
      title: {
        text: 'Nombre de réponses',
        display: true,
      },
      stacked: true,
    },
  },
});

// If props change, the function 'changeGraph' is called
watch(props, changeGraph);
</script>

<template>
  <!-- GRAPH -->
  <Chart
      ref="chart"
      :data="data"
      :options="options"
      class="h-30rem"
      type="bar"
  />
</template>
