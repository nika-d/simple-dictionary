<script setup lang="ts">
import type { DictionaryEntry } from '@/models/DictionaryEntry.ts'

defineProps<{
  entry?: DictionaryEntry
  errorMessage?: string
}>()
</script>

<template>
  <div class="dictionary-entry">
    <div v-if="errorMessage" class="error-message">
      <p>Error:</p>
      <p>{{ errorMessage }}</p>
    </div>

    <template v-else-if="entry">
      <h2 class="word">
        {{ entry.word }}
        <span v-if="entry.phonetic" class="phonetic">{{ entry.phonetic }}</span>
      </h2>

      <p v-if="entry.origin" class="origin"><em>Origin:</em> {{ entry.origin }}</p>

      <ul class="meanings-list">
        <li v-for="(meaning, mIndex) in entry.meanings" :key="mIndex" class="meaning-item">
          <h3 class="part-of-speech">{{ meaning.partOfSpeech }}</h3>

          <ul class="definitions-list">
            <li v-for="(def, dIndex) in meaning.definitions" :key="dIndex" class="definition-item">
              <p class="definition-text">{{ def.definition }}</p>
              <p v-if="def.example" class="example">Example: "{{ def.example }}"</p>
              <p v-if="def.synonyms.length" class="synonyms">
                <em>Synonyms:</em> {{ def.synonyms.join(', ') }}
              </p>
              <p v-if="def.antonyms.length" class="antonyms">
                <em>Antonyms:</em> {{ def.antonyms.join(', ') }}
              </p>
            </li>
          </ul>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.dictionary-entry {
  padding: 1rem;
}

.error-message {
  width: 50%;
  margin: auto;
  padding-top: 1rem;
}

.word {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.phonetic {
  font-size: 1rem;
  font-weight: normal;
  color: var(--vt-c-text-light-2);
  margin-left: 0.5rem;
}

.origin {
  color: var(--vt-c-text-light-2);
  margin-bottom: 1rem;
}

.meanings-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.meaning-item {
  border-left: 3px solid var(--color-border);
  padding-left: 1rem;
}

.part-of-speech {
  font-style: italic;
  color: var(--vt-c-text-light-2);
  margin-bottom: 0.5rem;
}

.definitions-list {
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
}

.definitions-list > li::marker {
  color: hsla(160, 100%, 37%, 1);
}

.definition-item {
  line-height: 1.5;
}

.example {
  color: var(--vt-c-text-light-2);
}

.synonyms,
.antonyms {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
