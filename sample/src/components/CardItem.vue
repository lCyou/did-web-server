<template>
    <div class="card cursor-pointer hover:shadow-lg transition-shadow" @click="onClick">
      <div class="card-content">
        <div class=" bg-gray-200 text-gray-600 flex items-center justify-center">
          <h2 class="font-semibold">{{ card.payload.iss }}</h2>
          <p class="text-sm text-gray-500" style="word-wrap: break-word;">{{ card.signature }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    card: Object,
  });
  const emit = defineEmits(['click']);
  
  const onClick = () => emit('click', props.card);

  </script>
  
  <style scoped>
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin: 5%;
  }
  .card-content {
    /* display: ; */
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 5%;
  }
  .icon {
    border-radius: 50%;
    font-size: 1.5rem;
  }
  </style>
  