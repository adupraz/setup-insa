<script setup lang="ts">
import {ref} from 'vue';

const emit = defineEmits(['retour'])

const allCours = ref({body: ["SES004", "SES004", "SES004", "SES004"]});

const selectCours = ref("SES002");

defineProps<{
  id_user?: string,
  id_session?:string,
  date?:string,
  nb_student?:number,
  name?:string,
}>()

const chose=ref(false);

const secondcours = ref({
  id_session:"",
  date:"",
  nb_student:0,
  name:"",
})

async function choixCours(id:string) {
  console.log(id);
  const {data, pending, error, refresh} = await useFetch(`/session/${id}`);
  const data_cours = data.value;
  if (!('error' in data_cours!)) {
    secondcours.value.id_session = data_cours!.id_session;
    secondcours.value.date = data_cours!.date;
    secondcours.value.nb_student = data_cours!.nb_student;
    secondcours.value.name = data_cours!.name;
    chose.value=true;
  }
}

function goBack(){
  emit('retour', false);
}
</script>

<template>
  <p class="retour" @click="goBack"><-Retour</p>
  <h1> Comparaison</h1>
  <div class="center" v-if="!('error' in allCours!.body)">
    <select v-model="selectCours" @change="choixCours(selectCours)">
      <option v-for="elt in allCours!.body" :key="elt">
        {{ elt }}
      </option>
    </select>
  </div>
  <div class="flexrow">
    <div>
      <h1>{{name}} - {{ date }}</h1>
      <p>Nombre d'élèves : {{ nb_student }}</p>
      <SyncroGraph/>
      <QuizStruc :id_session="id_session" :dashboard="'dtr'"/>
    </div>
    <div>
      <div v-if="chose">
        <h1>{{ secondcours.name}} - {{ secondcours.date }}</h1>
        <p>Nombre d'élèves : {{ secondcours.nb_student }}</p>
        <SyncroGraph/>
        <QuizStruc :id_session="secondcours.id_session" :dashboard="'dtr'"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1{
  margin-bottom:0;
}
.retour{
  text-align: left;
  text-decoration: underline;
}
.flexrow{
  display:flex;
  flex-wrap:nowrap;
  justify-content: space-evenly;
}

@media screen and (max-width: 800px) {
  .flexrow{
    display:flex;
    flex-wrap:wrap;
    justify-content: space-evenly;
  }
}
.center{
  display: flex;
  justify-content: center;
}
</style>
