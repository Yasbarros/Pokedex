<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="flex flex-wrap gap-4 mb-8 items-center justify-between bg-white p-4 rounded-lg shadow">
      <input
        v-model="filters.name"
        placeholder="Filtrar por nome ou ID"
        class="w-full sm:w-auto flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
      />
      <select
        v-model="filters.type"
        class="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
      >
        <option value="">Todos os Tipos</option>
        <option v-for="type in types" :key="type.name" :value="type.name">
          {{ type.name }}
        </option>
      </select>
      <button
        @click="resetAndLoad"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200"
      >
        Buscar
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      <div
        v-for="pokemon in pokemons"
        :key="pokemon.name"
        @click="selectPokemon(pokemon)"
        class="bg-white rounded-xl shadow-md p-4 cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:ring-4 hover:ring-indigo-100 flex flex-col items-center text-center"
      >
        <img
          :src="pokemon.image"
          :alt="pokemon.name"
          class="w-24 h-24 object-contain mb-2 drop-shadow-md"
        />
        <p class="capitalize font-semibold text-gray-800 text-lg">{{ pokemon.name }}</p>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-500 mt-8 animate-pulse">Carregando...</div>

    <PokemonDetail
      @clear-pokemon="clearPokemon"
      v-if="selectedPokemon"
      :pokemon="selectedPokemon"
      :to="`/pokemon/${selectedPokemon.name}`"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PokemonDetail from './PokemonDetail.vue'

const pokemons = ref([])
const offset = ref(0)
const limit = 20
const loading = ref(false)
const filters = ref({ name: '', type: '' })
const selectedPokemon = ref(null)
const types = ref([])

const fetchTypes = async () => {
  const { data } = await axios.get('https://pokeapi.co/api/v2/type')
  types.value = data.results
}

const clearPokemon = () => {
  selectedPokemon.value = null
}

const loadPokemons = async () => {
  if (loading.value) return
  loading.value = true

  try {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset.value}`

    if (filters.value.name) {
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${filters.value.name.toLowerCase()}`)
        pokemons.value = [{
          name: data.name,
          image: data.sprites.front_default,
          url: `https://pokeapi.co/api/v2/pokemon/${data.id}`
        }]
        loading.value = false
        return
      } catch (e) {
        console.warn('Não encontrado por nome/ID.')
        pokemons.value = []
        loading.value = false
        return
      }
    }

    const { data } = await axios.get(url)
    const results = await Promise.all(
      data.results.map(async (pokemon) => {
        const details = await axios.get(pokemon.url)
        return {
          name: pokemon.name,
          image: details.data.sprites.front_default,
          url: pokemon.url,
          types: details.data.types.map(t => t.type.name)
        }
      })
    )

    const filtered = filters.value.type
      ? results.filter(p => p.types.includes(filters.value.type))
      : results

    pokemons.value.push(...filtered)
    offset.value += limit
  } catch (e) {
    console.error(e)
  }

  loading.value = false
}

const resetAndLoad = () => {
  pokemons.value = []
  offset.value = 0
  loadPokemons()
}

const selectPokemon = async (pokemon) => {
  const { data } = await axios.get(pokemon.url)
  selectedPokemon.value = data
}

const handleScroll = () => {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const fullHeight = document.documentElement.scrollHeight

  if (scrollTop + windowHeight >= fullHeight - 10) {
    loadPokemons()
  }
}

onMounted(() => {
  fetchTypes()
  loadPokemons()
  window.addEventListener('scroll', handleScroll)
})
</script>
