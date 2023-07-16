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
      <div><h1>￥{{ product.price }}</h1></div><br>
      <h2 class="productDescription">{{ product.description }}</h2><br><br>
      <el-rate v-model="product.score" disabled show-score text-color="#ff9900" score-template="{value}"/>
      <p><br><br>收藏：{{ product.star }}</p><br>
    </div>
  </div>

  <div v-if="httpError">
    <el-empty description="哎呀，这个商品已经被外星人带走了！">
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </el-empty>
  </div>

  <div v-if="!httpError" class="comments-section">
    <h2>
      评论
      <div>
        <span class="sort-option"
              :class="{ 'highlight': currentSort === 'hottest' }"
              @click="sortComments('hottest')">最新</span>
        <span class="sort-option"
              :class="{ 'highlight': currentSort === 'newest' }"
              @click="sortComments('newest')">最热</span>
      </div>
    </h2>
    <div v-for="comment in comments" :key="comment.id" class="comment">
      <img :src="comment.userAvatar" alt="用户头像" class="user-avatar">
      <div class="comment-content">
        <h3>{{ comment.userName }}</h3>
        <p>{{ comment.comments }}</p>
        <div v-if="comment.imgId">
          <img v-for="(imgUrl, index) in comment.imgId.slice(1, -1).split(', ')" :key="index" :src="imgUrl" class="comment-image"  alt=""/>
        </div>
        <span>{{ comment.time }}</span>
      </div>
    </div>
    <button @click="previousPage" :disabled="currentPage === 1">上一页</button>
    <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import router from "@/router/router";

const route = useRoute()
const product = ref()
const loading = ref(true)
const httpError = ref(false)
const currentImageIndex = ref(0)

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
  // 在这里调用 fetchComments 函数
  await fetchComments(currentSort.value)
})

const goHome = () => {
  // 导航到首页
  router.push({ name: 'Home' });
};

const comments = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const currentSort = ref('hottest')  // 默认按最新排序

const fetchComments = async (sortOption) => {
  const sortByTime = sortOption === 'newest'
  const response = await fetch(`http://1.14.126.98:8081/product/comments?productId=${route.params.productId}&pageNum=${currentPage.value}&pageSize=${pageSize.value}&sortByTime=${sortByTime}`)
  const data = await response.json()
  comments.value = data
  totalPages.value = Math.ceil(data.length / pageSize.value)
  console.log(data)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchComments(currentSort.value)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchComments(currentSort.value)
  }
}

const sortComments = (sortOption) => {
  // 更新 currentSort 并重新获取评论
  currentSort.value = sortOption
  fetchComments(sortOption)
}
</script>

<style scoped>
@import '../assets/Description.css';
</style>
