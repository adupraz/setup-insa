<script setup lang="ts">
import {ref} from 'vue';
import QuizStruc from "~/components/QuizStruc.vue";
import Comparaison from "~/components/Comparaison.vue";
import SynchroGraphAP from "~/components/SynchroGraphAP.vue";

const emit = defineEmits(['retour'])

const props = defineProps<{
  id_user?: string,
  id_session?: string,
  date?: string,
  nb_student?: number,
  name?: string,
}>()

const compare = ref(false);

function comparer() {
  compare.value = !compare.value;
}

async function supprimer(id:string) {
    const yes = confirm("Etes vous sûr?");
    if (yes) {
      const {data, pending, error, refresh} = await useFetch(`/session/${id}`, {method:"delete" });
      const data_cours = data.value;
      if ('error' in data_cours!){
        alert("Le cours n'a pas pu être supprimé");
      }else{
        emit('retour', "choisi");
      }
    }
}

function goBack(){
  emit('retour', "choisi");
}
</script>

<template>
  <div v-if="!compare">
    <p class="retour" @click="goBack"><-Retour</p>
    <div>
      <h1>{{ props.name }} - {{ props.date }}</h1>
      <p>Nombre d'élèves : {{ props.nb_student }}</p>
    </div>
    <div class="headPage">
      <button @click="comparer">Comparer</button>
      <button @click="supprimer(props.id_session!)">Supprimer</button>
    </div>

    <div class="flexcolumn">
      <SynchroGraphAP :id_session="id_session"/>
      <!--      <div class="flexrow">-->
<!--        <div class="a">-->
<!--          <SyncroGraph/>-->
<!--        </div>-->
<!--&lt;!&ndash;        <div class="prisenote a">&ndash;&gt;-->
<!--&lt;!&ndash;          <PriseNoteGraph/>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--      </div>-->
      <QuizStruc :id_session="id_session" :dashboard="'dap'"/>
    </div>
  </div>
  <div v-else>
    <Comparaison @retour="(msg:boolean) => compare=msg" :id_user="id_user" :id_session="id_session" :date="date" :nb_student="nb_student"
                 :name="name"/>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 0;
}
p {
  text-align: center;
}
.retour{
  text-align: left;
  text-decoration: underline;
}
.headPage {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-top:1%;
}

button {
  margin-top: 0;
  background-color: #abc4e7;
  border-radius: 5%;
  padding: 1%;
}

.flexrow {
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
}

.flexcolumn {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  flex-wrap: nowrap;
}

.a {
  flex-basis: 50%;
}

img {
  width: auto;
  height: auto;
  min-width: 30px;
  max-width: 50px;
  padding: 0%;
  border-radius: 10%;
  border-color: #6887b2;
  background-color: #6887b2;
}
</style>
