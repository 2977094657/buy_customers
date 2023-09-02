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
        <el-card class="card" :shadow="'hover'" v-for="item in itemData.items" :key="item.data.productId" @click="goToProduct(item.data.productId);addHistory(item.data.productId)">
          <el-image class="product-image" :src="item.data.img.slice(1, -1).split(',')[0]" alt="product image"></el-image>
          <div style="padding: 0 5px 0 5px">
            <p class="product-price">￥{{ item.data.price }}</p>
            <p class="product-name">{{ item.data.productName }}</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
  <el-empty v-if="empty" style="margin: 0 0 0 0" :image-size="350"
            description="看来你的浏览历史被外星人劫走了！快去看看我们的新品，让他们知道地球的好货！"
            image="http://1.14.126.98:5000/state/History-empty.png"></el-empty>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import store from "@/store";
import router from "@/router/router";

const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
const empty = ref(false)
let productsGroupedByDate = ref({})
const loading = ref(true)

onMounted(async () => {
  try {
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
        const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        if (!productsGroupedByDate.value[dateString]) {
          productsGroupedByDate.value[dateString] = { items: [], count: 0 }
        }
        productsGroupedByDate.value[dateString].items.push({time: timeString, data: productResponse.data})
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
})

const goToProduct = (productId) => {
  const url = router.resolve({ name: 'Product', params: { productId } }).href;
  window.open(url, '_blank');
}

const formatYear = (date) => {
  const currentYear = new Date().getFullYear();
  const [year, month, day] = date.split(/[年月日]/);
  return currentYear.toString() === year ? `${month}月${day}日` : date;
}

const addHistory = async (productId) => {
  if(land){
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

</script>

<style scoped>
.history-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.history-date {
  color: #333;
  margin-bottom: 30px;
}

.card-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.product-image {
  width: 150px;
  height: 150px;
}

.product-price {
  margin: 0 0 0 0;
  font-weight: 700;
  color: #f10;
}

.product-name{
  margin: 0 0 0 0;
  font-size: 13px;
  height: 22px;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #999;
}

.product-name:hover {
  cursor: pointer;
  color: rgb(253,81,2);
}

.card:hover{
  border: 1px solid rgb(253,81,2);
}

img{
  width: 100%;
  height: 100%;
}

/deep/.el-card__body {
  padding: 0;
}

/deep/.el-card {
  width: 150px;
  height: 200px;
}

.product-count{
  margin: 0 0 0 10px;
  font-size: 10px;
}

/deep/:where(.css-dev-only-do-not-override-hkh161).ant-spin .ant-spin-dot-item {
  background-color: #ff915e;
}

/deep/:where(.css-dev-only-do-not-override-hkh161).ant-spin {
  color: #ff915e;
}
</style>
