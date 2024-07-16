<template>
  <a-modal :footer="null" :maskClosable="false" v-model:open="open" @ok="handleOk">
    <Login></Login>
  </a-modal>
  <div class="bg-white">
    <div v-if="product && product.imgs" class="mx-auto max-w-2xl lg:max-w-7xl">
      <div class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <!-- 图片库 -->
        <TabGroup as="div" class="flex flex-col">
          <!-- 手机轮播图-->
          <el-carousel class="sm:hidden" :arrow=state>
            <el-carousel-item v-for="(img, index) in product.imgs" :key="index">
              <img :src="img" class="lm:rounded-none h-full w-full sm:rounded-lg" :alt="product.productName"/>
            </el-carousel-item>
          </el-carousel>

<!--          PC大图-->
          <TabPanels class="lm:hidden w-full">
            <el-image v-for="(img, index) in product.imgs" :key="index"
                      :src="img"
                      :zoom-rate="1.2"
                      :preview-src-list="product.img.slice(1, -1).split(', ')"
                      :initial-index="index"
                      fit="fill"
                      v-show="index === currentImageIndex"
                      class="lm:rounded-none h-full w-full object-cover object-center sm:rounded-lg" :alt="product.productName"/>
          </TabPanels>

          <!-- 小图在手机尺寸隐藏 -->
          <div class="lm:hidden mx-auto mt-6 w-full max-w-2xl lg:max-w-none hidden md:block">
            <TabList class="grid grid-cols-5 sm:grid-cols-5 gap-6">
              <Tab v-for="(img, index) in product.imgs" :key="index" class="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900" v-slot="{ selected }">
      <span class="absolute inset-0 overflow-hidden rounded-md">
        <img :src="img" @mouseover="currentImageIndex = index" class="h-full w-full object-cover object-center" :alt="product.productName">
      </span>
                <span class="pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2" aria-hidden="true" />
              </Tab>
            </TabList>
          </div>
        </TabGroup>

        <!-- 产品信息 -->
        <div class="mt-1 px-4 sm:px-0 lg:mt-0">
          <div class="sm:hidden flex justify-between items-center">
            <p style="color: rgb(255,80,0);" class="sm:hidden text-3xl tracking-tight text-gray-900">
              <b class="text-sm">￥</b>
              <span class="font-semibold">{{ integerPart(product.price) }}</span>
              <span class="text-2xl">{{ decimalPart(product.price) }}</span>
            </p>
            <p class="text-gray-400">已售&nbsp&nbsp{{product.buys}}</p>
          </div>

          <div style="margin-bottom: 50px" class="sm:hidden text-lg text-gray-800 font-semibold tracking-tight">
            {{product.productName }}
          </div>

          <!--          手机端底栏-->
            <van-action-bar class="sm:hidden px-3 py-7 w-full z-10 items-center border-t-[1px]">
              <van-action-bar-icon style="font-size: 13px" class="text-neutral-400" @click="goToVendor(product.name)" icon="shop-o" text="店铺" />
              <van-action-bar-icon style="font-size: 13px" class="text-neutral-400" @click="addToFavorites()" v-if="!isFavorite" icon="star-o" text="收藏" />
              <van-action-bar-icon @click="addToFavorites()" v-else icon="star" text="已收藏" color="#ff5000" />
              <van-action-bar-button @click="addToCart" class="text-white rounded-l-lg" style="background: linear-gradient(90deg, rgb(255, 203, 0), rgb(255, 148, 2))" text="加入购物车" />
              <van-action-bar-button @click="goToProduct(product.productId);showModal();" class="text-white rounded-r-lg" style="background: linear-gradient(90deg, rgb(255, 119, 0), rgb(255, 73, 0))" text="立即购买" />
            </van-action-bar>

          <div style="line-height: 28px;
    color: #000;
    letter-spacing: 0;
    font-size: 20px;
    font-family: PingFang SC,sans-serif;
    font-weight: 900;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;" class="lm:hidden text-3xl font-bold tracking-tight text-gray-900">
            {{product.productName }}
          </div>
          <p class="text-gray-400 mb-10 mt-1 lm:hidden">已售&nbsp&nbsp{{product.buys}}</p>

          <div
              style="margin-bottom: 50px;cursor:pointer;background: linear-gradient(90deg, rgb(255, 119, 0), rgb(255, 73, 0))"
              @click="goToVendor(product.name)"
              class="lm:hidden flex justify-between items-center group relative overflow-hidden focus:ring-4 focus:ring-blue-300 px-10 py-5 rounded-lg text-white">
            <span style="font-size: 20px"><b>{{ product.name }}</b></span>
            <svg class="z-40 ml-2 -mr-1 w-3 h-3 transition-all duration-300 group-hover:translate-x-1"
                 fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
            </svg>
            <div
                class="absolute inset-0 h-[200%] w-[200%] rotate-45 translate-x-[-70%] transition-all group-hover:scale-100 bg-white/30 group-hover:translate-x-[50%] z-20 duration-1000"></div>
          </div>

          <div style="margin-bottom: 50px" class="flex justify-between items-center">
            <p style="color: rgb(255,80,0);" class="lm:hidden text-3xl tracking-tight text-gray-900">
              <b>￥<span>{{ integerPart(product.price) }}</span><span class="text-2xl">{{ decimalPart(product.price) }}</span></b>
            </p>
            <div class="lm:hidden">
              <van-action-bar-icon @click="addToFavorites()" v-if="!isFavorite" icon="star-o" />
              <van-action-bar-icon @click="addToFavorites()" v-else icon="star" color="#ff5000" />
            </div>
            <div class="sm:hidden" @click="goToVendor(product.name)">
              <span>{{ product.name }}</span>
            </div>
          </div>

          <div class="lm:hidden flex justify-between items-center">
            <button @click="goToProduct(product.productId)"
                    style="border-left: none; background: linear-gradient(90deg, rgb(255, 119, 0), rgb(255, 73, 0))"
                    class="flex items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white middle none center bg-orange-500 font-sans uppercase shadow-md shadow-orange-500/20 transition-all hover:shadow-lg hover:shadow-orange-500/40"
                    data-ripple-light="true">
              立即购买
            </button>
            <button @click="addToCart"
                    style="border-left: none; background: linear-gradient(90deg, rgb(255, 203, 0), rgb(255, 148, 2))"
                    class="flex items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white middle none center bg-orange-500 font-sans uppercase shadow-md shadow-orange-500/20 transition-all hover:shadow-lg hover:shadow-orange-500/40"
                    data-ripple-light="true">
              加入购物车
            </button>
          </div>

        </div>
      </div>
      <ProductComments></ProductComments>

    </div>
    <div v-else>
      <el-empty :image-size="300"
                image="http://124.221.7.201:5000/state/ProductDelisting-empty.png"
                description="商品下架了，去看看其他商品吧！"/>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {Tab, TabGroup, TabList, TabPanels,} from '@headlessui/vue'
