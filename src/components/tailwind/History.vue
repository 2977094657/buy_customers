<template>
  <!-- 添加固定栏位 -->
  <div class="z-[1] fixed top-15 left-0 right-0 bg-white text-black flex justify-end p-4">
    <div v-if="batchManageMode">
      <button v-if="!empty" @click="open1" style="margin-right: 20px" class="inline-flex justify-center rounded-md bg-red-500 px-2 py-1 text-sm font-semibold text-white shadow-sm transition duration-500 ease select-none hover:bg-red-600">清除全部历史记录</button>
      <button class="button" @click="batchManageMode=false">取消管理</button>
    </div>
    <button v-else class="button" @click="batchManageMode=true">批量管理</button>
  </div>
  <!-- 添加等高度的空白块 -->
  <div style="height: 55px;"></div>
  <el-alert style="margin-top: 20px" title="我的足迹" type="info" description="仅保留最近30天的足迹哦" show-icon :closable="false"/>
  <div v-if="loading">
    <a-spin style="display: flex;justify-content: center;align-items: center;height: 50vh;" v-if="loading"
            tip="Loading..." size="large">
      <br>
    </a-spin>
  </div>
  <div v-else-if="!empty" class="history-list" style="z-index: 0">
    <div v-for="(itemData, date) in productsGroupedByDate" :key="date">
      <div class="relative">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
          <div class="w-full border-t border-gray-300" />
        </div>
        <div style="margin-top: 20px" class="relative flex justify-start">
          <span style="background-color: rgb(243,244,246)" class="pr-3 text-base font-semibold leading-6 text-gray-900">
            {{ formatYear(date) }}<span class="product-count">{{ itemData.count }}件宝贝</span>
          </span>
        </div>
      </div>
      <div class="card-group" style="z-index: 0">
        <el-card class="card" :shadow="'hover'"
                 v-for="item in itemData.items"
                 :key="item.data.productId"
                 @click="goToProduct(item.data.productId);addHistory(item.data.productId)"
                 @mouseenter="item.showDeleteIcon = true"
                 @mouseleave="item.showDeleteIcon = false">
          <div style="z-index: 0" class="card-content">
            <el-image class="product-image" :src="item.data.img.slice(1, -1).split(',')[0]" alt="product image"></el-image>
            <div class="delete-icon-container">
              <button style="padding: 5px;border-radius: 4px;margin-right: 0;background-color: rgb(252,235,235);color: rgb(220,48,48);border: none" v-if="batchManageMode" @click.stop="deleteHistory(item)">删除</button>
            </div>
            <div style="padding: 0 5px 0 5px">
              <p class="product-price">￥{{ item.data.price }}</p>
              <p class="product-name">{{ item.data.productName }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
  <el-empty v-if="empty" :image-size="350"
            description="看来你的浏览历史被外星人劫走了！快去看看我们的新品，让他们知道地球的好货！"
            image="http://124.221.7.201:5000/state/History-empty.png"></el-empty>
</template>

<script setup>
import {ref, computed,watch} from 'vue'
import store from "@/store";
import router from "@/router/router";
import {addHistorys, deleteAllHistory, deleteHistorys, getHistoryByUserId, getProductById} from "@/api/api";

const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
const empty = ref(false)
let productsGroupedByDate = ref({})
const loading = ref(true)
const batchManageMode = ref(false)

const showHistory = async () => {
  try {
    // 先清空 productsGroupedByDate
    productsGroupedByDate.value = {};
    const userId = userid.value
    const response = await getHistoryByUserId(userId);
    if (response.data.data.length === 0) {
      empty.value = true
    }
    if (response.data.code === 200) {
      const history = response.data.data
      for (let item of history) {
        const productResponse = await getProductById(item.productId);
        const date = new Date(item.timestamp)
        const dateString = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        const dateStringForDeletion = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        if (!productsGroupedByDate.value[dateString]) {
          productsGroupedByDate.value[dateString] = {items: [], count: 0}
        }
        productsGroupedByDate.value[dateString].items.push({
          time: timeString,
          data: productResponse.data,
          showDeleteIcon: false,
          dateForDeletion: dateStringForDeletion // 在这里保存 YYYY-MM-DD 格式的日期字符串
        })
        productsGroupedByDate.value[dateString].count++
      }
      for (let date in productsGroupedByDate.value) {
        productsGroupedByDate.value[date].items.sort((a, b) => b.time.localeCompare(a.time));
      }
      // 将对象转换为 [dateString， data] 对的数组
      let productsArray = Object.entries(productsGroupedByDate.value);
      // 按日期字符串的降序对数组进行排序（最近的日期在前）
      productsArray.sort(([dateStringA], [dateStringB]) => {
        const dateA = new Date(dateStringA.replace(/[年月日]/g, '-').replace('日', '')).getTime();
        const dateB = new Date(dateStringB.replace(/[年月日]/g, '-').replace('日', '')).getTime();
        return dateB - dateA;
      });
      // 将排序后的数组转换回对象
      productsGroupedByDate.value = Object.fromEntries(productsArray);
      loading.value = false
    }
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}

// 当 land.value 变为 true 时加载购物车项
watch(land, (newVal) => {
  if (newVal === true) {
    showHistory();
  }
}, { immediate: true });

const goToProduct = (productId) => {
  const url = router.resolve({name: 'Product', params: {productId}}).href;
  window.open(url, '_blank');
}

const formatYear = (date) => {
  const currentYear = new Date().getFullYear();
  const [year, month, day] = date.split(/[年月日]/);
  return currentYear.toString() === year ? `${month}月${day}日` : date;
}

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

const deleteHistory = async (item) => {
  try {
    const response = await deleteHistorys(userid.value, item.data.productId, item.dateForDeletion);

    if (response.data.code === 200) {
      // 删除成功后，从 productsGroupedByDate 中删除对应的商品
      const parts = item.dateForDeletion.split('-');
      const date = parts[0] + '年' + parseInt(parts[1], 10) + '月' + parseInt(parts[2], 10) + '日';

      if (productsGroupedByDate.value[date]) {
        const index = productsGroupedByDate.value[date].items.findIndex((i) => i.data.productId === item.data.productId);
        if (index !== -1) {
          productsGroupedByDate.value[date].items.splice(index, 1);
          // 如果该日期下的商品已经为空，那么删除此日期
          if (productsGroupedByDate.value[date].items.length === 0) {
            delete productsGroupedByDate.value[date];
          }
        }
      } else {
        console.error('Date not found in productsGroupedByDate:', date);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const open1 = () => {
  ElMessageBox.confirm(
      '确认要清空所有历史记录吗?',
      '清空历史记录',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  )
      .then(() => {
        clearAllHistory()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

// 添加清除全部历史记录的方法
const clearAllHistory = async () => {
  try {
    const response = await deleteAllHistory(userid.value);

    if (response.data.code === 200) {
      console.log('History cleared successfully');
      await showHistory()
    } else {
      console.error('Failed to clear history');
    }
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};
</script>

<style scoped>
@import '../../assets/Tailwind.css';
@import '../../assets/History.css';
@import '../../assets/Main.css';
.button{
  margin-right: 20px;
  border: 1px solid #dcdcdc;
  padding: 5px;
  border-radius: 4px
}
</style>
