<template>
  <router-view :class="{ 'cf-hidden': shouldHide }" />
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { updateTheme } from './functions/color-computators';
import { useQuasar } from 'quasar';
const $q = useQuasar();

const shouldHide = ref(true);

onBeforeMount(async () => {
  const log = console.log;
  console.log = (...args) => {
    log('[Clutterfree Vue 3]', ...args);
  };

  try {
    await updateTheme($q);
    shouldHide.value = false;
  } catch (error) {
    console.log(error);
  }

  $q.bex.on('theme-change', async ({ data, respond }) => {
    console.log('theme-change', data);
    await updateTheme($q, data);
    respond();
  });
});
</script>
