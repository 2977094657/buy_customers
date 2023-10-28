<script setup>
import {ref, computed, onMounted} from 'vue';
import axios from 'axios';
import {watchEffect} from 'vue';
import router from "@/router/router";
import HighlightText from '../HighlightText.vue';
import store from "@/store";


const products = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const props = defineProps({
  keyword: String
});

onMounted(() => {
  goToPage(1)
})

const executeSearch = async (page = 1) => {
  try {
    const response = await axios.get('http://124.221.7.201:8081/product/search', {
      params: {keyword: props.keyword, page},
    });
    // 在每个产品对象中添加一个 loading 字段
    products.value = response.data.records.map(product => ({
      ...product,
      loading: true, // 设置为 true 表示正在加载
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
        <img @load="product.loading=false" :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName" width="100" >
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
        <p class="text-sm text-gray700 productName">
            <HighlightText :text="product.productName" :keyword="props.keyword"/>
        </p>
        <p class="mt-l text-lg font-medium text-gray900 price"><span class="jge">￥</span>{{ product.price }}</p>
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
  <el-empty v-if="isEmpty" :image-size="300" image="http://124.221.7.201:5000/state/Search-empty.png"
            description="哇哦，您的搜索没有结果，这绝对是平行宇宙的错，换个关键词试试吧！">
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </el-empty>
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

button {
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  margin: 0 5px;
  font-size: 16px;
  cursor: pointer;
}

button[disabled] {
  background-color: #ddd;
  cursor: not-allowed;
}
.current-page {
  background-color: #ff9c76; /* 这是当前页的背景色 */
  color: white; /* 这是当前页的文本色 */
}

/* 首页和尾页的颜色 */
button:first-child, button:last-child {
  background-color: #e15f00; /* 首页和尾页的背景色 */
  color: white; /* 首页和尾页的文本色 */
}

/* 上一页和下一页的颜色 */
button:nth-child(2), button:nth-last-child(2) {
  border: 1px #dddddd solid;
  background-color: white; /* 上一页和下一页的背景色 */
  color: black; /* 上一页和下一页的文本色 */
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 7% 0 7% -3%; /* 上下都有 20px 的外边距，左右没有额外的外边距 */
}
</style>
