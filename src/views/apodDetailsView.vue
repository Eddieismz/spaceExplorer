<template>
  <div class="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-6">
    <div class="max-w-4xl w-full">
      <RouterLink
        to="/gallery"
        class="inline-block mb-6 text-teal-500 hover:text-teal-400 text-sm font-semibold"
      >
        &larr; Back to Gallery
      </RouterLink>

      <div v-if="isLoading" class="text-xl animate-pulse">
        Loading photo details...
      </div>

      <div v-else-if="error" class="text-red-500 bg-red-100/10 p-4 rounded-lg">
        Error: {{ error }}
      </div>

      <div
        v-else-if="selectedPhoto"
        class="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700"
      >
        <img
          v-if="selectedPhoto.media_type === 'image'"
          :src="selectedPhoto.hdurl || selectedPhoto.url"
          :alt="selectedPhoto.title"
          class="w-full max-h-[600px] object-cover"
        />
        <iframe
          v-else
          :src="selectedPhoto.url"
          class="w-full h-[400px]"
          allowfullscreen
        />

        <div class="p-8">
          <h1 class="text-3xl font-bold mb-2 text-teal-600">{{ selectedPhoto.title }}</h1>
          <p class="text-slate-400 text-sm mb-1">{{ selectedPhoto.date }}</p>
          <p v-if="selectedPhoto.copyright" class="text-slate-500 text-xs mb-6">
            &copy; {{ selectedPhoto.copyright }}
          </p>

          <p class="text-slate-300 leading-relaxed whitespace-pre-line">
            {{ selectedPhoto.explanation }}
          </p>
        </div>
      </div>

      <div v-else class="text-slate-400">
        No photo found for this date.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useNasaStore } from '@/stores/nasaStore'

const route = useRoute()
const nasaStore = useNasaStore()
const { selectedPhoto, isLoading, error } = storeToRefs(nasaStore)
const { fetchApodByDate } = nasaStore

onMounted(() => {
  const date = route.params.date as string

  const cached = nasaStore.photos.find((photo) => photo.date === date)

  if (cached) {
    nasaStore.selectedPhoto = cached
  } else {
    fetchApodByDate(date)
  }
})
</script>
