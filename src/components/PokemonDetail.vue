<template>
  <div class="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
    <div class="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6 relative">

      <router-link to="/pokemon">
        <button
          @click="emitClearPokemon"
          class="absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl font-bold"
          aria-label="Voltar"
        >
          ← Voltar
        </button>
      </router-link>

      <h1 class="text-3xl font-bold text-gray-800 mb-6 uppercase">{{ pokemon.name }}</h1>
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Sprites</h2>
        <div class="flex flex-wrap gap-4">
          <div
            v-for="(sprite, key) in sprites"
            :key="key"
            class="flex flex-col items-center"
          >
            <img :src="sprite" :alt="key" class="w-24 h-24 object-contain rounded shadow" />
            <span class="text-sm text-gray-600 mt-1 capitalize">{{ formatSpriteName(key) }}</span>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Movimentos</h2>
        <ul class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600">
          <li
            v-for="move in pokemon.moves"
            :key="move.move.name"
            class="bg-gray-100 p-2 rounded shadow-sm"
          >
            {{ move.move.name }}
          </li>
        </ul>
      </section>

      <section class="mb-8" v-if="evolutions.length">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Evoluções</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="evo in evolutions"
            :key="evo"
            class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
          >
            {{ evo }}
          </span>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Games</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="game in pokemon.game_indices"
            :key="game.version.name"
            class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
          >
            {{ game.version.name }}
          </span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps(['pokemon', 'clearPokemon'])
const sprites = ref({})
const evolutions = ref([])
const router = useRouter()


function formatSpriteName(key) {
  const map = {
    front_default: 'Frente',
    back_default: 'Costas',
    front_shiny: 'Frente Brilhante',
    back_shiny: 'Costas Brilhante',
    dream_world: 'Dream World',
    home: 'Versão 3D',
  }
  return map[key] || key.replace(/_/g, ' ')
}

function emitClearPokemon() {
  this.$emit('clear-pokemon')
  router.push({ name: 'Pokemon' })
}

watch(
  () => props.pokemon,
  async () => {
    sprites.value = {
      front_default: props.pokemon.sprites.front_default,
      back_default: props.pokemon.sprites.back_default,
      front_shiny: props.pokemon.sprites.front_shiny,
      back_shiny: props.pokemon.sprites.back_shiny,
      dream_world: props.pokemon.sprites.other?.dream_world?.front_default,
      home: props.pokemon.sprites.other?.home?.front_default,
    }

    try {
      const speciesRes = await axios.get(props.pokemon.species.url)
      const evoChainRes = await axios.get(speciesRes.data.evolution_chain.url)

      const evoList = []
      let current = evoChainRes.data.chain

      while (current) {
        evoList.push(current.species.name)
        current = current.evolves_to?.[0]
      }

      evolutions.value = evoList
    } catch (error) {
      console.error('Erro ao carregar evoluções:', error)
    }
  },
  { immediate: true }
)
</script>
