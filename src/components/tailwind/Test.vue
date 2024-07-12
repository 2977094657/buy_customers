<script setup>
import {ref} from 'vue'
import {router} from "@/router/router";
const state = ref(true)
const goToProduct = () => {
  // 本页面打开
  router.push({ name: 'Home' });
  // 新页面打开
  // const url = router.resolve({ name: 'Product', params: { productId } }).href;
  // window.open(url, '_blank');
}
</script>

<template>
  <div class="sub-layout">
    <button @click="goToProduct">2222222222222222</button>
  </div>
</template>

<style scoped>
.sub-layout {
  flex-direction: column;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
