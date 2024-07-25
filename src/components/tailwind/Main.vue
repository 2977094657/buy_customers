<template>
  <div class="flex justify-between items-center ld:hidden">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="猜你喜欢" name="first"></el-tab-pane>
    </el-tabs>
    <a-tooltip title="点击切换视图" color="rgb(102,102,102)">
      <div class="mr-3 cursor-pointer">
        <svg @click="changeVertical" v-if="vertical" t="1715258974410" class="icon" viewBox="0 0 1024 1024"
             version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6098" width="25" height="25">
          <path
              d="M0 1024h445.215V578.785H0V1024z m44.52-400.695h356.176v356.176H44.52V623.305zM578.78 0v445.219H1024V0H578.781z m400.695 400.695H623.305V44.52h356.172v356.175zM578.781 1024H1024V578.785H578.781V1024z m44.524-400.695h356.172v356.176H623.305V623.305zM0 445.219h445.215V0H0v445.219z m44.52-400.7h356.176v356.177H44.52V44.52z"
              fill="" p-id="6099"></path>
        </svg>
        <svg @click="changeVertical" v-if="!vertical" t="1715258925284" class="icon" viewBox="0 0 1024 1024"
             version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4208" width="25" height="25">
          <path
              d="M993.05244445 128.34133333H843.88977778c-15.47377778 0-28.33066667 10.92266667-28.33066667 24.12088889v719.07555556c0 13.19822222 12.85688889 24.12088889 28.33066667 24.12088889h149.16266667c15.47377778 0 28.33066667-10.92266667 28.33066666-24.12088889V152.46222222c-0.11377778-13.08444445-12.97066667-24.12088889-28.33066666-24.12088889z m3.18577777 743.19644445c0 1.70666667-1.25155555 2.84444445-3.29955555 2.84444444h-149.04888889c-2.048 0-3.29955555-1.024-3.29955556-2.84444444V152.46222222c0-1.70666667 1.25155555-2.84444445 3.29955556-2.84444444h149.16266667c2.048 0 3.29955555 1.024 3.29955555 2.84444444v719.07555556zM722.03377778 128.34133333h-149.04888889c-15.47377778 0-28.33066667 10.92266667-28.33066667 24.12088889v719.07555556c0 13.19822222 12.85688889 24.12088889 28.33066667 24.12088889h149.16266666c15.47377778 0 28.33066667-10.92266667 28.33066667-24.12088889V152.46222222c-0.11377778-13.08444445-12.97066667-24.12088889-28.44444444-24.12088889z m3.29955555 743.19644445c0 1.70666667-1.25155555 2.84444445-3.29955555 2.84444444h-149.04888889c-2.048 0-3.29955555-1.024-3.29955556-2.84444444V152.46222222c0-1.70666667 1.25155555-2.84444445 3.29955556-2.84444444h149.16266666c2.048 0 3.29955555 1.024 3.29955556 2.84444444v719.07555556zM180.11022222 128.34133333H30.94755555c-15.47377778 0-28.33066667 10.92266667-28.33066666 24.12088889v719.07555556c0 13.19822222 12.85688889 24.12088889 28.33066666 24.12088889h149.16266667c15.47377778 0 28.33066667-10.92266667 28.33066667-24.12088889V152.46222222c0-13.08444445-12.85688889-24.12088889-28.33066667-24.12088889z m3.29955556 743.19644445c0 1.70666667-1.25155555 2.84444445-3.29955556 2.84444444H30.94755555c-2.048 0-3.29955555-1.024-3.29955555-2.84444444V152.46222222c0-1.70666667 1.25155555-2.84444445 3.29955555-2.84444444h149.16266667c2.048 0 3.29955555 1.024 3.29955556 2.84444444v719.07555556zM451.12888889 128.34133333H301.96622222c-15.47377778 0-28.33066667 10.92266667-28.33066667 24.12088889v719.07555556c0 13.19822222 12.85688889 24.12088889 28.33066667 24.12088889h149.16266667c15.47377778 0 28.33066667-10.92266667 28.33066666-24.12088889V152.46222222c-0.11377778-13.08444445-12.97066667-24.12088889-28.33066666-24.12088889z m3.18577778 743.19644445c0 1.70666667-1.25155555 2.84444445-3.29955556 2.84444444h-149.04888889c-2.048 0-3.29955555-1.024-3.29955555-2.84444444V152.46222222c0-1.70666667 1.25155555-2.84444445 3.29955555-2.84444444h149.16266667c2.048 0 3.29955555 1.024 3.29955556 2.84444444v719.07555556z"
              p-id="4209"></path>
        </svg>
      </div>
    </a-tooltip>
  </div>
  <div ref="grid" class="smd:grid smd:grid-cols-2 lm:gap-x-2 smd:gap-x-6 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
    <div v-if="vertical" v-for="product in products" :key="product.productId"
         class="lm:hidden lm:p-0 group flex flex-col sm:flex-row product lm:mr-0 lm:mt-0 lm:bg-white lm:rounded-md"
         @click="goToProduct(product.productId);addHistory(product.productId)"> <!-- 添加 flex 和 items-center -->
      <div style="display: none">
        <img @load="product.loading=true" :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName"
             width="100">
      </div>
      <div v-if="!product.loading">
        <el-skeleton :animated="true">
          <template #template>
            <el-skeleton-item class="w-36 h-36 overflow-hidden rounded-lg mr-auto" variant="image"
                              style="border-radius: 10px;"/>
          </template>
        </el-skeleton>
      </div>
      <div v-if="product.loading"
           class="lm:w-full  smd:w-36 smd:h-36 overflow-hidden smd:rounded-md lm:rounded-t-md mr-auto">
        <!-- 添加 mr-auto -->
        <img :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName"
             class="h-full w-full group-hover:opacity-75"/>
      </div>
      <div class="flex-grow flex flex-col smd:justify-between"> <!-- 将标题和价格包裹在一个 div 中 -->
        <p style="color: rgb(51,51,51); margin-bottom: 5px" class="lm:ml-3 text-sm productName">{{
            product.productName
          }}</p>
        <p class="lm:ml-3 text-lg font-medium text-gray900 price">
          <span
              style="font: 13px/2 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;font-family: 'Microsoft Yahei', serif;"
              class="text-sm">￥</span>
          <span>{{ integerPart(product.price) }}</span>
          <span class="text-sm">{{ decimalPart(product.price) }}</span>
        </p>
      </div>
    </div>
  </div>

  <div v-if="!vertical" class="bg-white lm:hidden">
    <div class="mx-auto">
      <div class="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
        <div @click="goToProduct(product.productId);addHistory(product.productId)" v-for="product in products"
             :key="product.productId" class="group relative VerticalProduct">
          <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none h-[230px]">
            <img :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName"
                 class="h-full w-full lg:h-full lg:w-full"/>
          </div>
          <div class="mt-4 justify-between">
            <div>
              <div style="max-width: 220px;max-height: 45px;overflow: hidden;height: 45px"
                   class="text-gray-700 ml-2 mb-3 text-base">
                {{ product.productName }}
              </div>
            </div>
            <p class="lm:ml-3 text-lg font-medium text-gray900 VerticalPrice ml-2">
              <span
                  style="font: 13px/2 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;font-family: 'Microsoft Yahei', serif;"
                  class="text-sm">￥</span>
              <span style="font-family: Alibaba Sans\ 102, sans-serif;">{{ integerPart(product.price) }}</span>
              <span class="text-sm">{{ decimalPart(product.price) }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--  手机端瀑布流布局组件-->
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <Waterfall :has-around-gutter="false" :animationDuration="0" class="smd:hidden mt-2 pr-1" :list="list">
        <template #item="{ item }">
          <div style="margin-bottom: -4px;margin-right: -4px;"
               class="rounded-lg overflow-hidden transition-all duration-300 ease-linear group">
            <div class="overflow-hidden" @click="goToProduct(item.productId);addHistory(item.productId)">
              <img v-if="item.img" :src="item.img.slice(1, -1).split(',')[0]" alt=""/>
              <div class="flex-grow flex flex-col smd:justify-between bg-white pb-2"> <!-- 将标题和价格包裹在一个 div 中 -->
                <div style="color: rgb(51,51,51);" class="lm:mx-3 text-sm productName ">{{ item.productName }}</div>
                <p class="lm:ml-3 text-lg font-medium text-gray900 price">
                  <span class="text-sm">￥</span>
                  <span>{{ integerPart(item.price) }}</span>
                  <span class="text-sm">{{ decimalPart(item.price) }}</span>
                </p>
              </div>
            </div>
          </div>
        </template>
      </Waterfall>
    </van-pull-refresh>

</template>


<script setup>
import {ref, onMounted, computed, onUnmounted} from 'vue'
import {router} from "@/router/router";
import {useStore} from '../../store/index'

const store = useStore()
import {addHistorys, getAllProductsRandomly} from "@/api/api";
import Waterfall from "@/components/tailwind/Waterfall.vue";

const currentPage = ref(1)
const totalPages = ref(1)
const products = ref([])
const list = ref([])
const randomSeed = computed(() => store.randomSeed); // 使用 Vuex 中保存的 randomSeed
const loadingMore = ref(false) // 添加 loadingMore 状态
const vertical = computed(() => store.userInfo.vertical)
const activeName = ref('first')

const fetchProducts = async (page) => {
  loadingMore.value = true;
  const response = await getAllProductsRandomly(page, 12, randomSeed.value).then(response => response.data);
  const data = response.data
  // 当加载更多数据时，将新数据添加到 products 数组中，而不是替换它
  products.value = [...products.value, ...data.records.map(product => ({...product, loading: false}))]
  // 更新 list 的值
  list.value = products.value.map(product => product);
  currentPage.value = data.current
  totalPages.value = data.pages
  loadingMore.value = false // 加载完成
}

const integerPart = (price) => {
  return String(price).split('.')[0];
};

const decimalPart = (price) => {
  const parts = String(price).split('.');
  return parts.length > 1 ? '.' + parts[1] : '';
};

// 在 checkScroll 函数中保存滚动位置和数据状态
const checkScroll = () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
  if (nearBottom && !loadingMore.value && currentPage.value < totalPages.value) {
    fetchProducts(currentPage.value + 1)
  }
  // 保存滚动位置和数据状态
  sessionStorage.setItem('scrollPosition', window.scrollY)
  sessionStorage.setItem('products', JSON.stringify(products.value))
  sessionStorage.setItem('currentPage', currentPage.value) // 保存 currentPage 的值
  sessionStorage.setItem('totalPages', totalPages.value) // 保存 totalPages 的值
}

