<template>
  <div class="min-h-screen flex items-center justify-center bg-yellow-400">
    <div class="max-w-5xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-12">
      <div class="text-center md:text-left">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900">
          <span class="text-black">Encontre</span> todos os seus <br />
          <span class="text-yellow-900">Pokémons</span> favoritos
        </h1>
        <p class="mt-4 text-gray-800 text-lg">
          Você pode conhecer o tipo do Pokémon, suas forças, fraquezas e habilidades
        </p>
        <router-link to="/pokemon">
          <button class="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition">
            Ver Pokémons
          </button>
        </router-link>
      </div>
      <div class="relative">
        <div class="absolute top-0 left-0 w-12 h-12 bg-white rounded-full shadow -translate-x-4 -translate-y-4"></div>
        <div class="absolute top-4 right-0 w-16 h-16 bg-red-500 rounded-full shadow translate-x-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
