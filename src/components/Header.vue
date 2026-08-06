<template>
  <header class="sticky top-0 z-50 w-full bg-navy/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
    <nav
      class="container mx-auto px-4 py-4 flex items-center justify-between"
      aria-label="Main Navigation"
    >
      <!-- Logo -->
      <div class="text-xl font-bold text-white-900">
        <router-link to="/">SpaceExplorer</router-link>
      </div>

      <!-- Navigation Links - new link will be added as I build the pages -->
      <ul class="flex gap-6">
        <li>
          <router-link
            to="/explore"
            class="text-white-600 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded px-2 py-1"
            active-class="text-teal-600 font-semibold"
          >
            Photo of the Day
          </router-link>
        </li>

      </ul>
    </nav>
  </header>
</template>
