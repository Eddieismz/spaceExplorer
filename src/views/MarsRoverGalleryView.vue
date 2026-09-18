<template>
  <div class="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-6">
    <div class="max-w-6xl w-full">

      <!-- Link back to the rover-picker page -->
      <RouterLink
        to="/mars-rover"
        class="inline-block mb-6 text-teal-500 hover:text-teal-400 text-sm font-semibold"
      >
        &larr; Choose another rover
      </RouterLink>

      <!-- Rover info banner: image + name + short description -->
      <section class="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 mb-8">
        <img
          :src="roverInfo.image"
          :alt="`${roverInfo.name} rover`"
          class="w-full h-64 object-cover"
        />
        <div class="p-6">
          <h1 class="text-4xl font-bold text-teal-500 mb-2">{{ roverInfo.name }}</h1>
          <p class="text-slate-300 leading-relaxed">{{ roverInfo.description }}</p>
        </div>
      </section>

      <!-- Shown only while the manifest (valid-dates list) is being fetched -->
      <div v-if="isManifestLoading" class="text-center text-slate-400 mb-8 animate-pulse">
        Loading available photo dates...
      </div>

      <!-- The search form only renders once the manifest has actually loaded,
           since the dropdown options come directly from it. -->
      <form
        v-else-if="manifest"
        @submit.prevent="handleSearch"
        class="flex flex-wrap gap-4 items-end mb-4 bg-slate-800 p-6 rounded-xl border border-slate-700"
      >
        <!-- Toggle between "search by calendar date" and "search by Martian sol" -->
        <div class="flex flex-col">
          <label class="text-sm text-slate-400 mb-1">Search by</label>
          <div class="flex rounded-lg overflow-hidden border border-slate-600">
            <button
              type="button"
              :class="searchMode === 'earthDate' ? 'bg-teal-600' : 'bg-slate-700 hover:bg-slate-600'"
              class="px-3 py-2 text-sm font-semibold transition-colors"
              @click="searchMode = 'earthDate'"
            >
              Earth date
            </button>
            <button
              type="button"
              :class="searchMode === 'sol' ? 'bg-teal-600' : 'bg-slate-700 hover:bg-slate-600'"
              class="px-3 py-2 text-sm font-semibold transition-colors"
              @click="searchMode = 'sol'"
            >
              Martian sol
            </button>
          </div>
        </div>

        <!-- The dropdown itself. Its <option> list comes ONLY from sortedEntries,
             which is built from the manifest — so the user can never pick a
             date/sol that has zero photos.  -->
        <div class="flex flex-col">
          <label for="date-select" class="text-sm text-slate-400 mb-1">
            {{ searchMode === 'earthDate' ? 'Date with available photos' : 'Sol with available photos' }}
          </label>
          <select
            id="date-select"
            v-model="selectedEntry"
            required
            class="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:border-teal-500 min-w-[260px]"
          >
            <!-- :value="entry" binds the WHOLE object (not just a string) to
                 this option, so selectedEntry ends up holding
                 { sol, earth_date, total_photos } directly once chosen. -->
            <option v-for="entry in sortedEntries" :key="entry.sol" :value="entry">
              <template v-if="searchMode === 'earthDate'">
                {{ entry.earth_date }} ({{ entry.total_photos }} photos)
              </template>
              <template v-else>
                Sol {{ entry.sol }} — {{ entry.earth_date }} ({{ entry.total_photos }} photos)
              </template>
            </option>
          </select>
        </div>

        <!-- Disabled until something is actually selected, or while a search is running -->
        <button
          type="submit"
          :disabled="!selectedEntry || isLoading"
          class="px-6 py-2 bg-teal-600 hover:bg-teal-800 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          Search photos
        </button>
      </form>

      <!-- Just a small stats line giving context on the size of this rover's dataset -->
      <p v-if="manifest" class="text-slate-500 text-xs mb-8">
        {{ manifest.total_photos.toLocaleString() }} total photos across
        {{ manifest.photos.length.toLocaleString() }} productive sols, up to sol
        {{ manifest.max_sol }} ({{ manifest.max_date }}).
      </p>

      <!-- Loading state for the actual photo search (separate from manifest loading) -->
      <div v-if="isLoading" class="text-xl animate-pulse text-center">
        Fetching {{ roverInfo.name }} photos from Mars...
      </div>

      <!-- Error / "no results" message -->
      <div v-else-if="error" class="text-amber-400 bg-amber-100/10 p-4 rounded-lg text-center">
        {{ error }}
      </div>

      <!-- Default empty state before any search has been run -->
      <div v-else-if="photos.length === 0" class="text-slate-400 text-center">
        Choose a date or sol above to load rover photos.
      </div>

      <!-- The actual photo grid, only rendered once photos exist -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="photo in photos"
          :key="photo.id"
          class="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700"
        >
          <img
            :src="photo.img_src"
            :alt="`${roverInfo.name} photo taken with ${photo.camera?.full_name ?? 'a rover camera'}`"
            class="w-full h-[240px] object-cover"
          />
          <div class="p-5">
            <h2 class="text-lg font-semibold mb-2">{{ photo.camera?.full_name ?? 'Unknown camera' }}</h2>
            <p class="text-slate-400 text-sm">Earth date: {{ photo.earth_date }}</p>
            <p class="text-slate-400 text-sm">Martian sol: {{ photo.sol }}</p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import {
  useMarsRoverStore,
  type RoverId,
} from '@/stores/marsRoverStore'

