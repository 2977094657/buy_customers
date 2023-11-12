<template>
  <div class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
    <div v-for="product in products" :key="product.productId" class="group flex product" @click="goToProduct(product.productId);addHistory(product.productId)"> <!-- 添加 flex 和 items-center -->
      <div style="display: none">
        <img @load="product.loading=true" :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName" width="100" >
      </div>
      <div v-if="!product.loading">
        <el-skeleton :animated="true">
          <template #template>
            <el-skeleton-item class="w-36 h-36 overflow-hidden rounded-lg mr-auto" variant="image" style="border-radius: 10px;" />
          </template>
        </el-skeleton>
      </div>
      <div v-if="product.loading" class="w-36 h-36 overflow-hidden rounded-lg mr-auto"> <!-- 添加 mr-auto -->
        <img :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName" class="h-full w-full group-hover:opacity-75" />
      </div>
      <div class="flex-grow flex flex-col justify-between"> <!-- 将标题和价格包裹在一个 div 中 -->
        <p class="text-sm text-gray700 productName">{{ product.productName }}</p>
        <p class="mt-l text-lg font-medium text-gray900 price"><span class="jge">￥</span>{{ product.price }}</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref, onMounted, computed} from 'vue'
import {useRouter} from "vue-router";
import store from "@/store";
import {addHistorys, getAllProductsRandomly} from "@/api/api";

const currentPage = ref(1)
const totalPages = ref(1)
const products = ref([])
const randomSeed = computed(() => store.state.randomSeed); // 使用 Vuex 中保存的 randomSeed
const loadingMore = ref(false) // 添加 loadingMore 状态

const fetchProducts = async (page) => {
  loadingMore.value = true;
  const response = await getAllProductsRandomly(page, 12, randomSeed.value);
  const data = response.data
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
  // 本页面打开
  router.push({ name: 'Product', params: { productId } });
  // 新页面打开
  // const url = router.resolve({ name: 'Product', params: { productId } }).href;
  // window.open(url, '_blank');
}

const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)

const addHistory = async (productId) => {
  if(land.value){
    try {
      const response = await addHistorys(userid.value, productId);

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

<style scoped>
@import '../../assets/Tailwind.css';
@import '../../assets/Main.css';
</style>
