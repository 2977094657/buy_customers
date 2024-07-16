<script setup>
import {useRoute} from 'vue-router';
import {computed, onMounted, ref} from 'vue'
import { useStore } from '../../store/index'
import {addComment, getOrder, updateOrderStatus} from "@/api/api";
import {Plus} from "@element-plus/icons-vue";
import {getProductById} from "@/api/api";
import {ElNotification} from "element-plus";

const route = useRoute();
const data = JSON.parse(sessionStorage.getItem(route.params.id));
const productId = data.productId;
const orderLong = data.orderLong;
const orderId = data.orderId;
const commentContent = ref('');
const show = ref(true)
const store = useStore();
const userid = computed(() => store.userInfo.userId)
const textarea = ref('')
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])
const star = ref(null)
const ip = computed(() => store.userInfo.ip)

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

const comments = ref([])
const total = ref(0)
const currentPage = ref(1)

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
  const response = await getOrder(orderLong);
  if (response.data.data.state!=='待评价'){
    ElNotification({
      title: '评论失败',
      message: '已经评价过了，请不要重新评价',
      type: 'error',
    });
    // 禁用按钮
    document.querySelector('button[type="submit"]').disabled = true;
    return;
  }else if(star.value===0){
    showMessage('评分请至少选择一星')
    return
  }
  if (commentContent.value.trim() === '' || route.params.productId === '') {
    showMessage('所有字段都不能为空');
    return;
  }
  const formData = new FormData()
  formData.append('userId', userid.value)
  formData.append('comments', commentContent.value.trim()) // 去除前后空格
  formData.append('productId', route.params.productId)
  files.value.forEach((file) => {
    formData.append(`imgId`, file, file.name)
  })

  try {
    console.log(ip.value)
    await addComment(userid.value, commentContent.value, productId, star.value, ip.value, files.value);
    await updateOrderStatus(orderId,'已完成');
    ElNotification({
      duration: 0,
      title: '评论成功',
      message: '评论成功，去我的评价里看看吧！',
      type: 'success',
    });
  } catch (error) {
    // 处理错误...
    ElNotification({
      title: '评论失败',
      message: '由于未知原因，评论失败',
      type: 'error',
    });
  }
}


const deleteImage = (index) => {
  previewImages.value.splice(index, 1);
  files.value.splice(index, 1);
  fileNames.value.splice(index, 1);
}

const fileNames = ref([]);
const fileInput = ref(null);

let order = ref({});
let product = ref({});
const empty = ref(true)


const getProductInfo = async () => {
  try {
    const response = await getProductById(productId);
    product.value = response.data.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(getProductInfo);
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-0">
      <h1 class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">评价</h1>

      <div class="mt-12">
        <section class="mb-5" aria-labelledby="cart-heading">
          <ul role="list">
            <li style="background-color: rgb(241,242,243);border-radius: 10px" class="flex p-5">
              <div class="flex-shrink-0">
                <!-- 您可以在这里添加产品图片 -->
                <img v-if="product && product.img" :src="product.img.slice(1, -1).split(',')[0]"
                     alt="your-image-description"
                     class="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"/>
              </div>

              <div class="ml-4 flex flex-1 flex-col sm:ml-6">
                <div>
                  <div>{{ product.productName }}</div>
                  <div class="mt-2 flex justify-between">
                    <h4 class="text-sm">
                      <a href="#" class="font-medium text-gray-700 hover:text-gray-800">{{ product.name }}</a>
                    </h4>
                    <p style="color: #f40;" class="price ml-4 text-sm font-medium text-gray-900">
                      ￥{{product.price }}
                    </p>
                  </div>
                  <!-- 您可以在这里添加其他的订单信息 -->
                </div>
              </div>
            </li>
          </ul>
        </section>
        <hr>
        <!-- Order summary -->
        <section aria-labelledby="summary-heading" class="mt-5">

          <div>
            <dl class="space-y-4">
              <div class="flex items-center justify-between">
                <dt class="text-base font-medium text-gray-900">评分</dt>
                <dd class="ml-4 text-base font-medium text-gray-900">
                  <el-rate v-model="star" :colors="colors"/>
                </dd>
              </div>

              <el-input class="mb-10"
                        v-model="commentContent"
                        :min="10"
                        :rows="10"
                        type="textarea"
                        placeholder="展开说说对商品的想法吧……"
                        :resize="'none'"
              />

              <!-- 图片预览和上传组件 -->
              <div class="image-previews">
                <div class="image-container" v-for="(image, index) in previewImages" :key="index">
                  <img :src="image" alt=""/>
                  <button class="delete-button" @click="deleteImage(index)">×</button>
                </div>

                <!-- 图片上传组件 -->
                <label for="file-upload1" class="custom-file-upload">
                  <el-upload list-type="picture-card" :disabled="true">
                    <el-icon>
                      <Plus/>
                    </el-icon>
                  </el-upload>
                </label>
                <input id="file-upload1" ref="fileInput" style="display:none;" type="file" @change="onFilesChange"
                       multiple/>
              </div>

              <!-- 文件名展示 -->
<!--              <div class="file-names">{{ fileNames.join(', ') }}</div>-->
            </dl>
          </div>

          <div class="mt-5">
            <button @click="submitComment" type="submit"
                    style="background-color: #FF5000"
                    class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
              提交评价
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>


<style scoped>
@import '../../assets/Tailwind.css';
@import '../../assets/ProductComments.css';

</style>
