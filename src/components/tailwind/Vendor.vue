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
const fetchProducts = async () => {
  loadingMore.value = true // 开始加载数据
  const response = await fetch(`http://124.221.7.201:8081/product/vendor?name=${route.params.name}`)
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
      const response = await axios.post('http://124.221.7.201:8081/user/addHistory', {}, {
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

<style scoped>
@import '../../assets/Tailwind.css';
.product {
  margin: 20px 15px 0 0;
  padding: 10px 10% 10px 2%;
  background-color: #f7f9fa;
  border-radius: 10px;
  transition: outline 0.3s ease-in-out;
  outline: 1px transparent solid;
}

.product:hover {
  outline: 1px #ff915e solid;
  cursor: pointer;
  background-color: white;
  box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.1);
}

.productName {
  font: 12px/1.5 tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53', sans-serif;
  font-size: 16px;
  max-width: 158px;
  max-height: 46px;
  overflow: hidden;
  margin: 5px 0 0 11%;
  color: #333333;
  text-align: left;
}

.productName:hover{
  color: rgb(253,81,2);
}

.price{
  margin: 0 0 0 11%;
  color: #ff5000;
  font: 12px/1.5 tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53', sans-serif;
  font-size: 22px;
  line-height: 22px;
}

.jge{
  margin-right: 4px;
  vertical-align: middle;
  font: 12px/1.5 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;
  text-align: right;
  color: #ff5000;
  font-size: 20px;
  font-family: "Microsoft Yahei", serif;
}
</style>
