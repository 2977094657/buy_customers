<script setup>
import { ref, onMounted } from 'vue'
import router from "@/router/router";
import { HeartOutlined } from '@ant-design/icons-vue';
import {ChatDotSquare, Document, ShoppingCart} from "@element-plus/icons-vue";
import Login from "@/components/Login.vue";

let isCartHovered = ref(false);

const handleCartMouseOver = () => {
  isCartHovered.value = true;
};

const handleCartMouseOut = () => {
  isCartHovered.value = false;
};

let isReviewHovered = ref(false);

const handleReviewMouseOver = () => {
  isReviewHovered.value = true;
};

const handleReviewMouseOut = () => {
  isReviewHovered.value = false;
};

let isOrderHovered = ref(false);

const handleOrderMouseOver = () => {
  isOrderHovered.value = true;
};

const handleOrderMouseOut = () => {
  isOrderHovered.value = false;
};

let isHovered = ref(false);

const handleMouseOver = () => {
  isHovered.value = true;
};

const handleMouseOut = () => {
  isHovered.value = false;
};

const currentPage = ref(1)
const Banner = ref([])

const banner = async () => {
  const response = await fetch(`http://1.14.126.98:8081/product/all?current=${currentPage.value}&size=5&sortField=score&isAsc=false`)
  const data = await response.json()
  Banner.value = data.records
  currentPage.value = data.current
}

const goToProduct = (productId) => {
  const url = router.resolve({ name: 'Product', params: { productId } }).href;
  window.open(url, '_blank');
}

let open = ref(false)

const showModal = () => {
  open.value = true
}

const handleOk = () => {
  open.value = false
}

onMounted(banner)
</script>

<template>
    <a-modal width="820px" :footer="null" :maskClosable="false" v-model:visible="open" @ok="handleOk">
      <Login></Login>
    </a-modal>

  <div class="banner">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="Banner in Banner" :key="Banner.productId">
        <img :src="Banner.img.slice(1, -1).split(',')[0]" :alt="Banner.productName" @click="goToProduct(Banner.productId)">
      </el-carousel-item>
    </el-carousel>
  </div>

  <div class="head">
    <img class="img" src="http://1.14.126.98:5000/R.jpg" alt="头像" @click="showModal">
    <p>Hi!&nbsp;你好</p>
    <button class="bt1">登录</button>
    <button class="bt2">注册</button><br><br>
      <div @mouseover="handleMouseOver" @mouseout="handleMouseOut" class="clickable">
        <div class="heart1">
          <HeartOutlined :style="{ fontSize: '20px' }" :class="{ 'highlight': isHovered }"/>
        </div>
        <div class="heart-outlined" :class="{ 'highlight': isHovered }">
          宝贝收藏
        </div>
      </div>

      <br>
      <div class="clickable" @mouseover="handleOrderMouseOver" @mouseout="handleOrderMouseOut">
        <div class="Document">
          <el-icon :style="{ fontSize: '20px', left: '75%', top: '8px'}" :class="{ 'highlight': isOrderHovered }"><Document /></el-icon>
        </div>
        <div class="dd" :class="{ 'highlight': isOrderHovered }">
          我的订单
        </div>
      </div>

      <div class="clickable" @mouseover="handleReviewMouseOver" @mouseout="handleReviewMouseOut">
        <div class="ChatDotSquare">
          <el-icon style="font-size: 20px;" :class="{ 'highlight': isReviewHovered }"><ChatDotSquare /></el-icon>
        </div>
        <div class="pj" :class="{ 'highlight': isReviewHovered }">
          我的评价
        </div>
      </div>

      <div class="clickable" @mouseover="handleCartMouseOver" @mouseout="handleCartMouseOut">
        <div class="ShoppingCart">
          <el-icon style="font-size: 20px;" :class="{ 'highlight': isCartHovered }"><ShoppingCart /></el-icon>
        </div>
        <div class="Shopping" :class="{ 'highlight': isCartHovered }">
          购物车
        </div>
      </div>
  </div>
</template>

<style scoped>
@import '../assets/Banner.css';
</style>
