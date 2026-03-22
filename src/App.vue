<script setup lang="ts">
import DictionarySearch from './components/DictionarySearch.vue'
import DictionaryEntryDisplay from './components/DictionaryEntryDisplay.vue'
import { type Ref, ref } from 'vue'
import { type DictionaryEntry } from '@/models/DictionaryEntry.ts'
import IconDocumentation from '@/components/IconDocumentation.vue'

const dictionaryEntry: Ref<DictionaryEntry | undefined> = ref(undefined)
const errorMessage: Ref<string | undefined> = ref(undefined)
</script>

<template>
  <header>
    <div class="wrapper">
      <h1 class="green">
        <i><IconDocumentation /></i>
        Dictionary
      </h1>
      <DictionarySearch
        v-model:dictionaryEntry="dictionaryEntry"
        v-model:errorMessage="errorMessage"
      />
    </div>
  </header>

  <main>
    <DictionaryEntryDisplay :entry="dictionaryEntry" :error-message="errorMessage" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  display: grid;
  place-content: center;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    margin: auto;
  }

  main {
    max-height: 80vh;
    overflow: scroll;
  }
}
</style>
