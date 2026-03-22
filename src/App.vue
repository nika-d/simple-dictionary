<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import SearchInstructions from './components/SearchInstructions.vue'
import {type Ref, ref} from "vue";
import {DictionaryEntry, parseDictionaryAPIResponse} from "@/models/DictionaryEntry.ts";

const dictionaryEntry: Ref<DictionaryEntry|undefined> = ref(undefined)
const errorMessage: Ref<string|undefined> = ref(undefined)

const searchTerm: Ref<string> = ref('')
async function getWordInfo(word: string) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
  )
  return await response.json()
}
function setDictionaryEntry() {
  if (searchTerm.value) {
    dictionaryEntry.value = undefined
    errorMessage.value = undefined
    getWordInfo(searchTerm.value).then(response => {
      try {
        dictionaryEntry.value = parseDictionaryAPIResponse(response)[0]
      } catch (error) {
        errorMessage.value = 'Word not found. Please try another search term. A search term can only be a single word, without spaces or special characters.'
      }
    })
  }
}

</script>

<template>
  <header>
    <div class="wrapper">
      <SearchInstructions v-model="searchTerm"/>
      <button @click="setDictionaryEntry">Find!</button>
      <p v-if="errorMessage">{{errorMessage}}</p>
      <HelloWorld msg="You did it!" />
    </div>
    <!-- <WordGeneralInfo /> -->
  </header>

  <main>
    <p v-if="dictionaryEntry">{{JSON.stringify(dictionaryEntry).slice(0, 300)}}</p>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