import {computed, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {router} from "@/router/router";
import { useStore } from '../../store/index'
const store = useStore()
import ProductComments from "@/components/tailwind/ProductComments.vue";
import {addToCarts, addToFavorite, getProductById, selectStar} from "@/api/api";
import Login from "@/components/tailwind/Login.vue";

const route = useRoute()
const product = ref()
const httpError = ref(false)
const currentImageIndex = ref(0)
const userid = computed(() => store.userInfo.userId)
const land = computed(() => store.userInfo.land)
const childRef = ref();
let open = ref(false)

const handleOk = () => {
  open.value = false
}

const showModal = () => {
  if (land.value) {
    return
  }
  open.value = true
}

let deviceType = ref(null);
const state = ref('hover')

onMounted(() => {
  setTimeout(() => {
    deviceType.value = store.deviceType;
    if (deviceType.value==='iPhone'||deviceType.value==='Android'){
      state.value='always'
    }
  }, 1000); // 延迟  秒
});

const star = async () => {
  if (!isNaN(route.params.productId)) {
    try {
      const response = await getProductById(route.params.productId);
      if (response.data.code===200){
        const data = response.data.data;
        data.imgs = data.img.slice(1, -1).split(',');
        product.value = data;
      }else {
        showMessage("请求出错，请稍后再试")
      }
    } catch (error) {
      if (error.message.startsWith('HTTP error 404')) { // 如果是 404 错误，设置 httpError 为 true
        childRef.value.switchShow()
        httpError.value = true;
      }
    }
  } else {
    httpError.value = true;
    childRef.value.switchShow()
  }
}

const integerPart = (price) => {
  return String(price).split('.')[0];
};

const decimalPart = (price) => {
  const parts = String(price).split('.');
  return parts.length > 1 ? '.' + parts[1] : '';
};

onMounted(async () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 300); // 延迟  秒
  await star()
})

const num = ref(1)

let currentMessageInstance = null
const showMessage = (message) => {
  // 如果当前有消息正在显示，先关闭它
  if (currentMessageInstance) {
    currentMessageInstance.close()
  }

  // 显示新的消息并保存该消息实例
  currentMessageInstance = ElMessage({message, type: 'error'})
}

const showSuccessMessage = (message) => {
  // 如果当前有消息正在显示，先关闭它
  if (currentMessageInstance) {
    currentMessageInstance.close()
  }

  // 显示新的消息并保存该消息实例，消息类型设置为 'success'
  currentMessageInstance = ElMessage({message, type: 'success'})
}
const addToCart = async () => {
  if (!land.value) {
    showMessage('请先登陆')
    return
  }
  try {
    const response = await addToCarts(userid.value, route.params.productId, 1);
    if (response.data.message === '您的购物车商品总数已满，请先清理后继续加入购物车') {
      showMessage(response.data.message)
      return
    }
    showSuccessMessage(response.data.message)
  } catch (error) {
    console.error(error);
  }
}

async function addToFavorites() {
  if (userid.value == null||userid.value==='') {
    showMessage('请先登陆')
    return
  }

  addToFavorite(userid.value,route.params.productId)
      .then(async response => {
        if (response.data.code === -1) {
          showMessage(response.data.msg)
        } else if (response.data.code === 0) {
          showSuccessMessage(response.data.data);
          // 直接更新 isFavorite 的值，而不是再次调用 selectStar API
          isFavorite.value = !isFavorite.value;
          await star()
        }
      }).catch(error => {
    console.error('添加到收藏夹时出错：', error);
  });
}


const goToProduct = (productId) => {
  if (land.value) {
    const url = router.resolve({name: 'purchase', params: {productId}}).href;
    window.open(url, '_blank');
  } else {
    showMessage("请先登陆")
  }
}

const goToVendor = (name) => {
  const url = router.resolve({name: 'vendor', params: {name}}).href;
  window.open(url, '_blank');
}

let isFavorite = ref(false) // 创建一个响应式变量来存储当前商品是否被收藏

onMounted(async () => {
  await star()
  if (land.value){
    const response = await selectStar(userid.value)
    // 检查返回的数据中是否包含当前页面的商品 ID
    isFavorite.value = response.data.some(item => item.productId === Number(route.params.productId))
  }
})
</script>

<style scoped>
@import '../../assets/Tailwind.css';
:deep(.van-action-bar-icon__icon){
  font-size: 20px;
}
</style>
