<script setup lang="ts">
import {ref} from 'vue';
// Definition of the message login will send to its parent
const emit = defineEmits(['response']);

// Store the input username
const username = ref("");
// Store the input password
const pwd = ref("");
// Store error message
const msg_error = ref("");
// Store the id of the user who's connected
const id_user = ref("");

async function login() {
  // Request to login and store the answer in userData
  const {data, pending, error, refresh} = await useFetch(`/user/signin`, {
    method: "POST",
    body: {username: username.value, password: pwd.value}
  });
  const userData = data.value;
  // if the answer is not null, contains no "body" and no "error", update of id_user
  if (userData != null) {
    if (!('body' in userData!)) {
      if (!('error' in userData!)) {
        id_user.value = userData!.id_user;
        emit('response', true, id_user.value);
      }
    }
  } else { // Update of msg_error to display it to the user
    msg_error.value = "Identifiant ou mot de passe incorrect"
  }
}
</script>

<template>
  <h1 class="titre"> INTUIBOARD </h1>
  <div class="form">
    <!-- Input for the username -->
    <p>Identifiant</p>
    <input v-model="username"/>
    <!-- Input for the password -->
    <p>Mot de passe</p>
    <input v-model="pwd" type="password"/>
    <!-- Button to call the login function -->
    <div class="login">
      <button @click="login" class="buttonLogin">Connexion</button>
    </div>
    <!-- Display the error if there is one -->
    <p>{{ msg_error }}</p>
  </div>
</template>

<style scoped>
.titre {
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

p {
  padding: 0;
  margin-top: 5%;
  margin-bottom: 1%;
}

.login {
  display: flex;
  justify-content: center;
  margin-top: 5%;
}

.buttonLogin {
  padding: 5%;
}

input {
  border: none;
  border-bottom: 2px solid #abc4e7;
  background-color: #4a7fc8;
  padding: 3%;
  width: 100%;
}

input:focus {
  border: none;
}
</style>