// 在 onMounted 钩子中恢复滚动位置和数据状态
onMounted(() => {
  // 恢复数据状态
  const savedProducts = sessionStorage.getItem('products')
  if (savedProducts) {
    products.value = JSON.parse(savedProducts)
    list.value = products.value.map(product => product);
  } else {
    fetchProducts(currentPage.value)
  }
  // 恢复滚动位置
  const savedPosition = sessionStorage.getItem('scrollPosition')
  if (savedPosition) {
    window.scrollTo(0, savedPosition)
  }
  // 恢复 currentPage 和 totalPages 的值
  const savedCurrentPage = sessionStorage.getItem('currentPage')
  if (savedCurrentPage) {
    currentPage.value = Number(savedCurrentPage)
  }
  const savedTotalPages = sessionStorage.getItem('totalPages')
  if (savedTotalPages) {
    totalPages.value = Number(savedTotalPages)
  }
  window.addEventListener('scroll', checkScroll) // 添加滚动事件监听器
})

window.onbeforeunload = function () {
  sessionStorage.clear();
}

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll) // 移除滚动事件监听器
})

const goToProduct = (productId) => {
  // 本页面打开
  router.push({name: 'Product', params: {productId}});
  // 新页面打开
  // const url = routes.resolve({ name: 'Product', params: { productId } }).href;
  // window.open(url, '_blank');
}

