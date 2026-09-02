<template>
  <div class="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-10">
    <h1 class="text-4xl font-bold mb-8 text-teal-600">Photo Gallery</h1>

    <!-- Date range picker -->
    <form
      @submit.prevent="handleSearch"
      class="flex flex-wrap gap-4 items-end mb-10 bg-slate-800 p-6 rounded-xl border border-slate-700">

      <div class="flex flex-col">
        <label for="start" class="text-sm text-slate-400 mb-1">Start date</label>
        <input
          id="start"
          v-model="startDate"
          type="date"
          required
          :max="endDate"
          class="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:border-teal-500"
        />
      </div>

      <div class="flex flex-col">
        <label for="end" class="text-sm text-slate-400 mb-1">End date</label>
        <input
          id="end"
          v-model="endDate"
          type="date"
          required
          :min="startDate"
          :max="today"
          class="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:border-teal-500"
        />
      </div>

      <button
        type="submit"
        class="px-6 py-2 bg-teal-600 hover:bg-teal-800 rounded-lg font-semibold transition-colors"
      >
        Search
      </button>
    </form>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-xl animate-pulse">
      Fetching photos from NASA API...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-red-500 bg-red-100/10 p-4 rounded-lg">
      Error: {{ error }}
    </div>

    <!-- Empty state, before loading the images -->
    <div v-else-if="photos.length === 0" class="text-slate-400">
      Choose a date range and hit search to load photos.
    </div>

    <!-- Card grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full"
    >
      <div
        v-for="photo in photos"
        :key="photo.date"
        class="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col"
      >
        <img
          v-if="photo.media_type === 'image'"
          :src="photo.url"
          :alt="photo.title"
          class="w-full h-[220px] object-cover"
        />
        <div v-else class="w-full h-[220px] bg-slate-700 flex items-center justify-center text-slate-400">
          Video content
        </div>

        <div class="p-5 flex flex-col flex-1">
          <h2 class="text-lg font-semibold mb-1">{{ photo.title }}</h2>
          <p class="text-slate-400 text-xs mb-3">{{ photo.date }}</p>
          <p class="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {{ photo.explanation }}
          </p>

          <RouterLink
            :to="{ name: 'apod-detail', params: { date: photo.date } }"
            class="mt-auto text-teal-500 hover:text-teal-400 text-sm font-semibold self-start"
          >
            Read more &rarr;
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNasaStore } from '@/stores/nasaStore'

const nasaStore = useNasaStore()
const { photos, isLoading, error } = storeToRefs(nasaStore)
const { fetchApodRange } = nasaStore

const today = new Date().toISOString().slice(0, 10)
const startDate = ref(today)
const endDate = ref(today)

function handleSearch() {
  fetchApodRange(startDate.value, endDate.value)
}
</script>
