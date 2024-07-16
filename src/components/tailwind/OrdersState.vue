<template>
  <div style="background-color: rgb(243,244,246)" class="lg:pt-10 mx-auto max-w-7xl sm:px-2 lg:px-8">
    <div class="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
      <div v-for="order in unpaidOrders" :key="order.orderLong"
           class="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
        <div class="flex items-center border-b border-gray-200 p-4 sm:grid sm:gap-x-6">
          <dl class="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-4 sm:grid-cols-4 lg:col-span-4">
            <div class="pr-4 sm:pr-6 lg:pr-8">
              <dt class="font-medium text-gray-900">订单号</dt>
              <dd class="mt-1 text-gray-500">{{ order.orderLong }}</dd>
            </div>
            <div style="width: 200px" class="hidden sm:block sm:pl-6 lg:pl-8">
              <dt class="font-medium text-gray-900">创建时间</dt>
              <dd class="mt-1 text-gray-500">
                <time :datetime="formatDate(order.createDate)">{{ formatDate(order.createDate) }}</time>
              </dd>
            </div>
            <div style="width: 200px" class="hidden sm:block sm:pl-6 lg:pl-8">
              <dt class="font-medium text-gray-900">付款时间</dt>
              <dd class="mt-1 text-gray-500">
                <time :datetime="formatDate(order.createDate)">{{ formatDate(order.createDate) }}</time>
              </dd>
            </div>
            <div class="ml-20">
              <dt class="font-medium text-gray-900">总计</dt>
              <dd style="color: #ff5000;" class="mt-1 font-medium text-gray-900">￥{{ order.price }}</dd>
            </div>
          </dl>
        </div>

        <!-- Products -->
        <h4 class="sr-only">Items</h4>
        <ul role="list" class="divide-y divide-gray-200">
          <li class="p-4 sm:p-6">
            <div class="flex items-center sm:items-start">
              <div class="h-20 w-20 mb-5 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                <img :src="order.product.img.slice(1, -1).split(',')[0]" alt=""
                     class="h-full w-full object-cover object-center"/>
              </div>
              <div class="ml-6 flex-1 text-sm">
                <div class="font-medium text-gray-900 sm:flex sm:justify-between">
                  <h5>{{ order.product.productName }}</h5>
                  <p style="color: #ff5000;" class="mt-2 sm:mt-0">￥{{ order.product.price }}</p>
                </div>

                <span class="font-medium text-sm text-gray-500">{{ order.product.name }}</span>
                <p>
                  <span class="font-medium text-sm text-gray-500">{{ order.address }}<span
                      class="ml-2">{{ order.consignee }}</span><span class="ml-1">{{ order.phone }}</span></span>
                </p>
                <!-- 创建时间和付款时间 -->
                <div class="flex flex-col sm:hidden">
                  <div>
                    创建时间：
                    <span class="mt-1 text-gray-500">
                      <time :datetime="formatDate(order.createDate)">{{ formatDate(order.createDate) }}</time>
                    </span>
                  </div>
                  <div>
                    付款时间：
                    <span class="mt-1 text-gray-500">
                      <time :datetime="formatDate(order.createDate)">{{ formatDate(order.createDate) }}</time>
                    </span>
                  </div>
                </div>
                <p>
                  备注：<span class="font-medium text-sm text-gray-500">{{ order.notes }}</span>
                  <span class="font-medium text-sm" v-if="!order.notes">暂无备注</span>
                </p>
                <p>
                  数量：<span class="font-medium text-sm text-gray-500">{{ order.productNumber }}</span>
                </p>
                <p>
                  付款方式：<span class="font-medium text-sm text-gray-500">{{ order.payMethod }}</span>
                </p>
                <p v-if="order.state!=='待付款'">
                  物流状态：
                  <span class="font-medium text-sm">
                    <span v-if="order.state==='待发货'" class="text-gray-500">{{ order.state }}</span>
                    <span v-else style="color: #67C23A">{{ order.state }}</span>
                  </span>
                </p>
                <p v-if="order.state==='待收货'">
                  发货时间：
                  <span class="font-medium text-sm text-gray-500">
                    <span>{{ formatDate(order.sendDate) }}</span>
                  </span>
                </p>
              </div>
            </div>

            <div v-if="order.state==='待评价'||order.state==='已完成'" class="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
              <div class="flex flex-1 justify-between">
                <p v-if="order.state==='待评价'" @click="goToReview(order.productId,order.orderLong,order.orderId)" style="cursor: pointer;color: rgb(255,112,0)">去评价</p>
                <p @click="open(order.orderId)" style="cursor: pointer;color: red">删除订单</p>
              </div>
            </div>
            <div v-if="order.state==='待收货'" class="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
              <div class="flex flex-1 justify-end">
                <p @click="receiving(order.orderId)" style="cursor: pointer;color: rgb(255,112,0)">确认收货</p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="unpaidOrders.length!==0&&props.state!=='待评价'" class="relative">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
          <div class="w-full border-t border-gray-300"/>
        </div>
        <div class="relative flex justify-center">
          <span style="background-color: rgb(243,244,246)" class="px-2 text-sm text-gray-500">没有更多了</span>
        </div>
      </div>

    </div>
    <el-empty v-if="unpaidOrders.length===0" :image-size="300"
              description="您的订单列表空白如纸，快去为它填充一些色彩吧！"
              image="http://124.221.7.201:5000/state/Order-empty.png"></el-empty>
  </div>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import { useStore } from '../../store/index'
