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
    <div class="pagination">
      <button @click="goToPage(1)">首页</button>
      <button @click="previousPage" :disabled="currentPage === 1">上一页</button>
      <template v-for="page in pageNumbers">
        <button v-if="page === currentPage" :class="{ 'current-page': true }" @click="goToPage(page)">{{ page }}</button>
        <button v-else @click="goToPage(page)">{{ page }}</button>
      </template>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      <button @click="goToPage(totalPages)">尾页</button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {useRouter} from "vue-router";

const currentPage = ref(1)
const totalPages = ref(1)
const products = ref([])
const randomSeed = ref(Math.floor(Math.random() * 10000)) // 添加 randomSeed ref

const fetchProducts = async (page) => {
  const response = await fetch(`http://1.14.126.98:8081/product/all?current=${page}&size=12&randomSeed=${randomSeed.value}`) // 添加 randomSeed 参数
  const data = await response.json()
  products.value = data.records.map(product => ({ ...product, loading: false }))
  currentPage.value = data.current
  totalPages.value = data.pages
}

const onImageLoad = (product) => {
  product.loading = true // 设置对应产品的 loading 属性为 false
}

const previousPage = () => {
  if (currentPage.value > 1) {
    fetchProducts(currentPage.value - 1)
    window.scrollTo(0, 0)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchProducts(currentPage.value + 1)
    window.scrollTo(0, 0)
  }
}

const goToPage = (page) => {
  fetchProducts(page)
  window.scrollTo(0, 0)
}

const pageNumbers = computed(() => {
  let numbers = []
  for(let i = 1; i <= Math.min(7, totalPages.value); i++) {
    numbers.push(i)
  }
  return numbers
})

onMounted(() => fetchProducts(currentPage.value))

const router = useRouter()

const goToProduct = (productId) => {
  const url = router.resolve({ name: 'Product', params: { productId } }).href;
  window.open(url, '_blank');
}
</script>

<style scoped>
@import '../assets/Main.css';
</style>
