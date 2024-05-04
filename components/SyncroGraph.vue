<script lang="ts" setup>
import Chart from 'primevue/chart';

const chart = ref<Chart>();

// Hardcoded data (array of objects) : x is slide n° and y is time spent on the slide
const data = {
  // X horizontal axis
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  // Y vertical axis
  datasets: [
    {
      label: 'en retard',
      backgroundColor:'#dc7878',
      data: [0, 7, 10, 6, 28, 19, 9, 8, 30, 25, 10, 4, 3, 5, 12, 15, 15, 10, 10, 5],
    },
    {
      label: 'synchrone',
      backgroundColor:'#83e092',
      data: [80, 69, 65, 68, 48, 51, 60, 70, 50, 50, 63, 75, 76, 65, 63, 60, 50, 50, 60, 75],
    },
    {
      label: 'en avance',
      backgroundColor:'#f5d75e',
      data: [0, 4, 5, 6, 4, 10, 11, 2, 0, 5, 7, 1, 1, 10, 5, 5, 15, 20, 10, 0],
    },
    {
      label: 'Quiz',
      backgroundColor:'#4a7fc8',
      data: [0, 1, 1, 2, 0, 1, 0, 1, 0, 1, 2, 1, 1, 0, 2, 1, 0, 1, 1, 3],
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
