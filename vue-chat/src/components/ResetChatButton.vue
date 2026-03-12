<template>
  <button
    v-if="store.messages.length > 0"
    type="button"
    class="reset-chat-button"
    @click="store.resetChat()"
  >
    Resetear chat
  </button>
</template>

<script setup lang="ts">
import { useChatStore } from '../stores/chat';

const store = useChatStore();
</script>
