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
      评论<div style="left: 280px;font-size: 25px;color: rgb(255,80,0);position: absolute">{{ comments.length }}</div>
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
        <h3>{{ comment.userName }}</h3><br>
        <p>{{ comment.comments }}</p>
        <div v-if="comment.imgId">
          <el-image v-for="(imgUrl, index) in comment.imgId.slice(1, -1).split(', ')" :key="index" class="comment-image"  alt=""
                    style="width: 100px; height: 100px"
                    :src="imgUrl"
                    :zoom-rate="1.2"
                    :preview-src-list="comment.imgId.slice(1, -1).split(', ')"
                    :initial-index="index"
                    fit="cover"
          />
          <div class="demo-image__preview">
          </div>
        </div><br>
        <span>{{ comment.time }}</span>
      </div>
    </div>
    <div class="pagination">
      <button @click="goToPage(1)">首页</button>
      <button @click="previousPage" :disabled="currentPage === 1">上一页</button>
      <template v-for="page in pageNumbers">
        <button v-if="page === currentPage" :class="{ 'current-page': true }" @click="goToPage(page)">{{ page }}</button>
        <button v-else @click="goToPage(page)">{{ page }}</button>
      </template>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      <button @click="goToPage(totalPages)">尾页</button>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import router from "@/router/router";
import { defineProps } from 'vue'

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
  // 在这里调用 fetchComments 函数
  await fetchComments(currentSort.value,currentPage.value)
})

const goHome = () => {
  // 导航到首页
  router.push({ name: 'Home' });
};

const comments = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const currentSort = ref('hottest')  // 默认按最新排序

const fetchComments = async (sortOption,page) => {
  const sortByTime = sortOption === 'newest'
  const response = await fetch(`http://1.14.126.98:8081/product/comments?productId=${route.params.productId}&pageNum=${page}&sortByTime=${sortByTime}&pageSize=20`)
  const data = await response.json()
  comments.value = data[0]  // 第一个元素是评论列表
  const pageInfo = data[1] // 第二个元素是包含 pageNum，pageSize，sortByTime 参数的对象
  // 更新 currentPage，pageSize 和 currentSort
  currentPage.value = pageInfo.pageNum
  totalPages.value = pageInfo.pages
  currentSort.value = pageInfo.sortByTime ? 'newest' : 'hottest'
}

const previousPage = () => {
  if (currentPage.value > 1) {
    fetchComments(currentSort.value, currentPage.value - 1)
    window.scrollTo(0, 0)
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    await fetchComments(currentSort.value, currentPage.value + 1)
    console.log(currentPage.value)
    window.scrollTo(0, 0)
  }
}

const goToPage = (page) => {
  fetchComments(currentSort.value, page)
  window.scrollTo(0, 0)
}

const pageNumbers = computed(() => {
  let numbers = []
  for(let i = 1; i <= Math.min(7, totalPages.value); i++) {
    numbers.push(i)
  }
  return numbers
})

const sortComments = async (sortOption) => {
  // 更新 currentSort 并重新获取评论
  currentSort.value = sortOption
  await fetchComments(sortOption, currentPage.value)
}

</script>

<style scoped>
@import '../assets/Description.css';
</style>
