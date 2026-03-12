<template>
  <div ref="container" class="messages-container">
    <template v-if="messages.length">
      <div
        v-for="m in messages"
        :key="m.id"
        class="message-row"
        :class="{ 'message-row--own': m.user === effectiveUsername }"
      >
        <div class="avatar">
          {{ initials(m.user) }}
        </div>
        <div
          class="bubble"
          :style="bubbleStyle(m)"
        >
          <div class="bubble-header">
            <span class="bubble-user">{{ m.user }}</span>
            <span class="bubble-time">
              {{ new Date(m.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>
          <div class="bubble-text">
            {{ m.text }}
          </div>
        </div>
      </div>
    </template>
    <p v-else class="empty-state">
      Todavía no hay mensajes. ¡Escribe el primero!
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onUpdated, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '../stores/chat';
import type { ChatMessage } from '../stores/chat';

const SOFT_BUBBLE_COLORS: { bg: string; border: string }[] = [
  { bg: '#e0f2fe', border: '#7dd3fc' },
  { bg: '#fce7f3', border: '#f9a8d4' },
  { bg: '#d1fae5', border: '#6ee7b7' },
  { bg: '#fef3c7', border: '#fcd34d' },
  { bg: '#ede9fe', border: '#a78bfa' },
  { bg: '#ffedd5', border: '#fdba74' },
  { bg: '#f3e8ff', border: '#c084fc' },
  { bg: '#ccfbf1', border: '#5eead4' },
];

const store = useChatStore();
const { messages, effectiveUsername } = storeToRefs(store);
const container = ref<HTMLDivElement | null>(null);

const otherUserColorIndex = computed(() => {
  const others = [...new Set(
    messages.value.map((m) => m.user).filter((u) => u !== effectiveUsername.value),
  )].sort();
  const map = new Map<string, number>();
  others.forEach((u, i) => map.set(u, i));
  return map;
});

function bubbleStyle(m: ChatMessage): Record<string, string> | undefined {
  if (m.user === effectiveUsername.value) return undefined;
  const idx = otherUserColorIndex.value.get(m.user);
  if (idx === undefined) return undefined;
  const c = SOFT_BUBBLE_COLORS[idx % SOFT_BUBBLE_COLORS.length];
  return { backgroundColor: c.bg, borderColor: c.border };
}

onUpdated(() => {
  const el = container.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
});

function initials(user: string) {
  return user
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
</script>

