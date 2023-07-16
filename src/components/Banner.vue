<script setup>
import { ref, onMounted } from 'vue'
import router from "@/router/router";

const currentPage = ref(1)
const Banner = ref([])

const banner = async () => {
  const response = await fetch(`http://1.14.126.98:8081/product/all?current=${currentPage.value}&size=5&sortField=score&isAsc=false`)
  const data = await response.json()
  Banner.value = data.records
  currentPage.value = data.current
}

const goToProduct = (productId) => {
  const url = router.resolve({ name: 'Product', params: { productId } }).href;
  window.open(url, '_blank');
}
onMounted(banner)
</script>

<template>
  <div class="banner">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="Banner in Banner" :key="Banner.productId">
        <img :src="Banner.img.slice(1, -1).split(',')[0]" :alt="Banner.productName" @click="goToProduct(Banner.productId)">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped>
.banner {
  overflow: hidden;
  border-radius: 10px;
  margin: 10px 0 0 23%;
  width: 48%;
}

img {
  border-radius: 10px;
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 0.3s;
}
</style>
