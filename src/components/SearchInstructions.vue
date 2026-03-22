<script setup lang="ts">
const model = defineModel<string>({default:undefined})
</script>
<template>
  <div class="search-instructions">
    <h2 class="green">Dictionary</h2>
    <p>Search for any word and get its definition, pronunciation, and more!</p>
    <p>Type a word into the search bar above to find its meaning.</p>
    <input v-model="model" type="text" placeholder="Enter a word..." />
  </div>
</template>
