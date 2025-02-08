<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">My Wallet</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CardItem
        v-for="credential in credentials"
        :key="credential.id"
        :card="credential"
        @click="handleCardClick(credential)"
      />
    </div>
    <CardModal v-if="isModalOpen" :card="selectedCard" @close="handleCloseModal" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import CardItem from '@/components/CardItem.vue';
import CardModal from '@/components/CardModal.vue';
import { dbReady, getAllVCs } from '@/utils/vc';

const credentials = ref([]);

onMounted(async () => {
  await dbReady; // データベースの初期化が完了するまで待機
  credentials.value = await getAllVCs();
});

const selectedCard = ref(null);
const isModalOpen = ref(false);

const handleCardClick = (credential) => {
  selectedCard.value = credential;
  isModalOpen.value = true;
};

const handleCloseModal = () => {
  isModalOpen.value = false;
  selectedCard.value = null;
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}
</style>
