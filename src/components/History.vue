<template>
  <div v-if="loading">
    <a-spin style="display: flex;justify-content: center;align-items: center;height: 50vh;" v-if="loading"
            tip="Loading..." size="large">
      <br>
    </a-spin>
  </div>
  <div v-else-if="!empty" class="history-list">
    <div v-for="(itemData, date) in productsGroupedByDate" :key="date">
      <el-divider content-position="left" class="history-date">
        <h1>
          {{ formatYear(date) }}
          <span class="product-count">{{ itemData.count }}件宝贝</span>
        </h1>
      </el-divider>
      <div class="card-group">
        <el-card class="card" :shadow="'hover'"
                 v-for="item in itemData.items"
                 :key="item.data.productId"
                 @click="goToProduct(item.data.productId);addHistory(item.data.productId)"
                 @mouseenter="item.showDeleteIcon = true"
                 @mouseleave="item.showDeleteIcon = false">
          <div class="card-content">
            <el-image class="product-image" :src="item.data.img.slice(1, -1).split(',')[0]" alt="product image"></el-image>
            <div class="delete-icon-container" :class="{ 'highlight': item.showDeleteIcon }">
              <el-icon class="delete-icon" v-show="item.showDeleteIcon" @click.stop="deleteHistory(item);">
                <Delete />
              </el-icon>
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
  <el-button v-if="!empty" class="clear-all-history" @click="clearAllHistory" key="danger" type="danger" text>清除全部历史记录</el-button>
  <el-empty v-if="empty" style="margin: 0 0 0 0" :image-size="350"
            description="看来你的浏览历史被外星人劫走了！快去看看我们的新品，让他们知道地球的好货！"
            image="http://1.14.126.98:5000/state/History-empty.png"></el-empty>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import axios from 'axios'
import store from "@/store";
import router from "@/router/router";
import {Delete} from "@element-plus/icons-vue";

const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
const empty = ref(false)
let productsGroupedByDate = ref({})
const loading = ref(true)

onMounted(async () => {
  await showHistory()
})

const showHistory = async () => {
  try {
    // 先清空 productsGroupedByDate
    productsGroupedByDate.value = {};
    const userId = userid.value
    const response = await axios.get(`http://1.14.126.98:8081/user/getHistoryByUserId?userId=${userId}`)
    if (response.data.data.length === 0) {
      empty.value = true
    }
    if (response.data.code === 200) {
      const history = response.data.data
      for (let item of history) {
        const productResponse = await axios.get(`http://1.14.126.98:8081/product/selectById?productId=${item.productId}`)
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
      productsArray.sort(([dateStringA], [dateStringB]) => dateStringB.localeCompare(dateStringA));
      // 将排序后的数组转换回对象
      productsGroupedByDate.value = Object.fromEntries(productsArray);
      loading.value = false
    }
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}

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
      const response = await axios.post('http://1.14.126.98:8081/user/addHistory', {}, {
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

const deleteHistory = async (item) => {
  try {
    const response = await axios.delete('http://1.14.126.98:8081/user/deleteHistory', {
      params: {
        userid: userid.value,
        productId: item.data.productId,
        date: item.dateForDeletion
      }
    });

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

// 添加清除全部历史记录的方法
const clearAllHistory = async () => {
  try {
    const response = await axios.delete('http://1.14.126.98:8081/user/deleteAllHistory', {
      params: {
        userid: userid.value,
      }
    });

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
@import '../assets/History.css';
</style>
