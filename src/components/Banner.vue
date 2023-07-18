<script setup>
import { ref, onMounted } from 'vue'
import router from "@/router/router";
import { HeartOutlined } from '@ant-design/icons-vue';
import {Document} from "@element-plus/icons-vue";

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
onMounted(banner)
</script>

<template>
  <div class="banner">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="Banner in Banner" :key="Banner.productId">
        <img :src="Banner.img.slice(1, -1).split(',')[0]" :alt="Banner.productName" @click="goToProduct(Banner.productId)">
      </el-carousel-item>
    </el-carousel>
  </div>

  <div class="head">
    <img class="img" src="http://1.14.126.98:5000/R.jpg" alt="头像">
    <p>Hi!&nbsp;你好</p>
    <button class="bt1">登录</button>
    <button class="bt2">注册</button><br><br>
    <div class="my">

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
    </div>
  </div>
</template>

<style scoped>
.highlight {
  color: #F40;
}

.banner {
  overflow: hidden;
  border-radius: 10px;
  margin: 10px 0 0 23%;
  width: 48%;
}

img {
  border-radius: 10px;
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 0.3s;
}

.head{
  top: 200px;
  right: 11%;
  position: absolute;
  width: 21%;
  text-align: center;
}

.img{
  border: 1px #FF5000 solid;
  border-radius: 100px;
  height: 70px;
  width: 70px;
}

button{
  border-radius: 21px;
  font-size: 16px;
  width: 80px;
  height: 42px;
  border: none;
  color: white;
}

.bt1{
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  font-family: tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53', sans-serif;
  background-image: linear-gradient(to right,#ff5000 0,#ff6000 100%);
}

.bt2{
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  font-family: tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53', sans-serif;
  background-image: linear-gradient(to right,#ff9000 0,#ff7000 100%);
  margin: 0 0 0 10px;
}

.my{
  color: #3c3c3c;
}

.heart-outlined{
  position: absolute;
  width: 65px;
  top: 250px;
  left: 10px;
  font: 12px/1.5 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;
}

.heart1{
  position: absolute;
  top: 220px;
  left: 30px
}

.Document{
  position: absolute;
  left: 30%;
}

.dd{
  position: absolute;
  top: 250px;
  left: 90px;
  width: 65px;
  font: 12px/1.5 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;
}

.clickable {
  cursor: pointer;
}
</style>
