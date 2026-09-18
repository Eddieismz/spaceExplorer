<template>
  <div class="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-6">
    <div class="max-w-5xl w-full">
      <h1 class="text-4xl font-bold mb-3 text-teal-500 text-center">Mars Rover Photos</h1>
      <p class="text-slate-400 text-center mb-10">
        Choose a rover to explore photographs captured on Mars.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <button
          v-for="rover in rovers"
          :key="rover.id"
          type="button"
          class="text-left bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          @click="selectRover(rover.id)"
        >
          <img
            :src="rover.image"
            :alt="`${rover.name} rover`"
            class="w-full h-56 object-cover"
          />
          <div class="p-5">
            <h2 class="text-2xl font-semibold text-teal-400 mb-1">{{ rover.name }}</h2>
            <p class="text-slate-500 text-xs mb-2">Landed: {{ rover.landed }}</p>
            <p class="text-slate-300 text-sm leading-relaxed">{{ rover.description }}</p>
            <span class="inline-block mt-4 text-teal-500 text-sm font-semibold">
              Explore {{ rover.name }} &rarr;
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { RoverId } from '@/stores/marsRoverStore'

const router = useRouter()

const rovers: { id: RoverId; name: string; landed: string; description: string; image: string }[] = [
  {
    id: 'curiosity',
    name: 'Curiosity',
    landed: 'August 6, 2012',
    description: "A car-sized rover studying Mars' climate and geology, investigating whether the planet ever had conditions suitable for microbial life.",
    image: 'https://web-production-3cafe.up.railway.app/explore/images/Curiosity_rover.jpg',
  },
  {
    id: 'perseverance',
    name: 'Perseverance',
    landed: 'February 18, 2021',
    description: 'The most advanced rover NASA has sent to Mars, searching for signs of ancient microbial life and collecting samples for future return to Earth.',
    image: 'https://web-production-3cafe.up.railway.app/explore/images/Perseverance_rover.jpg',
  },
]

function selectRover(rover: RoverId) {
  router.push({
    name: 'mars-rover-gallery',
    params: { rover },
  })
}
</script>
