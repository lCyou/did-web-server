<template>
    <div class="modal-overlay" @click.self="onClose">
      <div class="modal-content">
        <div v-if="!qr">
          <h2 class="modal-title">{{ card.payload.iss }}</h2>
          <div class="modal-body">
            <p><strong>Credential Sub:</strong> {{ card.payload.vc.credentialSubject }}</p>
            <p><strong>Expiry Date:</strong> {{ card.payload.vc.validUntil ? `{card.payload.vc.validFrom} ~ {card.payload.vc.validUntil}`: 'None' }}</p>
            <p><strong>Holder:</strong> {{ card.payload.sub || 'None' }}</p>
          </div>
          <button class="close-button" @click="onClose">&times;</button>
          <button @click="send(card)">send VC</button>
        </div>
        <div v-if="qr" class="qrcode-container">
          <canvas ref="canvas"></canvas>
          <button style="margin-top: 0rem;" @click="qr = false">Close</button>
          <button class="close-button" @click="onClose">&times;</button>
        </div>
      </div>
    </div>
</template>

<script setup>
  import { defineProps, defineEmits, ref } from 'vue';
  import QRCode from 'qrcode';

  const qr = ref(false);
  const canvas = ref(null);
  
  const props = defineProps({
    card: Object,
  });
  const emit = defineEmits(['close']);
  
  const onClose = () => emit('close');

  async function send(card) {
    qr.value = true;
    try {
      delete card.id;
      await QRCode.toCanvas(canvas.value, card, {
        width: 200,
      });
    } catch (error) {
      console.error(error);
    }
  }
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    width: 75%;
    max-width: 500px;
    position: relative;
  }
  .close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  .modal-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  .modal-body p {
    margin: 0.5rem 0;
  }

  .qrcode-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
  }

  canvas {
    border: 1px solid #ddd;
    width: 400px;
    height: 400px;
    margin: 2rem;
  }
  </style>
  