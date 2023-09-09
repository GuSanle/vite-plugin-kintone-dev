<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

// import svg from '@/assets/logo.svg'
import svgPlugin from '~icons/my-icons/logo.svg'
// import logo from '@/assets/logo.svg'
</script>

<template>
  <header>
    <div class="wrapper">
      <!-- <img alt="svg" :src="svg" width="100"> -->
      <svgPlugin alt="svgPlugin" width="100" />

      <HelloWorld msg="You did it!" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.wrapper {
  background-color: white;
  margin: 30px;
  padding: 20px;
}
</style>

