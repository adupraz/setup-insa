<script setup lang="ts">
import {ref} from 'vue';
import SynchroGraphAP from "~/components/SynchroGraphAP.vue";

const props = defineProps<{
    id_user?: string,
    id_session?:string,
    date?:string,
    nb_student?:number,
    name?:string,
}>()

const emit = defineEmits(['retour'])

// Creation of an interface to store the information of one lesson
interface Cours {
    id_session: string;
    date: string;
    name: string;
    nb_student: number;
}

// Creation of an interface to store a list of type Cours
interface ListCours {
    lessons: Cours[];
}

// Store a list of lessons
const list_cours = ref<ListCours>({
    lessons: []
})

const selectCours = ref("");

const chose=ref(false);

const secondcours = ref({
  id_session:"",
  date:"",
  nb_student:0,
  name:"",
})

// Request to retrieve all the session of the connected user and store it in dataCours
const {data, pending, error, refresh} = await useFetch(`/user/sessions/${props.id_user}`);
const dataCours = data.value;
// if dataCours contains no "body" attribut -> if it contains no error
if (!('body' in dataCours!)) {
    // Store each lesson of dataCours in list_cours
    for (const i = ref(0); i.value < dataCours!.length; i.value++) {
        list_cours.value.lessons.push({id_session: dataCours![i.value]!.id_session, date: dataCours![i.value]!.date, name: dataCours![i.value]!.name, nb_student: dataCours![i.value]!.nb_student});
    }
}

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
  <div class="center" v-if="!('error' in list_cours!)">
    <select v-model="selectCours" @change="choixCours(selectCours)">
      <option v-for="elt in list_cours.lessons" :value="elt.id_session">
        {{ elt.name }} - {{ elt.date }}
      </option>
    </select>
  </div>
  <div class="flexrow">
    <div>
      <h1>{{name}} - {{ date }}</h1>
      <p>Nombre d'élèves : {{ nb_student }}</p>
      <SynchroGraphAP :id_session="id_session"/>
      <QuizStruc :id_session="id_session" :dashboard="'dtr'"/>
    </div>
    <div>
      <div v-if="chose">
        <h1>{{ secondcours.name}} - {{ secondcours.date }}</h1>
        <p>Nombre d'élèves : {{ secondcours.nb_student }}</p>
        <SynchroGraphAP :id_session="secondcours.id_session"/>
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
