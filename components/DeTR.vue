<script setup lang="ts">
import QuizStruc from "~/components/QuizStruc.vue";
import SynchroGraphRT from "~/components/SynchroGraphRT.vue";

const emit = defineEmits(['retour'])

defineProps<{
  id_session?: string,
  date?: string,
  nb_student?: number,
  name?: string,
}>()

function goBack(){
  emit('retour', "choisi");
}
</script>

<template>
  <p class="retour" @click="goBack"><-Retour</p>
  <div>
    <h1>{{ name }} - {{ date }}</h1>
    <p>Nombre d'élèves : {{ nb_student }}</p>
  </div>
  <div class="flexrow">
    <div>
      <SynchroGraphRT :id_session="id_session"/>
    </div>
    <div>
      <QuizStruc :id_session="id_session" :dashboard="'dtr'"/>
    </div>
  </div>
</template>

<style scoped>
p{
  text-align:center;
}
.retour{
  text-align: left;
  text-decoration: underline;
}
.flexrow {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
