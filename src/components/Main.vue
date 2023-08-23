<template>
    <div class="products">
      <div v-for="product in products" :key="product.productId" class="product" @click="goToProduct(product.productId)">
        <div v-if="!product.loading">
          <el-skeleton :animated="true">
            <template #template>
              <el-skeleton-item variant="image" width="100" class="img" style="border-radius: 10px;" />
            </template>
          </el-skeleton>
        </div>
        <div style="display: none">
          <img @load="product.loading=true" :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName" width="100" class="img" >
        </div>
        <img v-if="product.loading" :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName" width="100" class="img" >
        <div class="productName">
          {{ product.productName }}
          <br><br>
          <el-rate v-model="product.score" disabled show-score text-color="#ff9900" score-template="{value}"/>
          <br><br>收藏：{{product.star}}
          <br><br><span style="color: rgb(255,80,0);"><b>￥{{ product.price }}</b></span>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {useRouter} from "vue-router";

const currentPage = ref(1)
const totalPages = ref(1)
const products = ref([])
const randomSeed = ref(Math.floor(Math.random() * 10000)) // 添加 randomSeed ref
const loadingMore = ref(false) // 添加 loadingMore 状态

const fetchProducts = async (page) => {
  loadingMore.value = true // 开始加载数据
  const response = await fetch(`http://1.14.126.98:8081/product/all?current=${page}&size=12&randomSeed=${randomSeed.value}`)
  const data = await response.json()
  // 当加载更多数据时，将新数据添加到 products 数组中，而不是替换它
  products.value = [...products.value, ...data.records.map(product => ({ ...product, loading: false }))]
  currentPage.value = data.current
  totalPages.value = data.pages
  loadingMore.value = false // 加载完成
}

const checkScroll = () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
  if (nearBottom && !loadingMore.value && currentPage.value < totalPages.value) {
    fetchProducts(currentPage.value + 1)
  }
}

onMounted(() => {
  fetchProducts(currentPage.value)
  window.addEventListener('scroll', checkScroll) // 添加滚动事件监听器
})

const router = useRouter()

const goToProduct = (productId) => {
  const url = router.resolve({ name: 'Product', params: { productId } }).href;
  window.open(url, '_blank');
}
</script>

<style scoped>
@import '../assets/Main.css';
</style>