const userid = computed(() => store.userInfo.userId)
const land = computed(() => store.userInfo.land)

const addHistory = async (productId) => {
  if (land.value) {
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

const grid = ref(null);
let observer;

onMounted(() => {
  observer = new MutationObserver(() => {
    grid.value.style.gridAutoRows = '';
    grid.value.querySelectorAll('.product').forEach((product) => {
      product.style.gridRowEnd = `span ${Math.ceil((product.clientHeight + 1) / parseInt(getComputedStyle(grid.value).getPropertyValue('grid-auto-rows')))}`
    });
  });

  observer.observe(grid.value, {
    childList: true,
    subtree: true,
  });
});

onUnmounted(() => {
  observer.disconnect();
});

const count = ref(0);
const loading = ref(false);

const onRefresh = () => {
  setTimeout(() => {
    const newRandomSeed = Math.floor(Math.random() * 10000);
    store.setRandomSeed(newRandomSeed);
    products.value = [];
    fetchProducts(1);
    loading.value = false;
    count.value++;
  }, 1000);
};

const changeVertical = () => {
  store.setUserInfo({
    vertical: !vertical.value
  });
}

</script>

<style scoped>
@import '../../assets/Tailwind.css';
@import '../../assets/Main.css';

::-webkit-scrollbar {
  display: none;
}

:deep( .el-tabs__item:hover) {
  color: #FF5000;
  cursor: pointer;
}

:deep( .el-tabs__item.is-active) {
  color: #FF5000;
  font-weight: bold;
  font-size: 16px;
}

:deep( .el-tabs__active-bar) {
  background-color: #FF5000;
  width: 65px;
}

/*去掉下划线*/
:deep( .el-tabs__nav-wrap::after) {
  position: static !important;
}
</style>
