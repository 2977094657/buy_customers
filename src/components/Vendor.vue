<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import store from "@/store";
import axios from "axios";
import router from "@/router/router";

const route = useRoute()
const product = ref()
const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)

const currentPage = ref(1)
const totalPages = ref(1)
const products = ref([])
const loadingMore = ref(false) // 添加 loadingMore 状态
const fetchProducts = async (page) => {
  loadingMore.value = true // 开始加载数据
  const response = await fetch(`http://1.14.126.98:8081/product/vendor?name=${route.params.name}`)
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

const goToProduct = (productId) => {
  const url = router.resolve({ name: 'Product', params: { productId } }).href;
  window.open(url, '_blank');
}

const addHistory = async (productId) => {
  if(land.value){
    try {
      const response = await axios.post('http://1.14.126.98:8081/user/addHistory', {}, {
        params: {
          userid: userid.value,
          productId
        }
      });

      if (response.data.code === 200) {
        console.log('History added successfully');
      } else {
        console.log('Failed to add history');
      }
    } catch (error) {
      console.error(error);
    }
  }
};
</script>

<template>
  <div class="products">
    <div v-for="product in products" :key="product.productId" class="product" @click="goToProduct(product.productId);addHistory(product.productId)">
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
      </div>
      <div style="text-align: right;margin: 120px 40px 0 0;">
        <span class="jge">￥</span>
        <span class="price" >{{ product.price }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/Main.css';
</style>
