<script setup>
import {ref, computed} from 'vue';
import axios from 'axios';
import {watchEffect} from 'vue';
import router from "@/router/router";
import HighlightText from './HighlightText.vue';
import store from "@/store";


const products = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const props = defineProps({
  keyword: String
});

const executeSearch = async (page = 1) => {
  try {
    const response = await axios.get('http://1.14.126.98:8081/product/search', {
      params: {keyword: props.keyword, page},
    });
    // 在每个产品对象中添加一个 loading 字段
    products.value = response.data.records.map(product => ({
      ...product,
      loading: false,
    }));
    currentPage.value = response.data.current;
    totalPages.value = response.data.pages;
  } catch (error) {
    console.error('Request failed', error);
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    executeSearch(currentPage.value - 1);
    window.scrollTo(0, 0);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    executeSearch(currentPage.value + 1);
    window.scrollTo(0, 0);
  }
};

const goToPage = (page) => {
  executeSearch(page);
  window.scrollTo(0, 0);
};

watchEffect(() => {
  if (props.keyword !== undefined) {
    currentPage.value = 1;
    executeSearch();
  }
});

const pageNumbers = computed(() => {
  let numbers = []
  for (let i = 1; i <= Math.min(7, totalPages.value); i++) {
    numbers.push(i)
  }
  return numbers
})

const isEmpty = computed(() => products.value.length === 0);
const goHome = () => {
  // 导航到首页
  router.push({name: 'Home'});
};

const goToProduct = (productId) => {
  const url = router.resolve({name: 'Product', params: {productId}}).href;
  window.open(url, '_blank');
}

const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
const addHistory = async (productId) => {
  if(land){
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
            <el-skeleton-item variant="image" width="100" class="img" style="border-radius: 10px;"/>
          </template>
        </el-skeleton>
      </div>
      <div style="display: none">
        <img @load="product.loading=true" :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName"
             width="100" class="img">
      </div>
      <img v-if="product.loading" :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName" width="100"
           class="img">
      <div class="productName">
        <HighlightText :text="product.productName" :keyword="props.keyword"/>
      </div>
      <div style="text-align: right;margin: 120px 40px 0 0;">
        <span class="jge">￥</span>
        <span class="price">{{ product.price }}</span>
      </div>
    </div>
  </div>
  <div class="pagination" v-if="!isEmpty">
    <button @click="goToPage(1)">首页</button>
    <button @click="previousPage" :disabled="currentPage === 1">上一页</button>
    <template v-for="page in pageNumbers">
      <button v-if="page === currentPage" :class="{ 'current-page': true }" @click="goToPage(page)">{{ page }}</button>
      <button v-else @click="goToPage(page)">{{ page }}</button>
    </template>
    <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
    <button @click="goToPage(totalPages)">尾页</button>
  </div>
  <el-empty v-if="isEmpty" :image-size="300" image="http://1.14.126.98:5000/state/Search-empty.png"
            description="哇哦，您的搜索没有结果，这绝对是平行宇宙的错，换个关键词试试吧！">
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </el-empty>
</template>

<style scoped>
@import '../assets/Main.css';
</style>
