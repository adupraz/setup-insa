<script lang="ts" setup>
import Chart from 'primevue/chart';
import {watch} from "vue";

const props = defineProps<{
  id?: string,
  answers?: number[],
  nbanswers?: number[],
  times?: number[],
}>()

const chart = ref<Chart>();

function changeGraph() {
  data.value.labels = props.answers!;
  data.value.datasets[0].data = props.times!;
}

// Hardcoded data (array of objects) : x is the answers and y is time spent to answer (on average)
const data = ref({
  // X horizontal axis
  labels: [] as number[],
  // Y vertical axis
  datasets: [{
    data: [] as number[],
  }],
});

// Graph config
const options = ref({
  // Visual options for responsiveness (adaptation to different screen sizes)
  responsive: true,
  maintainAspectRatio: false,
  // Legend (of dataset -> not display) and title (of graph)
  plugins: {
    legend: {
      // display:false,
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
