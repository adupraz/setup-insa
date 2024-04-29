<script lang="ts" setup>
import Chart from 'primevue/chart';

const chart = ref<Chart>();

// Hardcoded data (array of objects) : x is slide n° and y is time spent on the slide
const data = {
  // X horizontal axis
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
  // Y vertical axis
  datasets: [{
    label: 'Quantité encre',
    data: [1, 0, 3, 8, 13, 25, 17, 21, 12, 1, 15, 24, 16, 19, 0, 16, 27, 11, 24, 18],
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
      text: 'Quantité prise de note',
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
        text: 'Quantité d encre',
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
