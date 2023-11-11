<template>
  <div v-if="product&&empty" class="bg-white">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-0">
      <h1 class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">确认支付</h1>

      <div class="mt-12">
        <section class="mb-5" aria-labelledby="cart-heading">
          <hr>
          <ul role="list">
            <li class="flex py-6">
              <div class="flex-shrink-0">
                <!-- 您可以在这里添加产品图片 -->
                <img v-if="product && product.img" :src="product.img.slice(1, -1).split(',')[0]"
                     alt="your-image-description"
                     class="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"/>
              </div>

              <div class="ml-4 flex flex-1 flex-col sm:ml-6">
                <div>
                  <div>{{ product.productName }}</div>
                  <div class="mt-2 flex justify-between">
                    <h4 class="text-sm">
                      <a href="#" class="font-medium text-gray-700 hover:text-gray-800">{{ order.vendorName }}</a>
                    </h4>
                    <p class="price ml-4 text-sm font-medium text-gray-900">￥{{ order.price }}</p>
                  </div>
                  <!-- 您可以在这里添加其他的订单信息 -->
                </div>
              </div>
            </li>
            <li class="mt-10 space-y-6 text-sm font-medium text-gray-500">
              <div class="flex justify-between">
                <dt>数量</dt>
                {{ order.productNumber }}
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
                <dt>寄送至</dt>
                <dd class="text-gray-900">{{ order.address }}</dd>
              </div>
              <div class="flex justify-between">
                <dt>收件人</dt>
                <dd class="text-gray-900">{{ order.consignee }}<span style="margin-left: 10px">{{ order.phone }}</span>
                </dd>
              </div>
            </li>
          </ul>
        </section>
        <hr>
        <!-- Order summary -->
        <section aria-labelledby="summary-heading" class="mt-10">

          <div>
            <dl class="space-y-4">
              <div class="flex items-center justify-between">
                <dt class="text-base font-medium text-gray-900">总计</dt>
                <dd style="font: 700 26px tahoma;font-family: Verdana,Tahoma,arial,serif;color: #f40;"
                    class="ml-4 text-base font-medium text-gray-900">￥{{ order.price }}
                </dd>
              </div>
            </dl>
          </div>

          <div class="mt-10">
            <button @click="ConfirmPay" type="submit"
                    class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
              确认付款
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
  <div v-else>
    <h1 style="height: 400px" class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
      <el-empty :image-size="300"
                description="订单已经创建了，去我的订单看看吧！"
                image="http://124.221.7.201:5000/state/Star-empty.png"></el-empty>
    </h1>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import axios from 'axios';

let order = ref({});
let product = ref({});
let route = useRoute();
const empty = ref(true)

const getOrderInfo = async () => {
  const uniqueId = route.params.id;
  const orderNumber = sessionStorage.getItem(uniqueId);
  if (!orderNumber) {
    empty.value = false
    return;
  }

  try {
    const response = await axios.get('http://124.221.7.201:8081/order/getOrder', {
      params: {
        orderNumber
      }
    });

    if (response.data.code === 200) {
      order.value = response.data.data;
      await getProductInfo(order.value.productId);
    } else {
      console.error(response.data.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

const getProductInfo = async (productId) => {
  try {
    const response = await axios.get('http://124.221.7.201:8081/product/selectById', {
      params: {
        productId
      }
    });
    product.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(getOrderInfo);

const ConfirmPay = async () => {
  try {
    const response = await axios.post('http://124.221.7.201:8081/order/confirmOrder', {
      orderLong: order.value.orderLong,
      userId: 113
    });

    if (response.data.code === 200) {
      ElNotification({
        duration: 0,
        title: '支付成功',
        message: '订单支付成功，快去订单列表里看看吧！',
        type: 'success',
      });
    } else {
      console.error(response.data.msg);
    }
  } catch (error) {
    ElNotification({
      title: '支付失败',
      message: '订单已经支付过了，请不要反复支付哦',
      type: 'error',
    });
    // 禁用按钮
    document.querySelector('button[type="submit"]').disabled = true;
  }
};

</script>


<style scoped>
@import '../../assets/Tailwind.css';

.price {
  font-family: Verdana, Tahoma, arial, serif;
  color: #f40;
  font-weight: 700;
}
</style>