const store = useStore()
import {deleteOrders, getOrdersByUserIdAndState, getProductById, receiveOrders} from "@/api/api";
import {router} from "@/router/router";

const userid = computed(() => store.userInfo.userId)
const land = computed(() => store.userInfo.land)
const unpaidOrders = ref([])

let currentMessageInstance = null
const props = defineProps({
  state: String
});

let empty = ref(''); // 传递给父组件的值
const emit = defineEmits(['update-empty']);
// 更新 empty 的值并将其传递给父组件时，调用这个函数
const updateEmpty = (value) => {
  empty.value = value;
  emit('update-empty', empty.value);
};
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

const showOrders = async () => {
  const response = await getOrdersByUserIdAndState(userid.value,props.state);

  if (response.data.code === 200) {
    let orderData = response.data.data;
    // 请求所有商品的数据
    const productRequests = orderData.map(order =>
  getProductById(order.productId).then(response => response.data)
);

    const productResponses = await Promise.all(productRequests);
    // 将商品数据添加到相应的订单中
    for (let i = 0; i < productResponses.length; i++) {
      const remainingTime = calculateRemainingTime(orderData[i].createDate);
      orderData[i] = {...orderData[i], product: productResponses[i].data, remainingTime};
    }
    // 对订单按剩余时间进行降序排序
    orderData.sort((a, b) => b.createDate - a.createDate);
    unpaidOrders.value = orderData;
  } else {
    updateEmpty(props.state)
    console.log(response.data.msg)
  }
}

// 当 land.value 变为 true 时加载购物车项
watch(land, (newVal) => {
  if (newVal === true) {
    showOrders();
  }
}, {immediate: true});

// 时间戳转换为正常时间
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

// 计算剩余时间的函数
const calculateRemainingTime = (createTime) => {
  const orderEndTime = createTime + 24 * 60 * 60 * 1000;  // 订单的结束时间
  const currentTime = Date.now();
  const remaining = Math.floor((orderEndTime - currentTime) / 1000);
  return remaining > 0 ? remaining : 0;  // 如果剩余时间小于0，返回0
}

const open = (id) => {
  ElMessageBox.confirm(
      '确认要删除此订单吗?',
      '删除订单',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  )
      .then(() => {
        deleteOrder(id)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

const receiving = (id) => {
  ElMessageBox.confirm(
      '确认收货吗?',
      '确认收货',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  )
      .then(() => {
        receiveOrder(id)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消收货',
        })
      })
}

const deleteOrder = async (id) => {
  try {
    const response = await deleteOrders(id);
    if (response.data.code === 200) {
      // 从未支付订单列表中删除该订单
      unpaidOrders.value = unpaidOrders.value.filter(order => order.orderId !== id);
      showSuccessMessage(response.data.msg)
    } else {
      console.log(response.data.msg)
    }
  } catch (error) {
    console.error("删除订单失败：", error);
  }
}

const receiveOrder = async (orderId) => {
  const response = await receiveOrders(orderId);

  if (response.data.code === 200) {
    // 更新订单状态
    const order = unpaidOrders.value.find(order => order.orderId === orderId);
    if (order) {
      order.state = '待评价';
      order.receiveDate = Date.now();  // 设置收货时间为当前时间
    }

    // 从订单列表中移除已经收货的订单
    unpaidOrders.value = unpaidOrders.value.filter(order => order.state !== '待评价');

    showSuccessMessage(response.data.msg)
  } else {
    showMessage("收货失败: " + response.data.msg);
  }
};

const goToReview = (productId,orderLong,orderId) => {
  // 生成一个唯一的随机数
  const id = Math.random().toString(36).substr(2);
  // 使用sessionStorage保存随机数和订单ID
  sessionStorage.setItem(id, JSON.stringify({ productId, orderLong, orderId }));

  const url = router.resolve({name: 'Reviews', params: { id }}).href;
  window.open(url, '_blank');
};



</script>

<style scoped>
@import '../../assets/Tailwind.css';

</style>
