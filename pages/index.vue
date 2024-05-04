<script lang="ts" setup>
import Navbar from "~/components/navbar.vue";
import DAP from "~/components/DAP.vue";
// Store if a user is connected
const connected = ref(false);
// Store the id of the connected user
const id_user = ref("");

// Store the information of a lesson and the value of "select" adapt the page
const cours = ref({
  id_session: "",
  date: "",
  nb_student: 0,
  name: "",
  //"choisir" if no lesson has been chosen, "DAP" to display it, "DTR" to display it
  select: "choisir",
});

function goDTR() {
  cours.value.select = "DTR";
}

function goDAP() {
  cours.value.select = "DAP";
}
</script>

<!-- MAIN PAGE content -->
<template>
  <main>
    <!-- if no user is connected -->
    <div v-if="!connected" class="main">
      <!-- login component -> index recover the information of the user-->
      <login @response="(msg:boolean, id:string) => {connected = msg; id_user = id}"/>
    </div>
    <div v-else>
      <!-- navbar component -> index :
       1. send the id_user
       2.1. recover the information of a lesson
       2.2. recover if the user log out
       -->
      <navbar :id_user="id_user"
              @info_cours="(id:string,date:string,nb:number,name:string,s:string) => {cours.id_session=id; cours.date=date; cours.nb_student=nb; cours.name=name; cours.select=s; } "
              @logout="(msg:boolean) => {connected = msg; cours.select='choisir';}"/>
      <!-- if no session has been chosen-->
      <h2 v-if="cours.select === 'choisir'"> Veuillez choisir un cours via l'icone en haut à gauche</h2>
      <!-- if a session was chosen but no dashboard-->
      <div v-else-if="cours.select === 'choisi'">
        <h1> {{ cours.name }} - {{ cours.date }}</h1>
        <h2> Veuillez choisir le dashboard à visionner</h2>
        <!-- two buttons to chose the dashboard to display-->
        <div class="center">
          <button @click="goDTR">Dashboard en temps réel</button>
          <button @click="goDAP">Dashboard a posteriori</button>
        </div>
      </div>
      <!-- to display the dap -> index :
      1. send the id of the user and the information of the selected cours
      2. recover if the user went back
      -->
      <DAP v-else-if="cours.select === 'DAP'" @retour="(msg:string) => cours.select = msg" :id_user="id_user"
           :id_session="cours.id_session" :date="cours.date" :nb_student="cours.nb_student" :name="cours.name"/>
      <!-- to display the dtr -> index :
      1. send the id of the user and the information of the selected cours
      2. recover if the user went back
      -->
      <DeTR v-else-if="cours.select === 'DTR'" @retour="(msg:string) => cours.select = msg"
            :id_session="cours.id_session" :date="cours.date" :nb_student="cours.nb_student" :name="cours.name"/>
      <!-- if there is an error -->
      <h1 v-else>Erreur, réessayez</h1>
    </div>
  </main>
</template>

<style>
h1, h2 {
  text-align: center;
}

.main {
  background-color: #abc4e7;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100dvh;
}

button {
  margin: 1%;
  background-color: #abc4e7;
  border: #9bbbe8;
  border-radius: 5%;
  padding: 1%;
  align-self: center;
}

.center {
  display: flex;
  justify-content: center;
}
</style>
