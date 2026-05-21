<template>
  <div class="toggle-wrap" @click="toggle">
    <div class="toggle-track" :class="{ on: modelValue }">
      <div class="toggle-dot" />
    </div>
    <div>
      <p class="toggle-label">{{ label }}</p>
      <p class="toggle-sub">{{ sub }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  label: String,
  sub: String,
})
const emit = defineEmits(['update:modelValue'])
function toggle() { emit('update:modelValue', !props.modelValue) }
</script>

<style scoped>
.toggle-wrap {
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; user-select: none;
}
.toggle-track {
  width: 40px; height: 22px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.15);
  display: flex; align-items: center; padding: 3px;
  transition: background 0.2s; flex-shrink: 0;
  background: transparent;
}
.toggle-track.on { background: var(--accent); }
.toggle-dot {
  width: 14px; height: 14px; border-radius: 50%;
  background: #334155; transition: all 0.2s;
}
.toggle-track.on .toggle-dot {
  background: #05070f;
  margin-left: auto;
}
.toggle-label { font-size: 12px; font-weight: 600; color: var(--text); }
.toggle-sub { font-size: 10px; color: var(--muted); font-family: 'Space Mono', monospace; margin-top: 1px; }
</style>
