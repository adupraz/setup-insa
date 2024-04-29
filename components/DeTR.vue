<script setup lang="ts">
import {ref} from 'vue';

const cours = ref("DTR")

</script>

<template>
  <h1>{{ cours }}</h1>
  <div class="flexrow">
    <div class="flexcolumn">
      <div class="synchro a">
        <p>Nombre d'élèves</p>
      </div>
      <div class="prisenote a">
        <p>Synchro</p>
      </div>
    </div>
    <div class="questions a">
      <QuizAnswerGraph/>
    </div>
  </div>
</template>

<style scoped>
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
</style>
