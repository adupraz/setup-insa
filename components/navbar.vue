<script setup lang="ts">
import {ref} from "vue";
// Information given by the parent (id_user of the connected user)
const props = defineProps<{
  id_user?: string;
}>()

// Definition of the message navbar will send to its parent
const emit = defineEmits(['info_cours', "logout"])

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
// Store the lesson that is display
const selectCours = ref("");

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

async function choixCours(id: string) {
  // Request to retrieve the information of the session selected and store its answer in data_cours
  const {data, pending, error, refresh} = await useFetch(`/session/${id}`);
  const data_cours = data.value;
  // if there is no error, send the information of the session to its parents
  if (!('error' in data_cours!)) {
    const id = data_cours!.id_session;
    const date = data_cours!.date;
    const nb = data_cours!.nb_student;
    const name = data_cours!.name;
    emit('info_cours', id, date, nb, name, 'choisi');
  }else{ // if there is an error, send a message to its parents
    emit('info_cours', "", "", 0, "", 'Erreur');
  }
}

function logout() {
  console.log("TODO : logout with the server");
  // Inform the parent that the user is deconnected
  emit("logout", false);
}
</script>

<template>
  <div class="main">
    <div class="choix">
      <!-- menu to chose the session -->
      <select v-model="selectCours" @change="choixCours(selectCours)">
        <option v-for="elt in list_cours.lessons" :value="elt.id_session">
          {{ elt.name }} - {{ elt.date }}
        </option>
      </select>
    </div>
    <h1 class="nom">IntuiBoard</h1>
    <!-- image that act as a button for the deconnection-->
    <img class="logout" src="../assets/log_out.png" alt="deconnexion" @click="logout()">
  </div>
</template>

<style scoped>
.main {
  display: grid;
  grid-template-columns: 20% 60% 20%;
  grid-template-areas: "cours nom logOut";
  justify-content: space-between;
  background-color: #abc4e7;
  text-align: center;
  align-items: center;
  justify-items: center;
  height: auto;
}
.choix {
  grid-area: cours;
}
.nom {
  grid-area: nom;
}
.logout {
  grid-area: logOut;
  width: 20%;
  min-width: 30px;
  height: auto;
  padding: 1%;
  border-radius: 10%;
  border-color: #6887b2;
  background-color: #6887b2;
}

select {
  padding: 5%;
  background-color: #6887b2;
  border-radius: 10%;
  width: 150px;
}

@media screen and (max-width: 800px) {
  select {
    padding: 5%;
    background-color: #6887b2;
    border-radius: 10%;
    width: 50px;
  }
}
</style>
