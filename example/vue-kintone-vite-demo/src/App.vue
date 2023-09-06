<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import logo from '~icons/my-icons/logo.svg'
</script>

<template>
  <header>
    <div class="wrapper">
      <logo class="tabbar-icon" alt="Vue logo" width="125" height="125" />
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