// Reads the current route (e.g. /mars-rovers/curiosity)
const route = useRoute()
const rover = route.params.rover as RoverId

// Local display data for each rover: name, description, banner image. static copy/content
const roverInfoMap = {
  curiosity: {
    name: 'Curiosity',
    description: "A car-sized rover studying Mars' climate and geology, investigating whether the planet ever had conditions suitable for microbial life.",
    image: 'https://mars.nasa.gov/internal_resources/642/',
  },
  perseverance: {
    name: 'Perseverance',
    description: 'The most advanced rover NASA has sent to Mars, searching for signs of ancient microbial life and collecting samples for future return to Earth.',
    image: 'https://web-production-3cafe.up.railway.app/explore/images/Perseverance_rover.jpg',
  },
} as const

// Falls back to Curiosity so the page never crashes on a bad/unexpected route param.
const roverInfo = roverInfoMap[rover] ?? roverInfoMap.curiosity

const nasaStore = useMarsRoverStore()
// storeToRefs keeps these reactive — a plain destructure would copy
// the values once and lose the live connection to the store.
const { photos, manifest, isLoading, isManifestLoading, error } = storeToRefs(nasaStore)

// Which mode the dropdown is currently showing: calendar date or Martian sol.
const searchMode = ref<'earthDate' | 'sol'>('earthDate')

// Holds the FULL manifest entry object the user picked from the dropdown
// (not just a date string), so handleSearch can read whichever field it needs.
const selectedEntry = ref<{ sol: number; earth_date: string; total_photos: number } | null>(null)

// Builds the dropdown's option list from the manifest, newest sol first.
const sortedEntries = computed(() => {
  if (!manifest.value) return []
  // Spreading into a new array before sorting avoids mutating the original manifest.value.photos array in place.
  return [...manifest.value.photos].sort((a, b) => b.sol - a.sol)
})

// Runs once when this page first mounts
onMounted(() => {
  nasaStore.resetStore()
  nasaStore.fetchManifest(rover)
})

// If the user switches between "Earth date" and "Sol" mode, clear the current selection
watch(searchMode, () => {
  selectedEntry.value = null
})

// Triggered by the form's submit event. Reads whichever field is relevant
// (earth_date or sol) from the selected manifest entry and passes it to the store.
function handleSearch() {
  if (!selectedEntry.value) return

  if (searchMode.value === 'earthDate') {
    nasaStore.fetchPhotos(rover, { earthDate: selectedEntry.value.earth_date })
  } else {
    nasaStore.fetchPhotos(rover, { sol: selectedEntry.value.sol })
  }
}
</script>
