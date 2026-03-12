<template>
  <div class="status-row">
    <span class="status-dot" :style="{ backgroundColor: color }" />
    <span class="status-text">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useChatStore } from '../stores/chat';

const store = useChatStore();

onMounted(() => {
  store.connect();
});

onBeforeUnmount(() => {
  store.disconnect();
});

const label = computed(() => {
  if (store.status === 'connected') return 'Conectado';
  if (store.status === 'connecting') return 'Conectando...';
  return 'Desconectado';
});

const color = computed(() => {
  if (store.status === 'connected') return '#16a34a';
  if (store.status === 'connecting') return '#eab308';
  return '#dc2626';
});
</script>

