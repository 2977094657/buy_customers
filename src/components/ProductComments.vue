<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {Plus} from "@element-plus/icons-vue";
import { useStore } from 'vuex';
import {addComment} from "@/api/api";


const route = useRoute()
const httpError = ref(false)
const commentContent = ref('');
const show = ref(true)

const store = useStore();
const userId = computed(() => store.state.userInfo.userId)
let currentMessageInstance = null

const switchShow = () => {
  show.value = false
}

defineExpose({
  switchShow
});

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

onMounted(async () => {
  // 在这里调用 fetchComments 函数
  await fetchComments(currentSort.value,currentPage.value)
})

const comments = ref([])
const total = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const currentSort = ref('hottest')  // 默认按最新排序

const fetchComments = async (sortOption,page) => {
  if (!isNaN(route.params.productId)){
    const sortByTime = sortOption === 'newest'
    const response = await fetch(`http://124.221.7.201:8081/product/comments?productId=${route.params.productId}&pageNum=${page}&sortByTime=${sortByTime}&pageSize=20`)
    const data = await response.json()
    comments.value = data[0]  // 第一个元素是评论列表
    if(comments.value.length===0){
      httpError.value=true
    }
    const pageInfo = data[1] // 第二个元素是包含 pageNum，pageSize，sortByTime 参数的对象
    // 更新 currentPage，pageSize 和 currentSort
    currentPage.value = pageInfo.pageNum
    total.value = pageInfo.total
    totalPages.value = pageInfo.pages
    currentSort.value = pageInfo.sortByTime ? 'newest' : 'hottest'
  }
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
  if (sortOption === 'withImage') {
    await filterCommentsWithImage();
  } else {
    // 更新 currentSort 并重新获取评论
    currentSort.value = sortOption
    await fetchComments(sortOption, currentPage.value)
  }
}

const filterCommentsWithImage = async () => {
  // 更新 currentSort 并重新获取评论
  currentSort.value = 'withImage'
  const response = await fetch(`http://124.221.7.201:8081/product/comments?productId=${route.params.productId}&pageNum=${currentPage.value}&pageSize=20`)
  const data = await response.json()

  // 过滤出包含图片的评论
  // 将过滤后的评论列表赋值给 comments
  comments.value = data[0].filter(comment => comment.imgId !== null);
}

const files = ref([])
const previewImages = ref([]);
const onFilesChange = (event) => {
  const newFiles = Array.from(event.target.files);
  let validFiles = [];

  for (let file of newFiles) {
    // 验证文件类型是不是图片
    if (!file.type.startsWith('image/')) {
      showMessage('只能上传图片文件!');
      continue;
    }

    // 验证文件名长度
    if (file.name.length > 20) {
      showMessage('文件名不能超过20个字符');
      continue;
    }

    // 验证单个文件大小
    if (file.size > 1024 * 1024) { // 1MB
      showMessage('单张图片不能超过1MB');
      continue;
    }

    validFiles.push(file);
  }

  // 验证所有文件的总大小
  let totalSize = validFiles.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > 5 * 1024 * 1024) { // 5MB
    showMessage('全部图片的总大小不能超过5MB');
    return;
  }

  // 如果已经有5张图片，就不再添加新的图片
  if (previewImages.value.length + validFiles.length > 5) {
    showMessage('最多只能上传5张图片');
    return;
  }

  files.value = [...files.value, ...validFiles];
  fileNames.value = [...fileNames.value, ...validFiles.map(file => file.name)];

  validFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImages.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
  event.target.value = null;
}


const submitComment = async () => {
  if (userId.value==null) {
    showMessage('请先登录');
    return;
  }
  const formData = new FormData()
  formData.append('userId', userId.value)
  formData.append('comments', commentContent.value.trim()) // 去除前后空格
  formData.append('productId', route.params.productId)
  files.value.forEach((file) => {
    formData.append(`imgId`, file, file.name)
  })

  try {
    await addComment(userId.value, commentContent.value, route.params.productId, files.value);
    // 处理响应...
  } catch (error) {
    // 处理错误...
    showMessage('评论失败')
  }
  showSuccessMessage('评论成功')
  httpError.value=false
  // 提交完成后，清空输入框和图片预览
  commentContent.value = '';
  files.value = [];
  fileNames.value = [];
  previewImages.value = [];
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  // 重新获取评论数据
  currentPage.value = 1
  await fetchComments(currentSort.value, currentPage.value)
}

const deleteImage = (index) => {
  previewImages.value.splice(index, 1);
  files.value.splice(index, 1);
  fileNames.value.splice(index, 1);
}

const fileNames = ref([]);
const fileInput = ref(null);
const isCommentValid = computed(() => {
  return commentContent.value.trim().length > 0
})
</script>

<template>
  <div v-if="show" class="comments-section">
    <h2>
      评论<div style="left: 280px;font-size: 25px;color: rgb(255,80,0);position: absolute">{{ total }}</div>
      <div>
        <span class="sort-option" :class="{ 'highlight': currentSort === 'hottest' }" @click="sortComments('hottest')">最新</span>
        <span class="sort-option" :class="{ 'highlight': currentSort === 'newest' }" @click="sortComments('newest')">最热</span>
        <span class="sort-option" :class="{ 'highlight': currentSort === 'withImage' }" @click="sortComments('withImage')">有图</span>
      </div>
    </h2>

    <!-- 评论输入框开始 -->
    <div class="comment-input-box">
      <textarea v-model="commentContent" class="comment-input" placeholder="添加公开评论..."></textarea>
      <div style="display: inline-block">
        <button class="submit-comment1" @click="submitComment" :disabled="!isCommentValid">发布</button>
      </div>
    </div>
    <!-- 评论输入框结束 -->

    <!-- 图片预览和上传组件 -->
    <div class="image-previews">
      <div class="image-container" v-for="(image, index) in previewImages" :key="index">
        <img :src="image"  alt=""/>
        <button class="delete-button" @click="deleteImage(index)">×</button>
      </div>

      <!-- 图片上传组件 -->
      <label for="file-upload" class="custom-file-upload">
        <el-upload list-type="picture-card" :disabled="true">
          <el-icon><Plus /></el-icon>
        </el-upload>
      </label>
      <input id="file-upload" ref="fileInput" style="display:none;" type="file" @change="onFilesChange" multiple/>
    </div>

    <div class="file-names">{{ fileNames.join(', ') }}</div>

    <div v-for="comment in comments" :key="comment.id" class="comment">
      <img :src="comment.userAvatar" alt="用户头像" class="user-avatar">
      <div class="comment-content">
        <h3>{{ comment.userName }}</h3><br>
        <p>{{ comment.comments }}</p>
        <div v-if="comment.imgId">
          <el-image v-for="(imgUrl, index) in comment.imgId.slice(1, -1).split(', ')" :key="index" class="comment-image"  alt=""
                    style="width: 100px; height: 100px;border-radius: 10px"
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
      <el-empty style="margin: -200px 0 0 0" v-if="httpError" :image-size="300" image="http://124.221.7.201:5000/state/Comment-empty.png" description="这个商品如此神秘，连评论都默默无闻。你可以给它一点关注吗？它会感激不尽的！" />
    <div v-if="!httpError" class="pagination">
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
</style>
