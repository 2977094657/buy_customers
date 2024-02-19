<template>
  <div ref="loader"
       class="drop-shadow-2xl z-[9999] absolute -top-14 flex-col w-full flex items-center justify-center"
       :style="{ transform: `translateY(${scrollDistance}px)`, display: isPullingDown ? '' : 'none' }">
    <div class="w-10 h-10 border-2 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full"></div>
    <div style="color: #ff5000">{{ loaderText }}</div>
  </div>

  <div ref="grid" class="smd:grid smd:grid-cols-2 lm:gap-x-2 smd:gap-x-6 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
    <div v-for="product in products" :key="product.productId" class="lm:hidden lm:p-0 group flex flex-col sm:flex-row product lm:mr-0 lm:mt-0 lm:bg-white lm:rounded-md"  @click="goToProduct(product.productId);addHistory(product.productId)"> <!-- 添加 flex 和 items-center -->
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
      <div v-if="product.loading" class="lm:w-full  smd:w-36 smd:h-36 overflow-hidden smd:rounded-md lm:rounded-t-md mr-auto"> <!-- 添加 mr-auto -->
        <img :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName" class="h-full w-full group-hover:opacity-75" />
      </div>
      <div class="flex-grow flex flex-col smd:justify-between"> <!-- 将标题和价格包裹在一个 div 中 -->
        <p style="color: rgb(51,51,51); margin-bottom: 5px" class="lm:ml-3 text-sm productName">{{ product.productName }}</p>
        <p class="lm:ml-3 text-lg font-medium text-gray900 price">
          <span style="font: 13px/2 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;font-family: 'Microsoft Yahei', serif;" class="text-sm">￥</span>
          <span>{{ integerPart(product.price) }}</span>
          <span class="text-sm">{{ decimalPart(product.price) }}</span>
        </p>
      </div>
    </div>
  </div>

<!--  手机端瀑布流布局组件-->
  <Waterfall class="smd:hidden" :list="list">
    <template #item="{ item }">
      <div class="rounded-lg overflow-hidden transition-all duration-300 ease-linear group">
        <div class="overflow-hidden" @click="goToProduct(item.productId);addHistory(item.productId)">
          <img v-if="item.img" :src="item.img.slice(1, -1).split(',')[0]"   alt=""/>
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
</template>


<script setup>
import {ref, onMounted, computed,onUnmounted} from 'vue'
import {useRouter} from "vue-router";
import { useStore } from '../../store/index'
const store = useStore()
import {addHistorys, getAllProductsRandomly} from "@/api/api";
import Waterfall from "@/components/tailwind/Waterfall.vue";

const currentPage = ref(1)
const totalPages = ref(1)
const products = ref([])
const list = ref([])
const randomSeed = computed(() => store.randomSeed); // 使用 Vuex 中保存的 randomSeed
const loadingMore = ref(false) // 添加 loadingMore 状态

const fetchProducts = async (page) => {
  loadingMore.value = true;
  const response = await getAllProductsRandomly(page, 12, randomSeed.value);
  const data = response.data
  // 当加载更多数据时，将新数据添加到 products 数组中，而不是替换它
  products.value = [...products.value, ...data.records.map(product => ({ ...product, loading: false }))]
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

window.onbeforeunload = function() {
  sessionStorage.clear();
}

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll) // 移除滚动事件监听器
})

const router = useRouter()

const goToProduct = (productId) => {
  // 本页面打开
  router.push({ name: 'Product', params: { productId } });
  // 新页面打开
  // const url = router.resolve({ name: 'Product', params: { productId } }).href;
  // window.open(url, '_blank');
}

const userid = computed(() => store.userInfo.userId)
const land = computed(() => store.userInfo.land)

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

let scrollDistance = ref(0);
let isPullingDown = ref(false);
let startY = ref(0);

const loader = ref(null);

let pullingDown = ref(false);

const handleTouchStart = (e) => {
  // 如果用户在顶部，那么开始记录下拉的距离
  if (window.scrollY === 0) {
    pullingDown.value = true;
    startY.value = e.touches[0].clientY;
    // 用户开始下拉时就显示下拉刷新的标签
    isPullingDown.value = true;
  }
};

let loaderText = ref(''); // 新增的 ref

const handleTouchMove = (e) => {
  if (pullingDown.value) {
    let pullDistance = (e.touches[0].clientY - startY.value);
    if (pullDistance > 0 && pullDistance <= window.innerHeight / 5) {
      scrollDistance.value = pullDistance;
      if (scrollDistance.value >= 100) {
        loaderText.value = '松手进行刷新'; // 当下拉距离超过设定值时，更新文本
      } else {
        loaderText.value = '继续下拉进行刷新'; // 当下拉距离未超过设定值时，更新文本
      }
    } else if (e.touches[0].clientY < startY.value) {
      // 用户上滑，取消下拉刷新
      pullingDown.value = false;
      scrollDistance.value = 0;
    }
  }
};

const handleTouchEnd = () => {
  if (scrollDistance.value >= 100) {
    const newRandomSeed = Math.floor(Math.random() * 10000);
    store.setRandomSeed(newRandomSeed);
    products.value = [];
    fetchProducts(1);
    loaderText.value = '松手进行刷新'; // 更新文本
  }
  isPullingDown.value = false;
  pullingDown.value = false;
  scrollDistance.value = 0;
};

onMounted(() => {
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchmove', handleTouchMove);
  window.addEventListener('touchend', handleTouchEnd);
});

onUnmounted(() => {
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', handleTouchEnd);
});
</script>

<style scoped>
@import '../../assets/Tailwind.css';
@import '../../assets/Main.css';
</style>
