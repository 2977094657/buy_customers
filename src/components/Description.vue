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
      <div class="small-image-container">
        <img v-for="(img, index) in product.imgs" :key="index" :src="img"
             @mouseover="currentImageIndex = index" class="small-image" :alt="product.productName">
      </div>
    </div>

    <div class="dj" @click="goToVendor(product.name)">
      <svg style="margin: 20px 30px 0 0;" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-shop-window" viewBox="0 0 16 16">
        <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h12V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zm2 .5a.5.5 0 0 1 .5.5V13h8V9.5a.5.5 0 0 1 1 0V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 .5-.5z"/>
      </svg>
      <h2 style="width: 500px">{{product.name}}</h2>
      <el-icon style="font-size: 40px;margin: 15px 0 0 0"><Right /></el-icon>
    </div>

    <div class="product-info">
      <p class="title">{{ product.productName }}</p>
      <div class="productPrice"><h1>￥{{ product.price }}</h1></div>
      <br><br><br>
      <el-rate class="text" v-model="product.score" disabled show-score text-color="#ff9900" score-template="{value}"/>
      <p><br><br>收藏：<span style="color: #ff5000"><b>{{ product.star }}</b></span></p><br>
    </div>
    <div style="position: absolute;top: 515px;right: 390px">
      数量:
    </div>
    <el-input-number class="number" v-model="num" :min="1" :max="50"/>
    <!-- 添加 "加入购物车"和"立即购买"按钮 -->
    <div class="action-buttons">
      <button class="gm" @click="goToProduct(product.productId)">立即购买</button>
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
import {Right} from "@element-plus/icons-vue";

const route = useRoute()
const product = ref()
const httpError = ref(false)
const currentImageIndex = ref(0)
const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
const childRef = ref();

const star = async () => {
  if (!isNaN(route.params.productId)) {
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
  } else {
    httpError.value = true;
    childRef.value.switchShow()
  }
}

onMounted(async () => {
  await star()
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
      star()
    }
  }).catch(error => {
    console.error('添加到收藏夹时出错：', error);
  });
}

const goToProduct = (productId) => {
  if(land.value){
    const url = router.resolve({ name: 'purchase', params: { productId } }).href;
    window.open(url, '_blank');
  }else {
    showMessage("请先登陆")
  }
}

const goToVendor = (name) => {
  const url = router.resolve({ name: 'vendor', params: { name } }).href;
  window.open(url, '_blank');
}
</script>

<style scoped>
@import '../assets/Description.css';
</style>
