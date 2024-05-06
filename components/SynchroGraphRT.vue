<script setup lang="ts">
import Chart from 'primevue/chart';
import {ref} from 'vue';

const chart = ref<Chart>();

// Information given by the parent
const props = defineProps<{
  // id_session of the lesson
  id_session?: string,
}>()

// Store the information of synchronisation for the graph
const data_synchro=ref({
  // legend
  labels: ["45s", "30s", "15s", "0s"],
  // for each element : name, backgroundcolor and the values (initiate at 0)
  datasets:[
    {
      label:"retard",
      backgroundColor:'#dc7878',
      data:[0,0,0,0],
    },
    {
      label:"synchrone",
      backgroundColor:'#83e092',
      data:[0,0,0,0],
    },
    {
      label:"avance",
      backgroundColor:'#f5d75e',
      data:[0,0,0,0],
    },
    {
      label:"quiz",
      backgroundColor:'#4a7fc8',
      data:[0,0,0,0],
    }
  ]
});

async function recoverSynchronisation(){
  // Recover the synchronisation from one session and store its result in list_question
  const {data, pending, error, refresh} = await useFetch(`/session/datas/suivi/reeltime/${props.id_session}`);
  if(data.value!=null){
    if (!('error' in data.value!)){
      // for each data, call removeAndAdd to modify each data and add the new synchro values and the quiz
      data_synchro.value.datasets[0].data = removeAndAdd(data_synchro.value.datasets[0].data, data.value.retard);
      data_synchro.value.datasets[1].data = removeAndAdd(data_synchro.value.datasets[1].data, data.value.en_phase);
      data_synchro.value.datasets[2].data = removeAndAdd(data_synchro.value.datasets[2].data, data.value.avance);
      data_synchro.value.datasets[3].data = removeAndAdd(data_synchro.value.datasets[3].data, data.value.nb_question);
    }
  }
}

// function to remove the first element of a tab, shift all remaining element and add a new one.
function removeAndAdd(tab: number[], elt:number){
  // shift all the element
  for (let i = 0; i<tab.length-1;i++){
    tab[i] = tab[i+1];
  }
  // add the new element
  tab[tab.length-1]=elt;
  return tab;
}

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
        text: 'Nombre d\'élèves',
        display: true,
      },
      stacked: true,
    },
  },
});

onMounted(() => {
  // to call the function "recoverSynchronisation" every 1min (=60000ms)
  const interval = window.setInterval(()=>{recoverSynchronisation()}, 15000);
  // before unmount, clear interval
  onBeforeUnmount(()=>{
    window.clearInterval(interval);
  });
})
</script>

<template>
  <!-- GRAPH -->
  <Chart
      ref="chart"
      :data="data_synchro"
      :options="options"
      class="h-30rem"
      type="bar"

  />
</template>
