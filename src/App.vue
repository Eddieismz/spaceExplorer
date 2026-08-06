<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <!-- The header stays at the top of every page -->
    <Header />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
</script>
