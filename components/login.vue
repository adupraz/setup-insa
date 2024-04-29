<script setup lang="ts">
import {ref} from 'vue';

const emit = defineEmits(['response'])

const username = ref("");
const pwd = ref("");
const error = ref("")

function login() {
  console.log(username.value);
  console.log(pwd.value);
  if (username.value === "") {
    emit('response', true);
  } else {
    error.value = "Identifiant ou mot de passe incorrect"
  }
}
</script>

<template>
  <h1 class="titre"> INTUIBOARD </h1>
  <div class="form">
    <p>Identifiant</p>
    <input v-model="username" placeholder="Identifiant"/>
    <p>Mot de passe</p>
    <input v-model="pwd" type="password" placeholder="Mot de passe"/>
    <button @click="login">Connexion</button>
    <p>{{ error }}</p>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

.titre{
  padding-top: 5%;
}

.form {
  width: 30%;
  background-color: #4a7fc8;
  border-radius: 2%;
  margin: 5%;
  padding: 2%;
}

@media screen and (max-width: 800px) {
  .form {
    width: 80%;
    background-color: #4a7fc8;
    border-radius: 2%;
    margin: 5%;
    padding: 2%;
  }
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
