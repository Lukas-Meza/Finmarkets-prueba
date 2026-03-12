<template>
  <div class="app-shell">
    <header class="header">
      <h1>Chat (Vue 3)</h1>
      <div class="header-actions">
        <ResetChatButton />
        <ConnectionIndicator />
      </div>
    </header>

    <UsernameInput />
    <MessageList />
    <MessageInput />
  </div>
</template>

<script setup lang="ts">
import ConnectionIndicator from './components/ConnectionIndicator.vue';
import UsernameInput from './components/UsernameInput.vue';
import MessageList from './components/MessageList.vue';
import MessageInput from './components/MessageInput.vue';
import ResetChatButton from './components/ResetChatButton.vue';
</script>

