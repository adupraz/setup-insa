<script lang="ts" setup>
import PriseNoteGraph from "~/components/PriseNoteGraph.vue";
import Navbar from "~/components/navbar.vue";
import DAP from "~/components/DAP.vue";

const connected = ref(false)

// 'choisir' si le cours n'a pas été choisi, 'DAP' si DAP à affiché, DTR si DTR à afficher
// const select = ref('choisir')
const select = ref('DAP')

</script>

<!-- MAIN PAGE content -->
<template>
  <main>
    <div v-if="!connected" class="main w-full h-full">
      <login @response="(msg:boolean) => connected = msg"/>
    </div>
    <div v-else>
      <!-- NAVIGATION -->
      <navbar/>
      <h1 v-if="select === 'choisir'"> Veuillez choisir un cours via l'icone en haut à gauche</h1>
      <DAP v-else-if="select === 'DAP'"/>
      <DeTR v-else-if="select === 'DTR'"/>
      <h1 v-else>Erreur, réessayez</h1>
    </div>
  </main>
</template>

<style>
h1 {
  text-align: center;
}
.main {
  background-color: #abc4e7;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  margin-top: 5%;
  background-color:#abc4e7;
  border-radius:5%;
  padding:5%;
}

input {
  width: 100%;
}
</style>
