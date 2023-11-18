<template>
  <div style="background-color: rgb(243,244,246)" class="mx-auto max-w-7xl">
    <div class="mx-auto max-w-2xl space-y-8">
      <div v-for="order in unpaidOrders" :key="order.orderLong"
           class="border-b border-t border-gray-200 bg-white shadow-sm">
        <div class="flex items-center border-b border-gray-200 p-4">
          <dl class="grid flex-1 grid-cols-2 gap-x-6 text-sm">
            <div class="pr-4">
              <dt class="font-medium text-gray-900">订单号</dt>
              <dd class="mt-1 text-gray-500">{{ order.orderLong }}</dd>
            </div>
            <div style="width: 200px" class="hidden">
              <dt class="font-medium text-gray-900">创建时间</dt>
              <dd class="mt-1 text-gray-500">
                <time :datetime="formatDate(order.createDate)">{{ formatDate(order.createDate) }}</time>
              </dd>
            </div>
            <div style="width: 200px" class="hidden">
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

          <Menu v-if="order.state==='待付款'" as="div" class="relative flex justify-end col-span-1">
            <div class="flex items-center">
              <MenuButton class="-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
                <span class="sr-only">Options for order {{ order.number }}</span>
                <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true"/>
              </MenuButton>
            </div>

            <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">

              <!--手机端按钮-->
              <MenuItems
                  class="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <p @click="open(order.orderLong)" class="text-red-500"
                       :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                      删除订单</p>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <p @click="ConfirmPay(order.orderLong)"
                       :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                      立即付款</p>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>

        <!-- Products -->
        <h4 class="sr-only">Items</h4>
        <ul role="list" class="divide-y divide-gray-200">
          <li class="p-4">
            <div class="flex items-center">
              <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                <img :src="order.product.img.slice(1, -1).split(',')[0]" alt=""
                     class="h-full w-full object-cover object-center"/>
              </div>
              <div class="ml-6 flex-1 text-sm">
                <div class="font-medium text-gray-900">
                  <h5>{{ order.product.productName }}</h5>
                  <p style="color: #ff5000;" class="mt-2">￥{{ order.product.price }}</p>
                </div>

                <span class="font-medium text-sm text-gray-500">{{ order.product.name }}</span>
                <p>
                  <span class="font-medium text-sm text-gray-500">{{ order.address }}<span
                      class="ml-2">{{ order.consignee }}</span><span class="ml-1">{{ order.phone }}</span></span>
                </p>
                <!-- 创建时间和付款时间 -->
                <div class="flex flex-col">
                  <div>
                    创建时间：
                    <span class="mt-1 text-gray-500">
                      <time :datetime="formatDate(order.createDate)">{{ formatDate(order.createDate) }}</time>
                    </span>
                  </div>
                  <div v-if="order.state!=='待付款'">
                    付款时间：
                    <span class="mt-1 text-gray-500">
                      <time :datetime="formatDate(order.createDate)">{{ formatDate(order.payDate) }}</time>
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
                <p v-if="order.state!=='待付款'">
                  付款方式：<span class="font-medium text-sm text-gray-500">{{ order.payMethod }}</span>
                </p>
                <p v-if="order.state!=='待付款'">
                  物流状态：
                  <span class="font-medium text-sm">
                    <span v-if="order.state==='待发货'" class="text-gray-500">{{ order.state }}</span>
                    <span v-else style="color: #67C23A">{{ order.state }}</span>
                  </span>
                </p>
                <p v-if="order.state==='已发货'">
                  发货时间：
                  <span class="font-medium text-sm text-gray-500">
                    <span>{{ formatDate(order.sendDate) }}</span>
                  </span>
                </p>
              </div>
            </div>

            <div v-if="order.state==='待付款'" class="mt-6 sm:flex sm:justify-between">
              <div class="flex items-center">
                <ClockIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
                <p class="ml-2 text-sm font-medium text-gray-500">
                  <span class="mr-6">剩余时间</span>
                  <time style="color: #ff5000;" :datetime="formatTime(order.remainingTime)">
                    {{ formatTime(order.remainingTime) }}
                  </time>
                </p>
              </div>
            </div>

            <div v-if="order.state==='已完成'" class="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
              <div class="flex flex-1 justify-end">
                <p @click="open(order.orderId)" style="cursor: pointer;color: red">删除订单</p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="unpaidOrders.length!==0" class="relative">
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
import {computed, onUnmounted, ref, watch} from "vue";
import store from "@/store";
import {confirmOrder, deleteOrders, deleteUnpaidOrder, getOrdersByUserId, getProductById} from "@/api/api";
import {ClockIcon} from "@heroicons/vue/20/solid";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";
import {EllipsisVerticalIcon} from "@heroicons/vue/24/outline";
import {ElNotification} from "element-plus";

const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
const unpaidOrders = ref([])
// 创建一个存储定时器ID的数组
const timers = [];

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

const showOrders = async () => {
  try {
    const response = await getOrdersByUserId(userid.value);

    if (response.data.code === 200) {
      let orderData = response.data.data;
      // 请求所有商品的数据
      const productRequests = orderData.map(order => getProductById(order.productId));
      const productResponses = await Promise.all(productRequests);
      // 将商品数据添加到相应的订单中
      for (let i = 0; i < productResponses.length; i++) {
        const remainingTime = calculateRemainingTime(orderData[i].createDate);
        orderData[i] = {...orderData[i], product: productResponses[i].data, remainingTime};
      }
      // 对订单按剩余时间进行降序排序
      orderData.sort((a, b) => b.createDate - a.createDate);
      unpaidOrders.value = orderData;

      // 启动定时器
      startTimer();
    } else if (response.data.code === 404) {
      // 如果没有未支付的订单，清空订单列表
      unpaidOrders.value = [];
    } else {
      console.log(response.data.msg)
    }
  } catch (error) {
    console.log(error);
  }
}


const startTimer = () => {
  setInterval(() => {
    unpaidOrders.value = unpaidOrders.value.map(order => {
      const remainingTime = calculateRemainingTime(order.createDate);
      return {...order, remainingTime};
    });
  }, 1000);
}

// 计算订单剩余时间
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const remainingAfterHours = totalSeconds - (hours * 3600);
  const minutes = Math.floor(remainingAfterHours / 60);
  const seconds = remainingAfterHours - (minutes * 60);
  return `${hours} 小时 ${minutes} 分 ${seconds} 秒`;
}


// 当组件卸载时，清除所有定时器
onUnmounted(() => {
  timers.forEach(clearInterval);
});

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

const deleteOrder = async (id) => {
  try {
    const response = await deleteUnpaidOrder(id,userid.value);
    if (response.data.code === 200) {
      // 从未支付订单列表中删除该订单
      unpaidOrders.value = unpaidOrders.value.filter(order => order.orderId !== id);
      await showOrders()
      showSuccessMessage(response.data.msg)
    } else {
      console.log(response.data.msg)
    }
  } catch (error) {
    console.error("删除订单失败：", error);
  }
}

const ConfirmPay = async (orderLong) => {
  try {
    const response = await confirmOrder(orderLong, userid.value);

    if (response.data.code === 200) {
      ElNotification({
        title: '支付成功',
        message: '订单支付成功，快去订单列表里看看吧！',
        type: 'success',
      });
      // 支付成功后，重新获取订单列表
      await showOrders();
    } else {
      console.error(response.data.msg);
    }
  } catch (error) {
    ElNotification({
      title: '支付失败',
      message: '订单已经支付过了，请不要反复支付哦',
      type: 'error',
    });
  }
};
</script>

<style scoped>
@import '../../../assets/Tailwind.css';

</style>
