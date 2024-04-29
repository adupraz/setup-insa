<script setup lang="ts">
const info = ref("a")

const allCours=ref({body:[0,1,2,3]});

const selectCours=ref(allCours.value.body[0]);

function choixCours() {
  info.value="choix";
}
function logout(){
  info.value="logout";
}
</script>

<template>
  <div class="main">
    <div class="choix" id="selectIdQuestion" v-if="!('error' in allCours!.body)">
      <select v-model="selectCours" @change="choixCours">
        <option v-for="elt in allCours!.body" :key="elt">
          {{ elt }}
        </option>
      </select>
    </div>

    <h1 class="nom">IntuiBoard</h1>
    <img class="logout" src="../assets/log_out.png" alt="deconnexion" @click="logout()">
  </div>
</template>

<style scoped>
.main {
  display : grid;
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-areas: "cours nom logOut";
  justify-content: space-between;
  background-color:#abc4e7;
  text-align : center;
  align-items: center;
  justify-items: center;
}
.choix{
  grid-area:cours;
}
.nom{
  grid-area:nom;
}
.logout{
  grid-area:logOut;
}
select{
  padding: 5%;
  background-color: #6887b2;
  border-radius: 10%;
}
img{
  width: 20%;
  min-width:30px;
  height: auto;
  padding: 1%;
  border-radius: 10%;
  border-color: #6887b2;
  background-color: #6887b2;
}
</style>
