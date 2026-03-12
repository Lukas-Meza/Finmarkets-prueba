<template>
  <form class="input-row" @submit.prevent="handleSubmit">
    <input
      class="text-input"
      :placeholder="placeholder"
      v-model="text"
      :disabled="!store.isConnected"
    />
    <button
      class="send-button"
      type="submit"
      :disabled="!store.isConnected || !text.trim()"
    >
      Enviar
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useChatStore } from '../stores/chat';

const store = useChatStore();
const text = ref('');

const placeholder = computed(() =>
  store.isConnected ? 'Escribe un mensaje' : 'Conectando al servidor...',
);

function handleSubmit() {
  const value = text.value.trim();
  if (!value) return;
  store.sendMessage(value);
  text.value = '';
}
</script>

