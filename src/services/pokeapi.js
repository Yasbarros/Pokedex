import axios from 'axios'

const api = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/',
})

export const getPokemonList = (limit = 20, offset = 0) =>
    api.get(`pokemon?limit=${limit}&offset=${offset}`)

  export const getPokemonByNameOrId = (identifier) =>
    api.get(`pokemon/${identifier}`)

  export const getPokemonSpecies = (id) =>
    api.get(`pokemon-species/${id}`)

  export const getPokemonEvolution = (url) =>
    axios.get(url)

  export const getPokemonType = (type) =>
    api.get(`type/${type}`)

  export const getPokemonAllType = (type) =>
    api.get(`type/${type}`)

//ou
  // export const getAllType = () =>
  //   return axios.get(`${baseURL}/type`)

  export default api