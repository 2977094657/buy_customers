<template>
  <el-affix position="top">
    <div style="padding: 10px" class="z-[1] left-0 right-0 text-black flex justify-between bg-white">
      <p style="margin-top: 5px;">宝贝收藏<b style="color: rgb(255, 80, 0);margin-left: 10px">{{ totalCount }}</b></p>
      <div v-if="batchManageMode">
        <input class="button" style="margin-right: 5px" type="checkbox" v-model="selectAll" @change="handleSelectAllChange">
        <label style="border: none" for="selectAll" class="button">全选</label>
        <button style="margin-right: 20px" class="inline-flex justify-center rounded-md bg-red-500 px-2 py-1 text-sm font-semibold text-white shadow-sm transition duration-500 ease select-none hover:bg-red-600" @click="open1()">删除</button>
        <button class="button" @click="batchManageMode=false">取消管理</button>
      </div>
      <button v-else class="button" @click="batchManageMode=true">批量管理</button>
    </div>
  </el-affix>
  <div style="padding-left: 10px;padding-bottom: 10px" class="grid grid-cols-1 gap-x-6 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 xl:gap-x-8">
    <div v-for="(item, index) in cartItems" :key="item.id" class="group flex product" @click="goToProduct(item.productId);addHistory(item.productId)"> <!-- 添加 flex 和 items-center -->
      <div class="w-36 h-36 overflow-hidden rounded-lg mr-auto"> <!-- 添加 mr-auto -->
        <img :src="productResponses[index].data.img.slice(1, -1).split(',')[0]" class="h-full w-full"  alt=""/>
      </div>
      <div class="flex-grow flex flex-col justify-between">
        <p class="text-sm text-gray700 productName">{{ productResponses[index].data.productName }}</p>
        <div class="flex justify-between items-center">
          <span style="font-size: 10px;margin-left: 30px">{{ formatDate(item.time) }}</span>
        </div>

        <!-- 修改此处，使标题、价格和复选框在同一行 -->
        <div class="flex justify-between items-center">
          <p class="mt-l text-lg font-medium text-gray900 price"><span class="jge">￥</span>{{ productResponses[index].data.price }}</p>
          <!-- 添加复选框，并使用 v-if 控制其显示/隐藏 -->
          <input style="border-radius: 3px" type="checkbox" v-model="item.checked" v-if="batchManageMode" @click.stop>
        </div>
      </div>
    </div>
  </div>
  <el-empty v-if="empty" :image-size="350"
            description="发现更多精彩，将心动的宝贝加入收藏夹，随时回来再次欣赏！"
            image="http://124.221.7.201:5000/state/Star-empty.png"></el-empty>
</template>

<script setup>
import {ref, computed,watch} from 'vue'
import { useStore } from '../../../store/index'
const store = useStore()
import {router} from "@/router/router";
import {addHistorys, deleteAllStars, getProductById, selectStar} from "@/api/api";


const cartItems = ref([])
const productResponses = ref([])
const userid = computed(() => store.userInfo.userId)
const empty = ref(false)
const land = computed(() => store.userInfo.land)
const loading = ref(true)
const batchManageMode = ref(false)
const totalCount = ref(0);

const loadCartItems = async () => {
  loading.value = true
  if (land.value) {
    try {
      const response = await selectStar(userid.value);
      cartItems.value = response.data.data
      if (cartItems.value.length === 0) {
        empty.value = true
      }

      const productRequests = cartItems.value.map(item => getProductById(item.productId).then(response => response.data))
      console.log(productRequests)
      productResponses.value = await Promise.all(productRequests)
      // 数据加载完成后
      loading.value = false
      totalCount.value=cartItems.value.length
    } catch (error) {
    }
  } else {
    loading.value = false
    empty.value = true
  }
}

// 当 land.value 变为 true 时加载购物车项
watch(land, (newVal) => {
  if (newVal === true) {
    loadCartItems();
  }
}, { immediate: true });

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

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

const goToProduct = (productId) => {
  const url = router.resolve({name: 'Product', params: {productId}}).href;
  window.open(url, '_blank');
}

const open1 = () => {
  ElMessageBox.confirm(
      '确认要删除该宝贝吗?',
      '删除宝贝',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  )
      .then(() => {
        removeSelectedItems()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

const selectAll = ref(false)
const handleSelectAllChange = () => {
  for (const item of cartItems.value) {
    item.checked = selectAll.value
  }
}

const removeSelectedItems = async () => {
  const selectedIds = cartItems.value
      .filter(item => item.checked)
      .map(item => item.id)

  if (selectedIds.length === 0) {
    showMessage('请至少选择一个商品')
    return
  }

  try {
    const response = await deleteAllStars(selectedIds);

    showSuccessMessage(response.data.data)
    await loadCartItems()
  } catch (error) {
    showMessage('批量删除购物车商品失败')
  }
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
</script>

<style scoped>
@import '../../../assets/Tailwind.css';
@import '../../../assets/Main.css';
.button{
  margin-right: 20px;
  border: 1px solid #dcdcdc;
  padding: 5px;
  border-radius: 4px
}
</style>
