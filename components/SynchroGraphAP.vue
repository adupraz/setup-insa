<script lang="ts" setup>
import Chart from 'primevue/chart';

const chart = ref<Chart>();

// Information given by the parent
const props = defineProps<{
  // id_session of the lesson
  id_session?: string,
}>()

// Store the information of synchronisation for the graph
const data_synchro=ref({
    // legend
    labels: [] as number[],
    // for each element : name, backgroundcolor and the values (initiate at 0)
    datasets:[
        {
            label:"retard",
            backgroundColor:'#dc7878',
            data:[] as number[],
        },
        {
            label:"synchrone",
            backgroundColor:'#83e092',
            data:[] as number[],
        },
        {
            label:"avance",
            backgroundColor:'#f5d75e',
            data:[] as number[],
        },
        {
            label:"quiz",
            backgroundColor:'#4a7fc8',
            data:[] as number[],
        }
    ]
});
// Recover the synchronisation from one session and store its result in list_question

const {data, pending, error, refresh} = await useFetch(`/session/datas/suivi/posteriori/${props.id_session}`);
console.log("data.value");
console.log(data.value);

if(data.value!=null){
    if(!('error' in data.value!)){
      data_synchro.value.labels =  data.value!.slides;
      for(let i = 0;i<data.value.datas_suivi_ps.length;i++){
          data_synchro.value.datasets[0].data.push(data.value.datas_suivi_ps[i].retard);
          data_synchro.value.datasets[1].data.push(data.value.datas_suivi_ps[i].current);
          data_synchro.value.datasets[2].data.push(data.value.datas_suivi_ps[i].early);
      }
      data_synchro.value.datasets[3].data = data.value.nb_question_by_slide;
    }
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
        text: 'Position des élèves',
        display: true,
      },
      stacked: true,
    },
  },
});
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
