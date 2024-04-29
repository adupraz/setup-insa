<script lang="ts" setup>
import Chart from 'primevue/chart';

const chart = ref<Chart>();

// Hardcoded data (array of objects) : x is slide n° and y is time spent on the slide
const data = {
  // X horizontal axis
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
  // Y vertical axis
  datasets: [{
    label: 'Temps en secondes',
    data: [15, 67, 56, 41, 67, 89, 69, 23, 89, 123, 45, 79, 97, 69, 97, 119, 21, 64, 78, 52, 12, 89, 120, 76, 35],
  }],
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
      text: 'Temps passé par Slide',
    },
  },
  // Names of axis
  scales: {
    x: {
      title: {
        text: 'Numéro de slide',
        display: true,
      },
    },
    y: {
      title: {
        text: 'Temps en secondes',
        display: true,
      },
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
