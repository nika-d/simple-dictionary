<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { type DictionaryEntry, parseDictionaryAPIResponse } from '@/models/DictionaryEntry.ts'

const dictionaryEntry = defineModel<DictionaryEntry | undefined>('dictionaryEntry')
const errorMessage = defineModel<string | undefined>('errorMessage')

const searchTerm: Ref<string> = ref('')

async function getWordInfo(word: string) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
  )
  return await response.json()
}

function search() {
  if (searchTerm.value) {
    dictionaryEntry.value = undefined
    errorMessage.value = undefined
    getWordInfo(searchTerm.value).then((response) => {
      try {
        dictionaryEntry.value = parseDictionaryAPIResponse(response)[0]
      } catch {
        errorMessage.value =
          'Word not found. Please try another search term. A search term can only be a single word, without spaces or special characters.'
      }
    })
  }
}
</script>

<template>
  <div class="dictionary-search">
    <p>Search for any word and get its definitions!</p>
    <input v-model="searchTerm" type="text" placeholder="Enter a word..." />
    <button @click="search" aria-label="Search">🔍</button>
  </div>
</template>

<style scoped>
input,
button {
  height: 2.5rem;
  margin: 0.2rem;
}

button {
  width: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: transparent;
  box-shadow: none;
  cursor: pointer;
}
</style>

