<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pb-24 sm:pt-8 lg:px-8 xl:px-2 xl:pt-14">
      <div class="mx-auto grid max-w-lg grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
        <div class="mx-auto w-full max-w-lg">
          <div class="flow-root">
            <ul role="list" class="-my-6 divide-y divide-gray-200">
              <li v-if="product && product.imgs" :key="product.id" class="flex space-x-6 py-6">
                <img @click="goToProduct(product.productId)" :src="product.img.slice(1, -1).split(',')[0]" :alt="product.imageAlt" class="h-24 w-24 flex-none rounded-md bg-gray-100" />
                <div class="flex-auto">
                  <div class="space-y-1 sm:flex sm:items-start sm:justify-between sm:space-x-6">
                    <div class="flex-auto space-y-1 text-sm font-medium">
                      <div class="flex justify-between">
                        {{ product.productName }}
                        <p class="price">￥{{ product.price }}</p>
                      </div>
                      <p class="text-gray-500">{{ product.name }}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <dl v-if="product && product.imgs" class="mt-10 space-y-6 text-sm font-medium text-gray-500">
            <div class="flex justify-between">
              <dt>数量</dt>
              <el-input-number style="width: 90px" size="small" @click.stop class="number1" v-model="productNumber" :min="1" :max="100" />
            </div>
            <div class="flex justify-between">
              <dt>店铺优惠</dt>
              <dd class="text-gray-900 price">-￥0.00</dd>
            </div>
            <div class="flex justify-between">
              <dt>邮费</dt>
              <dd class="text-gray-900 price">￥0.00</dd>
            </div>
            <div class="flex justify-between">
              <dt>总计</dt>
              <dd class="text-gray-900 price">￥{{ productNumber * product.price }}</dd>
            </div>
            <div class="flex justify-between border-t border-gray-200 pt-6 text-gray-900">
              <dt class="text-base">实付款</dt>
              <dd class="text-base" style="font: 700 26px tahoma;font-family: Verdana,Tahoma,arial,serif;color: #f40;">
                ￥{{ productNumber * product.price }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="mx-auto w-full max-w-lg">
          <div style="margin-bottom: 20px">
            <div style="font-weight: bold;margin-bottom: 5px">订单备注</div>
            <div>
              <el-input resize="none" size="large" v-model="text" maxlength="200" placeholder="选填，请先和商家协商一致，付款后商家可见" show-word-limit type="textarea"/>
            </div>
          </div>
          <div class="mt-1">
            <OrdersAddress class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></OrdersAddress>
          </div>


            <div class="mt-6 flex space-x-2">
              <div class="flex h-5 items-center">
                <input id="terms" name="terms" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              </div>
              <label for="terms" class="text-sm text-gray-500">我已经阅读了条款和条件，并同意将我的个人信息出售给出价最高的人</label>
            </div>

            <button style="background-color: rgb(34,172,56);padding: 0;margin-top: 20px" type="button" class="flex w-full items-center justify-center rounded-md border border-transparent py-2 text-white">
              <WechatOutlined class="w-auto" fill="currentColor" style="color: white;font-size: 40px;margin-right: 20px"/>
              <span>微信支付</span>
            </button>
            <button style="background-color: rgb(34,107,243);padding: 0;margin-top: 20px" type="button" class="flex w-full items-center justify-center rounded-md border border-transparent py-2 text-white">
              <AlipayOutlined class="w-auto" fill="currentColor" style="color: white;font-size: 40px;margin-right: 20px"/>
              <span>支付宝支付</span>
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { WechatOutlined,AlipayOutlined } from '@ant-design/icons-vue';

import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import store from "@/store";
import router from "@/router/router";
import axios from "axios";
import OrdersAddress from "@/components/tailwind/OrdersAddress.vue";

const route = useRoute()
const product = ref()
const httpError = ref(false)
const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
const childRef = ref();
const productNumber = ref(1)
const select = ref()
const text = ref()
let selectedAddress = ref(null);

onMounted(() => {
  // 监听事件并接收数据
  window.addEventListener('selected-address-changed', (event) => {
    selectedAddress.value = event.detail;
  });
});

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

let currentMessageInstance = null
const showMessage = (message) => {
  // 如果当前有消息正在显示，先关闭它
  if (currentMessageInstance) {
    currentMessageInstance.close()
  }

  // 显示新的消息并保存该消息实例
  currentMessageInstance = ElMessage({message, type: 'error'})
}
</script>

<style scoped>
@import '../../assets/Tailwind.css';
.price{
  font-family: Verdana,Tahoma,arial,serif;color: #f40;font-weight: 700;
}
</style>
