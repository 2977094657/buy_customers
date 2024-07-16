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

            <button @click="submitOrder('微信')" style="background-color: rgb(34,172,56);padding: 0;margin-top: 20px" type="button" class="flex w-full items-center justify-center rounded-md border border-transparent py-2 text-white">
              <svg style="margin-right: 20px" class="icon w-auto" viewBox="0 0 1144 1024" xmlns="http://www.w3.org/2000/svg"
                   data-immersive-translate-effect="1" data-immersive_translate_walked="b30582c9-8265-4ce0-a4ff-61d877fe3166" width="40" height="40px"><path d="M436.314353 632.771765c-68.517647 36.321882-78.667294-20.389647-78.667294-20.389647l-85.835294-190.524236c-33.039059-90.533647 28.581647-40.839529 28.581647-40.839529s52.856471 38.038588 93.003294 61.229176c40.086588 23.190588 85.835294 6.806588 85.835294 6.806589l561.212235-246.362353C936.899765 80.112941 765.891765 0 572.235294 0 256.180706 0 0 213.232941 0 476.310588c0 151.311059 84.811294 285.967059 216.937412 373.248l-23.792941 130.288941s-11.625412 38.038588 28.611764 20.389647c27.437176-12.047059 97.370353-55.115294 138.992941-81.347764 65.445647 21.684706 136.734118 33.731765 211.486118 33.731764 316.024471 0 572.235294-213.232941 572.235294-476.310588 0-76.197647-21.594353-148.178824-59.843764-212.028235-178.808471 102.309647-594.733176 340.118588-648.312471 368.489412z" fill="#ffffff"
                                                                                                                                                             data-spm-anchor-id="a313x.search_index.0.i0.59253a815x8kRp" class="selected" data-immersive-translate-effect="1" data-immersive_translate_walked="b30582c9-8265-4ce0-a4ff-61d877fe3166"></path></svg>
              <span>微信支付</span>
            </button>
            <button @click="submitOrder('支付宝')" style="background-color: rgb(34,107,243);padding: 0;margin-top: 20px" type="button" class="flex w-full items-center justify-center rounded-md border border-transparent py-2 text-white">
              <AlipayOutlined class="w-auto" fill="currentColor" style="color: white;font-size: 40px;margin-right: 20px"/>
              <span>支付宝支付</span>
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AlipayOutlined } from '@ant-design/icons-vue';

import {computed, onMounted, ref,watch } from 'vue'
import {useRoute} from 'vue-router'
import { useStore } from '../../store/index'
const store = useStore()
import {router} from "@/router/router";
import OrdersAddress from "@/components/tailwind/OrdersAddress.vue";
import {addHistorys, addOrder, getProductById} from "@/api/api";

const route = useRoute()
const product = ref()
const httpError = ref(false)
const userid = computed(() => store.userInfo.userId)
const land = computed(() => store.userInfo.land)
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

watch(productNumber, (newVal) => {
  if (newVal === null || newVal === '' || newVal < 1) {
    productNumber.value = 1;
  }
});

const star = async () => {
  if (!isNaN(route.params.productId)) {
    try {
      const response = await getProductById(route.params.productId);
      const data = response.data.data;
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

const submitOrder = async (paymentMethod) => {
  if (!land.value){
    showMessage('请先登陆')
  }
  if (!selectedAddress.value) {
    showMessage('请选择地址');
    return;
  }

  try {
    const response = await addOrder(product.value.name, userid.value, selectedAddress.value.address+' '+selectedAddress.value.fullAddress, product.value.price * productNumber.value, product.value.productId, productNumber.value, selectedAddress.value.consignee, selectedAddress.value.phoneNumber, text.value, paymentMethod);

    if (response.data.code === 200) {
      // 生成一个唯一的随机数
      const id = Math.random().toString(36).substr(2);
      // 在这里添加支付跳转逻辑
      sessionStorage.setItem(id, response.data.data.orderLong);
      if (paymentMethod === '微信') {
        // 微信支付跳转逻辑
        showSuccessMessage("订单创建成功")
        setTimeout(() => {
          const url = router.resolve({
            name: 'ConfirmPay',
            params: { id }
          }).href;
          window.open(url, '_blank');
        }, 500);
      } else if (paymentMethod === '支付宝') {
        // 支付宝支付跳转逻辑
        showSuccessMessage("订单创建成功")
        setTimeout(() => {
          const url = router.resolve({
            name: 'ConfirmPay',
            params: { id }
          }).href;
          window.open(url, '_blank');
        }, 500);
      }
    } else {
      showSuccessMessage(response.data.msg)
    }
  } catch (error) {
    console.error(error);
    showMessage('订单提交失败');
  }
};

</script>

<style scoped>
@import '../../assets/Tailwind.css';
.price{
  font-family: Verdana,Tahoma,arial,serif;color: #f40;font-weight: 700;
}
</style>
