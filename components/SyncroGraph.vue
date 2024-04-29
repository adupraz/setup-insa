<script lang="ts" setup>
import Chart from 'primevue/chart';

const chart = ref<Chart>();

// Hardcoded data (array of objects) : x is slide n° and y is time spent on the slide
const data = {
  // X horizontal axis
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
  // Y vertical axis
  datasets: [
    {
      label: 'en retard',
      data: [0, 6, 10, 10, 50, 25, 15, 8, 60, 29, 10, 4, 3, 60, 30, 15, 15, 10, 10, 5],
    },
    {
      label: 'synchrone',
      data: [80, 70, 65, 64, 25, 45, 60, 70, 20, 50, 65, 75, 76, 20, 45, 60, 50, 50, 60, 75],
    },
    {
      label: 'en avance',
      data: [0, 4, 5, 6, 5, 10, 5, 2, 0, 1, 5, 1, 1, 0, 5, 5, 15, 20, 10, 0],
    }
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
      text: 'Synchronisation des élèves',
    },
  },
  // Names of axis
  scales: {
    x: {
      title: {
        text: 'Numéro de slide',
        display: true,
      },
      stacked: true,
    },
    y: {
      title: {
        text: 'Position des élèves',
        display: true,
      },
      stacked: true,
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
