<script setup lang="ts">
// Import SVG using unplugin-icons
import IconLogo from '~icons/my-icons/logo'

// You can also import using traditional URL method (for demonstration)
import LogoURL from './assets/logo.svg'
</script>

<template>
  <div class="wrapper">
    <div class="logo-container">
      <!-- Method 1: Using unplugin-icons as component -->
      <div class="logo-box">
        <IconLogo class="logo" />
        <p>Method 1: Using Component</p>
      </div>

      <!-- Method 2: Using URL reference -->
      <div class="logo-box">
        <img :src="LogoURL" alt="Logo" class="logo" />
        <p>Method 2: Using URL</p>
      </div>
    </div>

    <h1>Vue Development Demo</h1>
    <p>This is a sample project using vite-plugin-kintone-dev</p>
    <p>This example demonstrates how to handle static resources in a Kintone plugin</p>
  </div>
</template>

<style scoped>
.wrapper {
  background-color: white;
  margin: 30px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
}

.logo-box {
  text-align: center;
}

.logo {
  width: 80px;
  height: 80px;
}

h1 {
  color: #3498db;
  text-align: center;
}

p {
  text-align: center;
}
</style>
