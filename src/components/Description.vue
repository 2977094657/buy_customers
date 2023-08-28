<template>
  <div v-if="product && product.imgs" class="product-detail">
    <div class="image-section">
      <div class="image-gallery">
        <el-image v-for="(img, index) in product.imgs" :key="index"
                  :src="img"
                  :zoom-rate="1.2"
                  :preview-src-list="product.img.slice(1, -1).split(', ')"
                  :initial-index="index"
                  fit="fill"
             v-show="index === currentImageIndex" class="large-image" :alt="product.productName"/>
      </div>
      <div>
        <img v-for="(img, index) in product.imgs" :key="index" :src="img"
             @mouseover="currentImageIndex = index" class="small-image" :alt="product.productName">
      </div>
    </div>

    <div class="product-info">
      <h2>{{ product.productName }}</h2>
      <div class="productPrice"><h1>￥{{ product.price }}</h1></div>
      <br><br><br>
      <span style="color:rgb(96, 98, 102)">商品介绍：</span>
      <h2 class="productDescription">{{ product.description }}</h2><br><br>
      <el-rate class="text" v-model="product.score" disabled show-score text-color="#ff9900" score-template="{value}"/>
      <p><br><br>收藏：<span style="color: #ff5000"><b>{{ product.star }}</b></span></p><br>
    </div>
    <div style="position: absolute;top: 515px;right: 390px">
      数量:
    </div>
    <el-input-number class="number" v-model="num" :min="1" :max="50" @change="handleChange"/>
    <!-- 添加 "加入购物车"和"立即购买"按钮 -->
    <div class="action-buttons">
      <button class="gm">立即购买</button>
      <button class="gwc" @click="addToCart">加入购物车</button>
      <div class="sc" @click="addToFavorites">
        <heart-outlined style="color: #666666;font-size: 25px;"/>
        <b style="color: #666666;margin: 0 0 0 20px;">收藏</b>
      </div>
    </div>
  </div>
  <ProductComments ref="childRef"></ProductComments>

  <div v-if="httpError">
    <el-empty :image-size="300" image="http://1.14.126.98:5000/state/Product-empty.png" description="哎呀，这个商品已经被外星人带走了！">
      <el-button style="background-color: #e15f00;border: none" type="primary" @click="goHome">返回首页</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import router from "@/router/router";
import {HeartOutlined} from '@ant-design/icons-vue';
import axios from 'axios'
import store from "@/store";
import ProductComments from "@/components/ProductComments.vue";

const route = useRoute()
const product = ref()
const httpError = ref(false)
const currentImageIndex = ref(0)
const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
const childRef = ref();

onMounted(async () => {
  if (!isNaN(route.params.productId)){
    try {
      const response = await fetch(`http://1.14.126.98:8081/product/selectById?productId=${route.params.productId}`);
      const data = await response.json();
      data.imgs = data.img.slice(1, -1).split(',');
      product.value = data;
    } catch (error) {
      if (error.message.startsWith('HTTP error 404')) { // 如果是 404 错误，设置 httpError 为 true
        childRef.value.switchShow()
        httpError.value = true;
      }
    }
  }else {
    httpError.value = true;
    childRef.value.switchShow()
  }
})

const goHome = () => {
  // 导航到首页
  router.push({name: 'Home'});
};

const num = ref(1)

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
const addToCart = async () => {
  if (!land.value) {
    console.log(land.value)
    showMessage('请先登陆')
    return
  }
  try {
    const response = await axios.post(`http://1.14.126.98:8081/cart/add?userId=${userid.value}&productId=${route.params.productId}&quantity=${num.value}`);
    if (response.data.message === '您的购物车商品总数已满，请先清理后继续加入购物车') {
      showMessage(response.data.message)
      return
    }
    showSuccessMessage(response.data.message)
  } catch (error) {
    console.error(error);
  }
}

async function addToFavorites() {
  if (userid.value==null){
    showMessage('请先登陆')
  }

  axios.post('http://1.14.126.98:8081/star/staradd', {
    userId: userid.value,
    productId: route.params.productId
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [(data) => {
      let ret = '';
      for (let key in data) {
        ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
      }
      return ret;
    }]
  }).then(response => {
    if (response.data.code===-1){
      showMessage(response.data.msg)
    }else if (response.data.code===0){
      showSuccessMessage(response.data.data);
    }
  }).catch(error => {
    console.error('添加到收藏夹时出错：', error);
  });
}
</script>

<style scoped>
@import '../assets/Description.css';
</style>
