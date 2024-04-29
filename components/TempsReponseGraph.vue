<script lang="ts" setup>
import Chart from 'primevue/chart';

const chart = ref<Chart>();

// Hardcoded data (array of objects) : x is slide n° and y is time spent on the slide
const data = {
  // X horizontal axis
  labels: ['1 min', '2 min', '3 min'],
  // Y vertical axis
  datasets: [
    {
      label: 'Réponse 1',
      data: [0, 16, 6],
    },
    {
      label: 'Réponse 2',
      data: [3, 28, 4],
    },
    {
      label: 'Réponse 3',
      data: [15, 7, 1],
    },
  ],
};

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
      text: 'Temps passé par réponse',
    },
  },
  // Names of axis
  scales: {
    x: {
      title: {
        text: 'Temps en minutes',
        display: true,
      },
      stacked:true,
    },
    y: {
      title: {
        text: 'Nombre de réponses',
        display: true,
      },
      stacked:true,
    },
  },
});

function addData() {
  data.labels.push(data.labels.at(-1)! + 1);
  data.datasets[0].data.push(Number.parseInt(`${Math.random() * 140}`, 10));
  chart.value!.refresh();
}
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
