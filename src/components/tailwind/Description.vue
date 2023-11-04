<template>
  <div class="bg-white">
    <div v-if="product && product.imgs" class="mx-auto max-w-2xl lg:max-w-7xl">
      <div style="margin-right: 10px" class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <!-- 图片库 -->
        <TabGroup as="div" class="flex flex-col">
<!--          商品大图-->
          <TabPanels class="aspect-h-1 aspect-w-1 w-full">
              <el-image style="border-radius: 10px" v-for="(img, index) in product.imgs" :key="index"
                        :src="img"
                        :zoom-rate="1.2"
                        :preview-src-list="product.img.slice(1, -1).split(', ')"
                        :initial-index="index"
                        fit="fill"
                        v-show="index === currentImageIndex" class="h-full w-full object-cover object-center sm:rounded-lg" :alt="product.productName"/>
          </TabPanels>

          <!-- 小图 -->
          <div class="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
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
        <div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 style="margin-bottom: 50px" class="text-3xl font-bold tracking-tight text-gray-900">{{ product.productName }}</h1>

          <div style="margin-bottom: 50px;cursor:pointer;background: linear-gradient(90deg, rgb(255, 119, 0), rgb(255, 73, 0))" @click="goToVendor(product.name)" class="flex justify-between items-center group relative overflow-hidden focus:ring-4 focus:ring-blue-300 px-10 py-5 rounded-lg text-white">
            <span style="font-size: 20px"><b>{{ product.name }}</b></span>
            <svg class="z-40 ml-2 -mr-1 w-3 h-3 transition-all duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            <div class="absolute inset-0 h-[200%] w-[200%] rotate-45 translate-x-[-70%] transition-all group-hover:scale-100 bg-white/30 group-hover:translate-x-[50%] z-20 duration-1000"></div>
          </div>

          <div style="margin-bottom: 50px" class="flex justify-between items-center">
            <p style="color: rgb(255,80,0);" class="text-3xl tracking-tight text-gray-900"><b>￥{{ product.price }}</b></p>
            <div>
              <span>购买数量&nbsp&nbsp</span>
              <el-input-number style="width: 100px" class="text-sm text-gray-600" v-model="num" :min="1" :max="50"/>
            </div>
          </div>

          <div style="margin-bottom: 50px" class="flex justify-between items-center">
            <div>
              收藏：<span style="color: #ff5000"><b>{{ product.star }}</b></span>
            </div>
            <button @click="addToFavorites" type="button" class="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
              <HeartIcon class="h-6 w-6 flex-shrink-0" aria-hidden="true" />
            </button>
          </div>


              <div class="flex justify-between items-center">
                <button @click="goToProduct(product.productId)" style="border-left: none; background: linear-gradient(90deg, rgb(255, 119, 0), rgb(255, 73, 0))" class="flex items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white middle none center bg-orange-500 font-sans uppercase shadow-md shadow-orange-500/20 transition-all hover:shadow-lg hover:shadow-orange-500/40" data-ripple-light="true">
                  立即购买
                </button>
                <button @click="addToCart" style="border-left: none; background: linear-gradient(90deg, rgb(255, 203, 0), rgb(255, 148, 2))" class="flex items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white middle none center bg-orange-500 font-sans uppercase shadow-md shadow-orange-500/20 transition-all hover:shadow-lg hover:shadow-orange-500/40" data-ripple-light="true">
                  加入购物车
                </button>
              </div>
        </div>
      </div>
      <ProductComments></ProductComments>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Tab,
  TabGroup,
  TabList,
  TabPanels,
} from '@headlessui/vue'
import { HeartIcon } from '@heroicons/vue/24/outline'
import {computed, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import router from "@/router/router";
import axios from 'axios'
import store from "@/store";
import ProductComments from "@/components/tailwind/ProductComments.vue";

const route = useRoute()
const product = ref()
const httpError = ref(false)
const currentImageIndex = ref(0)
const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
const childRef = ref();

const star = async () => {
  if (!isNaN(route.params.productId)) {
    try {
      const response = await fetch(`http://124.221.7.201:8081/product/selectById?productId=${route.params.productId}`);
      const data = await response.json();
      data.imgs = data.img.slice(1, -1).split(',');
      product.value = data;
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

onMounted(async () => {
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
    console.log(land.value)
    showMessage('请先登陆')
    return
  }
  try {
    const response = await axios.post(`http://124.221.7.201:8081/cart/add?userId=${userid.value}&productId=${route.params.productId}&quantity=${num.value}`);
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
  if (userid.value==null){
    showMessage('请先登陆')
  }

  axios.post('http://124.221.7.201:8081/star/staradd', {
    userId: userid.value,
    productId: route.params.productId
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [(data) => {
      let ret = '';
      for (let key in data) {
        ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
      }
      return ret;
    }]
  }).then(response => {
    if (response.data.code===-1){
      showMessage(response.data.msg)
    }else if (response.data.code===0){
      showSuccessMessage(response.data.data);
      star()
    }
  }).catch(error => {
    console.error('添加到收藏夹时出错：', error);
  });
}

const goToProduct = (productId) => {
  if(land.value){
    const url = router.resolve({ name: 'purchase', params: { productId } }).href;
    window.open(url, '_blank');
  }else {
    showMessage("请先登陆")
  }
}

const goToVendor = (name) => {
  const url = router.resolve({ name: 'vendor', params: { name } }).href;
  window.open(url, '_blank');
}
</script>

<style scoped>
@import '../../assets/Tailwind.css';
</style>
