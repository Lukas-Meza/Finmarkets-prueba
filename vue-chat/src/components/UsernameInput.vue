<template>
  <div class="username-row">
    <label class="username-label">
      Nombre:
      <input
        class="text-input"
        :value="store.username"
        @input="onInput"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '../stores/chat';

const store = useChatStore();

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  store.setUsername(target.value);
}
</script>

