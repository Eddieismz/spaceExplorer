<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-white selection:text-black">

    <!-- Hero Section (Split Layout) -->
      <!-- Ambient background glow feature -->
      <div class="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div class="w-800px h-800px rounded-full bg-white-800 blur-[100px]"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        <!-- Left -->
        <div class="space-y-8">
          <div class="inline-block border border-slate-700 rounded-full px-4 py-1.5 text-xs tracking-widest uppercase text-slate-400">
            Powered by NASA API
          </div>

          <h1 class="text-5xl md:text-7xl font-light text-white leading-tight tracking-tight">
            Discover the <br />
            <span class="font-bold">Universe.</span>
          </h1>

          <p class="text-lg md:text-xl text-slate-400 font-light max-w-md leading-relaxed">
           This a portal view to the wide Cosmos. on the final version, you can browse astronomy photos, track asteroids, and explore raw data from deep space.
          </p>

          <div class="pt-4 flex items-center gap-6">
            <button class="bg-white text-black px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-slate-200 transition-all duration-300 hover:scale-105">
              Coming Soon...
            </button>
          </div>
        </div>

        <!-- Right: Photo Grid -->
        <div class="relative h-[600px] hidden md:block">

          <!-- Main photo -->
          <div class="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-[500px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl z-20">
            <img src='../assets/img/main_galaxy.jpg' alt="galaxy pic" class="w-full h-full bg-slate-800"></img> <!-- Replace this div with an <img> tag later -->
            <div class="absolute bottom-6 left-6 text-xs uppercase tracking-widest text-white-400 font-bold outline-style: solid">Mystic Mountain - Carina Nebula</div>
          </div>

          <!-- Secondary photo -->
          <div class="absolute top-12 right-48 w-64 h-80 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl z-10 opacity-60">
            <img  alt="night sky" src="../assets/img/night.jpg" class="w-full h-full bg-slate-800"></img> <!-- Replace with <img> -->
          </div>
        </div>

      </div>


    <!-- Features Banner -->
    <section class="border-t border-slate-800 bg-slate-950 relative z-10">
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-800">

          <router-link to='explore' class="md:pr-12 pt-8 md:pt-0">
            <h3 class="text-white font-semibold text-lg tracking-wide mb-2  hover:text-teal-600">Astronomy Pic of the Day</h3>
            <p class="text-slate-500 text-sm leading-relaxed font-light">Daily images of our universe, complete with detailed explanations and date.</p>
          </router-link>

          <div class="md:px-12 pt-8 md:pt-0">
            <h3 class="text-white font-semibold text-lg tracking-wide mb-2">Mars Rover Cameras</h3>
            <p class="text-slate-500 text-sm leading-relaxed font-light">Real-time images sent directly from the surface of mars.</p>
          </div>

          <div class="md:pl-12 pt-8 md:pt-0">
            <h3 class="text-white font-semibold text-lg tracking-wide mb-2">Near Earth Objects</h3>
            <p class="text-slate-500 text-sm leading-relaxed font-light">Track asteroids and orbital bodies passing safely through our solar system.</p>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
  name: 'LandingPage'
})
</script>
