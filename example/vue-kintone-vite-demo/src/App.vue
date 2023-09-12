<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'

// import svg from '@/assets/logo.svg'
import svgPlugin from '~icons/my-icons/logo.svg'
import TheWelcome from './components/TheWelcome.vue';
// import logo from '@/assets/logo.svg'
</script>

<template>
  <header>
    <div class="wrapper">
      <!-- <img alt="svg" :src="svg" width="100"> -->
      <svgPlugin alt="svgPlugin" width="100" />
      <HelloWorld msg="You did it!" />
      <TheWelcome />
    </div>
  </header>
</template>

<style scoped>
.wrapper {
  background-color: white;
  margin: 30px;
  padding: 20px;
}
</style>

