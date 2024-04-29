<script setup lang="ts">
import {ref} from 'vue';

const cours = ref("Cours non encore choisi")

function comparer(){
  console.log("je compare");
}

function supprimer(){
  const yes = confirm("Are you sure?");
  if(yes){
    console.log("route pour supprimer")
  }
}

</script>

<template>
  <h1>{{cours}}</h1>
  <div class="headPage">
    <button @click="comparer">Comparer</button>
    <button @click="supprimer">Supprimer</button>
  </div>
  <div class="flexcolumn">
    <div class="flexrow">
      <div class="synchro a">
        <SyncroGraph/>
      </div>
      <div class="prisenote a">
        <PriseNoteGraph/>
      </div>
    </div>
    <hr>
    <div class="flexrow">
      <div class="questions a">
        <QuizAnswerGraph/>
      </div>
      <div class="tempsreponse a">
        <TempsReponseGraph/>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1{
  margin-bottom:0;
}
.headPage{
  display:flex;
  flex-wrap:nowrap;
  justify-content: space-between;
}
button {
  margin-top: 5%;
  background-color:#abc4e7;
  border-radius:5%;
  padding:1%;
}
.flexrow{
  display:flex;
  flex-grow:1;
  flex-wrap:wrap;
}
.flexcolumn{
  display:flex;
  flex-grow:1;
  flex-direction:column;
  flex-wrap:nowrap;
}
.a{
  flex-basis:50%;
}
</style>
