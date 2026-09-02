<template>
  <div class="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-10">
      <h1 class="text-4xl font-bold mb-8 text-teal-600">Photo of the Day</h1>

      <div v-if="isLoading" class="text-xl animate-pulse">Fetching from NASA API...</div> <!-- loading spinner -->

      <div v-else-if="error" class="text-red-500 bg-red-100/10 p-4 rounded-lg">
        Error: {{ error }}
      </div>

      <div v-else-if="astronomyData" class="max-w-3xl bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        <img :src="astronomyData.url" :alt="astronomyData.title" class="w-full h-400px object-cover" />
        <div class="p-6">
          <h2 class="text-2xl font-semibold mb-2">{{ astronomyData.title }}</h2>
          <p class="text-slate-400 text-sm mb-4">{{ astronomyData.date }}</p>
          <p class="text-slate-300 leading-relaxed">{{ astronomyData.explanation }}</p>
        </div>
      </div>

    <button
      @click="fetchApodData"
      class="mt-8 px-6 py-3 bg-teal-600 hover:bg-teal-800 rounded-lg font-semibold transition-colors">
      Reload Data
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNasaStore } from '@/stores/nasaStore'

// Get the store instance
const nasaStore = useNasaStore()

// Destructure reactive state with storeToRefs (preserves reactivity)
const { astronomyData, isLoading, error } = storeToRefs(nasaStore)

// Actions can be destructured directly (functions don't need storeToRefs)
const { fetchApodData } = nasaStore

// Fetch when the app loads
onMounted(() => {
  fetchApodData()
})
</script>
