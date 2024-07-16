<template>
    <div class="mx-auto max-w-2xl px-2.5">
      <h2 class="text-lg font-medium text-gray-900">我的评价</h2>
      <div class="mt-6 space-y-10 divide-y divide-gray-200 border-b border-t border-gray-200 pb-10">
        <div v-for="comment in data.comments" :key="comment.commentsId"
             class="pt-10">
          <div class="mb-3">
            <div class="items-center col-span-1">
              <h3 class="mr-5 text-sm font-medium text-gray-900 mt-2">{{ formatDate(comment.time) }}</h3>
              <div class="mt-3 text-sm text-gray-500">
                {{comment.comments}}
              </div>
              <div v-if="comment.imgId">
                <el-image v-for="(imgUrl, index) in comment.imgId.slice(1, -1).split(', ')" :key="index" class="comment-image"  alt=""
                          style="width: 70px; height: 70px;border-radius: 10px"
                          :src="imgUrl"
                          :zoom-rate="1.2"
                          :preview-src-list="comment.imgId.slice(1, -1).split(', ')"
                          :initial-index="index"
                          fit="cover"
                />
              </div>
            </div>

            <div @click="goToProduct(comment.product.productId);addHistory(comment.product.productId)" style="cursor: pointer; background-color: rgb(243,244,246);" class="rounded-lg p-2 mb-2 col-span-2">
              <p class="font-medium text-gray-900 mb-2 mr-2">{{ comment.product.productName }}</p>
              <div class="flex justify-between items-center">
                <p class="font-medium mb-2 mr-2 text-sm text-gray-500">{{ comment.product.name }}</p>
                <p class="font-medium text-gray-900 mb-2 mr-2 price"><span class="jge">￥</span>{{ comment.product.price }}</p>
              </div>
              <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                <img :src="comment.product.img.slice(1, -1).split(',')[0]" alt=""
                     class="h-full w-full object-cover object-center"/>
              </div>
            </div>
          </div>

          <div class="mt-6 mb-5 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
            <div class="flex items-center">
              <button @click="schu(comment.commentsId)" type="button" class="mr-20 inline-flex justify-center rounded-md bg-red-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm transition duration-500 ease select-none hover:bg-red-600">
                删除
              </button>
              <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating"
                        :class="[comment.score > rating ? 'text-yellow-400' : 'text-gray-200', 'h-5 w-5 flex-shrink-0']"
                        aria-hidden="true"/>
            </div>
          </div>
        </div>

        <div v-if="loading&&land">
          <a-spin style="display: flex;justify-content: center;align-items: center;height: 50vh;"
                  tip="Loading..." size="large">
            <br>
          </a-spin>
        </div>
        <el-empty v-if="empty" :image-size="300"
                  image="http://124.221.7.201:5000/state/Comment-empty.png"
                  description="暂无评价哦，去买点东西吧！"/>
      </div>
    </div>
</template>

<script setup>
import {StarIcon} from '@heroicons/vue/20/solid'
import {ref, computed, watch, reactive} from 'vue';
import { useStore } from '../../../store/index'
const store = useStore()
import {useRouter} from "vue-router";
import {addHistorys, deleteCommentById, getMyComments, getProductById} from "@/api/api";

const comments = ref([]);
const userid = computed(() => store.userInfo.userId)
const land = computed(() => store.userInfo.land)
const loading = ref(true)
const empty = ref(false)
const router = useRouter()
const data = reactive({
  product: {},
  comments: []
});

const loadComments = async () => {
  try {
    const userId = userid.value;

    const commentsResponse = await getMyComments(userId);

    if (commentsResponse.data.length === 0) {
      empty.value = true
    }

    if (commentsResponse.data) {
      for (const comment of commentsResponse.data) {
        const productId = comment.productId;
        const productResponse = await getProductById(productId);

        if (productResponse.data.data) {
          comment.product = productResponse.data.data;  // 将产品详情添加到评论对象中
        } else {
          console.log('获取商品详情失败');
        }
      }

      data.comments = commentsResponse.data;
      loading.value = false
    } else {
      console.log('获取评论失败');
    }
  } catch (error) {
    console.error('请求失败：', error);
  }
};

// 当 land.value 变为 true 时加载购物车项
watch(land, (newVal) => {
  if (newVal === true) {
    loadComments();
  }
}, {immediate: true});

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

let currentMessageInstance = null

const schu = (id) => {
  ElMessageBox.confirm(
      '确认要删除该评论吗?',
      '删除评论',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  )
      .then(() => {
        removeComments(id);
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

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

const removeComments = async (id) => {
  try {
    const response = await deleteCommentById(id);
    if (response.data.data) {
      showSuccessMessage(response.data.msg);
      // 删除成功后，重新获取一次用户地址列表
      await loadComments();
    } else {
      showMessage(response.data.msg);
    }
  } catch (error) {
    showSuccessMessage('删除失败');
  }
}

const goToProduct = (productId) => {
  // 本页面打开
  router.push({ name: 'Product', params: { productId } });
  // 新页面打开
  // const url = router.resolve({ name: 'Product', params: { productId } }).href;
  // window.open(url, '_blank');
}

const addHistory = async (productId) => {
  if(land.value){
    try {
      const response = await addHistorys(userid.value, productId);

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
@import '../../../assets/Tailwind.css';
@import '../../../assets/Main.css';
.comment-image {
  width: 100px;
  height: 100px;
  margin: 10px 10px 0 0;
}
</style>
