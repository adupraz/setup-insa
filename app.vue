<script lang="ts" setup>
import 'primevue/resources/themes/lara-light-teal/theme.css';
import 'primeflex/primeflex.css';
import Navbar from "~/components/navbar.vue";

/*

const { data: data_question, error } = useFetch(async () => {
  const response = await fetch('/routes/promotions')
  return response.json()
})

const questions = ref(data_question)

 */

</script>

<template>
  <!-- CONTAINER -->
  <div class="w-full h-full">
    <!-- PAGE content (variable depending on route) -->
    <NuxtPage/>
  </div>
</template>

<style>
body, #__nuxt {
  height: 100dvh;
  background-color:#faf4f2;
}
</style>


