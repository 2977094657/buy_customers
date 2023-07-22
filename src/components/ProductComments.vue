<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import { defineProps } from 'vue'
import { PictureOutlined } from '@ant-design/icons-vue';

const route = useRoute()
const product = ref()
const loading = ref(true)
const httpError = ref(false)
// 定义 props
const props = defineProps({
  productId: String,
})

onMounted(async () => {
  // 在这里调用 fetchComments 函数
  await fetchComments(currentSort.value,currentPage.value)
})

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

const commentInput = ref('');
const showFixedInput = ref(false);
// 创建一个新地响应式引用，用于控制 fade-out 动画
const startFadeOut = ref(false);

onMounted(() => {
  // 滚动事件监听器
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 1000 && !showFixedInput.value) {
      showFixedInput.value = true;
    } else if (scrollY <= 1000 && showFixedInput.value) {
      showFixedInput.value = false;
      startFadeOut.value = true;
      setTimeout(() => startFadeOut.value = false, 500);
    }
  });
});
</script>

<template>
  <div v-if="!httpError" class="comments-section">
    <h2>
      评论<div style="left: 280px;font-size: 25px;color: rgb(255,80,0);position: absolute">{{ comments.length }}</div>
      <div>
        <span class="sort-option" :class="{ 'highlight': currentSort === 'hottest' }" @click="sortComments('hottest')">最新</span>
        <span class="sort-option" :class="{ 'highlight': currentSort === 'newest' }" @click="sortComments('newest')">最热</span>
      </div>
    </h2>

    <!-- 评论输入框开始 -->
    <div class="comment-input-box">
      <textarea ref="commentInput" class="comment-input" placeholder="添加公开评论..."></textarea>
      <input type="file" id="imageFile" name="imageFile" accept="image/*" class="image-input"><picture-outlined />
      <button class="submit-comment" @click="submitComment">发布</button>
    </div>
    <!-- 评论输入框结束 -->

    <!-- 固定的评论输入框 -->
    <div v-show="showFixedInput || startFadeOut" class="fixed-comment-input-box" :class="{ 'fade-out': !showFixedInput && startFadeOut }">
      <textarea ref="commentInput" class="fixed-comment-input" placeholder="添加公开评论..."></textarea>
      <button class="submit-comment" @click="submitComment">发布</button>
    </div>

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
      <button @click="goToPage(1)" class="button">首页</button>
      <button @click="previousPage" :disabled="currentPage === 1" class="button">上一页</button>
      <template v-for="page in pageNumbers">
        <button class="button" v-if="page === currentPage" :class="{ 'current-page': true }" @click="goToPage(page)">{{ page }}</button>
        <button class="button" v-else @click="goToPage(page)">{{ page }}</button>
      </template>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="button">下一页</button>
      <button @click="goToPage(totalPages)" class="button">尾页</button>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/ProductComments.css';
/* 评论输入框和发布按钮的样式 */
.comment-input-box {
  display: flex;
  margin-bottom: 20px;
}

.comment-input {
  flex-grow: 1;
  margin-right: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #F1F2F3;
  border-radius: 5px;
  outline: none;
  resize: none;
}

.comment-input:hover,
.comment-input:focus {
  background-color: white; /* 鼠标悬停或输入框获得焦点时的背景颜色 */
}

.image-input {
}

.submit-comment {
  padding: 10px 40px;
  margin: 0 10px 0 0 ;
  background-color: #ff9c76;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-comment:hover {
  background-color: rgb(255,80,0);
}

.fixed-comment-input-box {
  z-index: 10;
  position: fixed;
  bottom: 0;
  width: 1183px;
  left: 158px;
  background-color: white;
  display: flex;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 -10px 10px -10px rgba(0, 0, 0, 0.1);
  animation: fade-in 0.5s ease-out forwards;
}

.fixed-comment-input {
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-out {
  animation: fade-out 0.5s ease-out forwards;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

</style>
