<template>
  <div v-if="product && product.imgs" class="product-detail">
    <div class="image-section">
      <div class="image-gallery">
        <div v-for="(img, index) in product.imgs" :key="index" :style="{backgroundImage: `url(${img})`}" v-show="index === currentImageIndex" class="large-image"></div>
      </div>
      <div class="small-images">
        <div v-for="(img, index) in product.imgs" :key="index" :style="{backgroundImage: `url(${img})`}" @mouseover="currentImageIndex = index" class="small-image"></div>
      </div>
    </div>

    <div class="product-info">
      <h1>{{ product.productName }}</h1>
      <div class="productPrice"><h1>￥{{ product.price }}</h1></div><br>
      <h2 class="productDescription">{{ product.description }}</h2><br><br>
      <el-rate class="text" v-model="product.score" disabled show-score text-color="#ff9900" score-template="{value}"/>
      <p><br><br>收藏：<span style="color: #ff5000">{{ product.star }}</span></p><br>
    </div>
    <div style="position: absolute;top: 485px;right: 390px">
      数量:
    </div>
    <el-input-number class="number" v-model="num" :min="1" :max="10" @change="handleChange" />
    <!-- 添加 "加入购物车"和"立即购买"按钮 -->
    <div class="action-buttons">
      <button class="gm">立即购买</button>
      <button class="gwc">加入购物车</button>
      <div class="sc">
          <heart-outlined  style="color: #666666;font-size: 25px;" />
        <b style="color: #666666;margin: 0 0 0 20px;">收藏</b>
      </div>
    </div>
  </div>

  <div v-if="httpError">
    <el-empty description="哎呀，这个商品已经被外星人带走了！">
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import router from "@/router/router";
import { defineProps } from 'vue'
import { HeartOutlined } from '@ant-design/icons-vue';

const route = useRoute()
const product = ref()
const loading = ref(true)
const httpError = ref(false)
const currentImageIndex = ref(0)
// 定义 props
const props = defineProps({
  productId: String,
})

onMounted(async () => {
  loading.value = true
  try {
    const response = await fetch(`http://1.14.126.98:8081/product/selectById?productId=${route.params.productId}`);
    if (!response.ok) { // 检查 HTTP 状态码
      throw new Error('HTTP error ' + response.status);
    }
    const data = await response.json();
    data.imgs = data.img.slice(1, -1).split(',');
    product.value = data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation: ', error);
    if (error.message.startsWith('HTTP error 404')) { // 如果是 404 错误，设置 httpError 为 true
      httpError.value = true;
    }
  } finally {
    loading.value = false
  }
})

const goHome = () => {
  // 导航到首页
  router.push({ name: 'Home' });
};

const comments = ref([])
const currentPage = ref(1)

const num = ref(1)
const handleChange = value => {
  console.log(value)
}
</script>

<style scoped>
@import '../assets/Description.css';
.action-buttons {
  position: absolute;
  width: 288px;
  height: 48px;
  right: 450px;
  top: 630px;
}

.gm{
  border-top-left-radius: 34px;
  border-bottom-left-radius: 34px;
  background: linear-gradient(90deg, rgb(255, 119, 0), rgb(255, 73, 0));
  box-shadow: rgba(255, 119, 0, 0.2) 0 9px 13px 0;
  vertical-align: top;
  display: inline;
  font-size: 16px;
  font-weight: bold;
  color: rgb(255, 255, 255);
  height: 48px;
  width: 136px;
  outline: 0;
  border: 0;
  cursor: pointer;
  line-height: 22px;
  text-align: center;
}

.gwc{
  background: linear-gradient(90deg, rgb(255, 203, 0), rgb(255, 148, 2));
  box-shadow: rgba(255, 203, 0, 0.2) 0 9px 13px 0;
  vertical-align: top;
  border-top-right-radius: 34px;
  border-bottom-right-radius: 34px;
  outline: 0;
  border: 0;
  cursor: pointer;
  height: 48px;
  line-height: 22px;
  text-align: center;
  display: inline;
  font-size: 16px;
  font-weight: bold;
  color: rgb(255, 255, 255);
  width: 152px;
}
.number{
  --el-color-primary: #ff915e;
  position: absolute;
  top: 480px;
  right: 210px;
}

.text {
  --el-rate-text-color:rgb(247,186,42);
  font-weight: bold;
}

.sc{
  width: 77px;
  height: 40px;
  padding: 10px 20px 0 20px;
  border-radius: 10px;
  position: absolute;
  top: 0;
  right: -200px;
}

.sc:hover{
  cursor: pointer;
  transition: background-color .2s;
  background: rgba(0,0,0,.06);
}
</style>
