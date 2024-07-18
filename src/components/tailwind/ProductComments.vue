<template>
  <div class="bg-white lm:mx-5">
    <TabGroup as="div">
      <div class="border-b border-gray-200">
        <TabList class="-mb-px flex space-x-8">
          <Tab as="template" v-slot="{ selected }">
            <button
                :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              宝贝评价
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button
                :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              优质服务
            </button>
          </Tab>
        </TabList>
      </div>
      <TabPanels as="template">
        <!--评论选项卡-->
        <TabPanel>
          <!-- 评价列表-->
          <div v-if="pageInfo.total!==0">
            <div v-if="reviews" class="mx-auto py-10 sm:px-6 lg:max-w-7xl lg:gap-x-8 lg:px-8">
              <!-- 总评分-->
              <div v-if="pageInfo" class="lg:col-span-3 mr-5">
                <div class="mt-3 flex items-center">
                  <div>
                    <div v-if="product" class="flex items-center">
                      <el-rate v-model="product.score" disabled/>
                    </div>
                  </div>
                  <div style="margin-top: -20px" class="ml-5">
                    <span v-if="product" style="margin-right: 20px; color: rgb(254,153,0);font-weight: 500"
                          class="text-4xl tracking-tight text-gray-900">{{ product.score }}</span>
                    总计 {{ pageInfo.total }} 人评分
                  </div>
                </div>

                <div class="mt-6">
                  <dl class="space-y-3">
                    <div v-for="(count, index) in reviews.counts" :key="count.rating" class="flex items-center text-sm">
                      <dt class="flex flex-1 items-center">
                        <div aria-hidden="true" class="ml-1 flex flex-1 items-center">
                          <span class="mr-2">{{ 5 - index }}</span>
                          <StarIcon
                              :class="[count.count > 0 ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']"
                              aria-hidden="true"/>
                          <div class="relative ml-3 flex-1">
                            <div class="h-3 rounded-full border border-gray-200 bg-gray-100"/>
                            <div v-if="count.count > 0"
                                 class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                                 :style="{ width: `calc(${count.count} / ${pageInfo.total} * 100%)` }"/>
                          </div>
                        </div>
                      </dt>
                      <dd class="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                        {{ Math.round((count.count / pageInfo.total) * 100) }}%
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <el-empty class="mb-10" v-else :image-size="300"
                    image="http://124.221.7.201:5000/state/Comment-empty.png"
                    description="这个商品如此神秘，连评论都默默无闻。你可以给它一点关注吗？它会感激不尽的！"/>

          <div>
            <div v-if="pageInfo.total!==0" class="flex justify-end mr-1 mb-5">
              <el-radio-group text-color="#FE9900" fill="white" v-model="radio1" size="default">
                <el-radio-button @click="sortComments('hottest')" label="最热" />
                <el-radio-button @click="sortComments('newest')" label="最新" />
                <el-radio-button @click="sortComments('withImage')" label="有图" />
              </el-radio-group>
            </div>
            <div v-for="(comment) in comments" :key="comment.id" class="text-sm text-gray-500">
              <div class="space-x-11 mr-5 -mt-1">
                <!-- 添加了justify-between -->
                <div class="flex items-center">
                  <img :src="comment.userAvatar" alt="用户头像" class="h-8 w-8 rounded-full bg-gray-100"/>
                  <h3 style="margin-bottom: 20px; margin-left: 10px;color: #61666d" class="font-medium text-gray-900 flex-grow">
                    {{ comment.userName }}</h3>
                  <el-rate
                      style="margin-right: -10px"
                      v-model="comment.score"
                      size="default"
                      disabled
                      :colors="colors"
                  />
                </div>

                <div class="flex space-x-3" style="margin-top: -20px;margin-left: 42px;color: #9499A0;font-size: 13px;">
                  <div>{{ displayTime(comment) }}</div>
                  <p>{{comment.ip.slice(0, -1)}}</p>
                </div>

                <!--  评论内容-->
                <div class="prose prose-sm max-w-none text-gray-500 mt-3 mb-1" style="color: #18191C;margin-left: 42px; white-space: pre-wrap;">{{comment.comments}}</div>
                <div v-if="comment.imgId">
                  <el-image v-for="(imgUrl, index) in comment.imgId.slice(1, -1).split(', ')" :key="index" class="comment-image"  alt=""
                            style="width: 90px; height: 90px;border-radius: 5px"
                            :src="imgUrl"
                            :zoom-rate="1.2"
                            :preview-src-list="comment.imgId.slice(1, -1).split(', ')"
                            :initial-index="index"
                            fit="cover"
                  />
                </div>
                <div style="font-size: 13px;color: #9499a0" class="flex space-x-4">
<!--                  点亮的正赞-->
                  <div style="font-size: 13px;margin-top: 2px" v-if="isLiked(comment.id, 'positiveLikes')" @click="handleLike('positiveLikes',comment.id)" class="hover:cursor-pointer">
                    <svg width="17" height="17" x="1636093991833" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4447"><path d="M860.032 341.12h-182.08c7.488-17.408 14.72-38.528 18.048-60.544 5.952-39.872 4.992-87.36-18.368-129.088-21.76-38.848-50.304-60.928-83.52-61.376-30.72-0.384-53.888 18.176-65.728 33.408a199.296 199.296 0 0 0-32.064 59.264l-1.92 5.184c-5.44 14.976-10.88 29.952-23.04 51.456-19.712 34.816-48.832 56.128-77.696 74.368a391.936 391.936 0 0 1-30.976 17.92v552.448a4621.952 4621.952 0 0 0 351.872-5.312c51.264-2.752 100.672-28.544 127.488-76.032 24.32-43.136 55.168-108.16 74.368-187.264 20.416-84.16 24.64-152.704 24.576-195.968-0.128-46.336-38.72-78.4-80.96-78.4z m-561.344 541.312V341.12H215.808c-59.712 0-113.408 42.048-120.896 104.32a1376 1376 0 0 0 0.64 330.368c7.36 58.688 56.128 100.032 113.024 102.848 25.024 1.28 55.552 2.56 90.112 3.712z" p-id="4448" fill="#fe9900"></path></svg>
                  </div>

<!--                  正赞-->
                  <div style="font-size: 13px;margin-top: 2px" v-if="!isLiked(comment.id, 'positiveLikes')" class="hover:cursor-pointer like" @click="handleLike('positiveLikes',comment.id)">
                    <svg width="17" height="17" x="1636093575017" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3323"><path d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z"></path></svg>
                  </div>

                  <div v-if="comment.positiveLikes > 0" :style="{ color: isLiked(comment.id, 'positiveLikes') ? '#fe9900' : '#9499a0' }" style="margin-left: 5px;font-size: 13px;" class="text-sm">{{comment.positiveLikes}}</div>

<!--                  点亮的倒赞-->
                  <div style="font-size: 13px;margin-top: 2px" class="hover:cursor-pointer" v-if="isLiked(comment.id, 'disLikes')" @click="handleLike('disLikes',comment.id)">
                    <svg width="17" height="17" x="1636094030855" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5103"><path d="M860.032 693.632h-182.08c7.488 17.408 14.72 38.592 18.048 60.608 5.952 39.872 4.992 87.296-18.368 129.088-21.76 38.848-50.304 60.928-83.52 61.312-30.72 0.384-53.888-18.176-65.728-33.408a199.296 199.296 0 0 1-32.064-59.2l-1.92-5.248c-5.44-14.912-10.88-29.888-23.04-51.456-19.712-34.816-48.832-56.128-77.696-74.304a391.68 391.68 0 0 0-30.976-17.984V150.592a4617.408 4617.408 0 0 1 351.872 5.312c51.264 2.752 100.672 28.608 127.488 76.096 24.32 43.136 55.168 108.16 74.368 187.264 20.416 84.096 24.64 152.64 24.576 195.904-0.128 46.336-38.72 78.464-80.96 78.464zM298.624 152.32v541.248H215.808c-59.712 0-113.408-42.048-120.896-104.32a1376 1376 0 0 1 0.64-330.432c7.36-58.624 56.128-100.032 113.024-102.848 25.024-1.216 55.552-2.56 90.112-3.648z" p-id="5104" fill="#fe9900"></path></svg>
                  </div>

<!--                  倒赞-->
                  <div style="font-size: 13px;margin-top: 2px" v-if="!isLiked(comment.id, 'disLikes')" @click="handleLike('disLikes',comment.id)" class="hover:cursor-pointer like">
                    <svg width="17" height="17" x="1636093677814" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3933"><path d="M594.112 872.768a34.048 34.048 0 0 1-29.12-10.816c-11.264-13.248-15.872-24.064-21.504-40.064l-1.92-5.632c-5.632-16.128-12.8-36.864-27.712-63.232-25.344-44.928-50.24-74.432-86.144-97.024-23.104-14.528-43.648-26.432-65.024-32.64V203.84a4570.24 4570.24 0 0 1 339.072 4.672c38.656 2.048 72 21.12 88.896 52.032 21.504 39.36 47.232 95.744 63.552 163.008 16.448 67.52 21.568 123.776 22.592 163.008 0.448 16.832-13.44 32.256-35.392 32.256h-197.248a32 32 0 0 0-28.608 46.336l0.128 0.32 0.64 1.28 2.56 5.568c2.176 4.8 5.12 11.776 8.384 20.16 6.528 17.088 13.568 39.04 16.768 60.416 4.928 33.344 3.712 60.16-9.344 84.992-14.08 26.688-30.016 33.728-40.576 34.944z m97.728-190.016h149.568c52.8 0 100.864-40.128 99.392-97.92a846.336 846.336 0 0 0-24.32-176.448 742.016 742.016 0 0 0-69.632-178.56c-29.248-53.44-84.48-82.304-141.824-85.248-55.68-2.88-138.24-5.952-235.712-5.952-96 0-183.488 3.008-244.672 5.76-66.368 3.136-123.328 51.392-130.944 119.872a1380.608 1380.608 0 0 0-0.768 296.704c7.68 72.768 70.4 121.792 140.032 121.792h97.728c13.76 0 28.16 5.504 62.976 27.392 24.064 15.168 42.432 35.264 64.448 74.368 11.968 21.12 17.472 36.864 22.976 52.736l2.048 5.888c6.656 18.88 14.336 38.4 33.216 60.416 19.456 22.72 51.456 36.736 85.184 32.768 35.2-4.096 67.776-26.88 89.792-68.672 22.208-42.112 21.888-84.8 16-124.288a343.04 343.04 0 0 0-15.488-60.608zM298.688 205.568v413.184H232.96c-40.512 0-72.448-27.712-76.352-64.512a1318.912 1318.912 0 0 1 0.64-282.88c3.904-34.816 32.896-61.248 70.4-62.976 20.8-0.96 44.736-1.92 71.04-2.816z"></path></svg>
                  </div>

                </div>
              </div>

              <hr style="color: rgb(241,242,244)" class="mt-2 mb-4">
            </div>

            <div v-if="pageInfo.total!==0" class="relative flex justify-center mb-5">
              <span style="background-color: white" class="z-0 px-2 text-sm text-gray-500">没有更多评论了</span>
            </div>

            <div class="lm:mb-14" v-if="pageInfo.total!==0" style="display: flex; justify-content: center;">
              <el-config-provider :locale="locale">
                <el-pagination
                    @next-click="nextPage"
                    @prev-click="previousPage"
                    :default-page-size="50"
                    :page-sizes="[10, 20, 50, 1000]"
                    layout="prev, pager, next"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="goToPage"
                />
              </el-config-provider>
            </div>

          </div>
        </TabPanel>


        <!--选项栏二的内容-->
        <TabPanel class="text-sm text-gray-500">
          <dl>
            <Incentive></Incentive>
          </dl>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup>
import {StarIcon} from '@heroicons/vue/20/solid'
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/vue'
import Incentive from "@/components/tailwind/Incentive.vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'


import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import { useStore } from '../../store/index'
import {getProductById, getProductComments, getProductCommentsByTime, getUserLikes, likes} from "@/api/api";


const route = useRoute()
const httpError = ref(false)
const show = ref(true)
const radio1 = ref('最热')
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])
const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

const store = useStore();
const userId = computed(() => store.userInfo.userId)
const land = computed(() => store.userInfo.land)
let currentMessageInstance = null

const handleSizeChange = async (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;  // 将当前页码重置为1
  await fetchComments(currentSort.value, currentPage.value, newSize)
}


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
  await fetchComments(currentSort.value, currentPage.value, pageSize.value)
})

const comments = ref([])
const pageInfo = ref([])
const total = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const currentSort = ref('hottest')  // 默认按最新排序
const pageSize = ref(10)

const fetchComments = async (sortOption, page, pageSize, sortByLikes = true) => {
  if (!isNaN(route.params.productId)) {
    const sortByTime = sortOption === 'newest'
    const response = await getProductCommentsByTime(route.params.productId, page, sortByTime, pageSize, sortByLikes);
    const data = response.data
    comments.value = data[0]  // 第一个元素是评论列表
    if (comments.value.length === 0) {
      httpError.value = true
    }
    pageInfo.value = data[1] // 第二个元素是包含 pageNum，pageSize，sortByTime 参数的对象
    // 更新 currentPage，pageSize 和 currentSort
    currentPage.value = pageInfo.value.pageNum
    total.value = pageInfo.value.total
    totalPages.value = pageInfo.value.pages
    currentSort.value = pageInfo.value.sortByTime ? 'newest' : 'hottest'
  }
  await star()
}

const sortComments = async (sortOption) => {
  if (sortOption === 'withImage') {
    await filterCommentsWithImage();
  } else if (sortOption === 'hottest') {
    // 更新 currentSort 并重新获取评论
    currentSort.value = sortOption
    await fetchComments(sortOption, currentPage.value, pageSize.value, true)
  } else {
    // 更新 currentSort 并重新获取评论
    currentSort.value = sortOption
    await fetchComments(sortOption, currentPage.value, pageSize.value)
  }
}

const displayTime = computed(() => {
  const now = new Date();
  return comment => {
    const commentDate = new Date(comment.time);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    if (diffInSeconds < 60) {
      return `${diffInSeconds}秒前`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}分钟前`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}小时前`;
    } else if (diffInSeconds < 259200) { // 3天内
      return `${Math.floor(diffInSeconds / 86400)}天前`;
    } else {
      const month = (commentDate.getMonth() + 1).toString().padStart(2, '0');
      const date = commentDate.getDate().toString().padStart(2, '0');
      const hours = commentDate.getHours().toString().padStart(2, '0');
      const minutes = commentDate.getMinutes().toString().padStart(2, '0');
      return commentDate.getFullYear() === now.getFullYear() ?
          `${month}-${date} ${hours}:${minutes}` :
          `${commentDate.getFullYear()}-${month}-${date} ${hours}:${minutes}`;
    }
  };
});

const product = ref()
const reviews = ref({
  average: 4,
  counts: [
    {rating: 5, count: 0},
    {rating: 4, count: 0},
    {rating: 3, count: 0},
    {rating: 2, count: 0},
    {rating: 1, count: 0},
  ],
})
const star = async () => {
  if (!isNaN(route.params.productId)) {
    try {
      const response = await getProductById(route.params.productId);
      const data = response.data.data;
      data.imgs = data.img.slice(1, -1).split(',');
      product.value = data;
      reviews.value.counts[0].count = data.five;
      reviews.value.counts[1].count = data.four;
      reviews.value.counts[2].count = data.three;
      reviews.value.counts[3].count = data.two;
      reviews.value.counts[4].count = data.one;
    } catch (error) {
    }
  } else {
    httpError.value = true;
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    fetchComments(currentSort.value, currentPage.value - 1,pageSize.value)
    window.scrollTo(0, 0)
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    await fetchComments(currentSort.value, currentPage.value + 1,pageSize.value)
    window.scrollTo(0, 0)
  }
}

const goToPage = (page) => {
  fetchComments(currentSort.value, page,pageSize.value)
  window.scrollTo(0, 0)
}
computed(() => {
  let numbers = []
  for (let i = 1; i <= Math.min(7, totalPages.value); i++) {
    numbers.push(i)
  }
  return numbers
});

const filterCommentsWithImage = async () => {
  // 更新 currentSort 并重新获取评论
  currentSort.value = 'withImage'
  const response = await getProductComments(route.params.productId, currentPage.value, 10000);
  const data = response.data

  // 过滤出 imgId 不为 null 的评论
  comments.value = data[0].filter(comment => comment.imgId !== null && comment.imgId !== '');

}

let userLikes = ref([]);

onMounted(async () => {
  const response = await getUserLikes(userId.value);
  // 处理响应
  userLikes.value = response.data;
});

const handleLike = async (likeType,commentsId) => {
  if (land.value){
    let newLikes = {
      userId: userId.value,
      commentsId: commentsId,
    };
    newLikes[likeType] = userLikes.value.data.some(like => like.commentsId === commentsId && like.likeType === likeType) ? 0 : 1;
    console.log(newLikes)
    await likes(newLikes);
    // 处理响应
    getUserLikes(userId.value).then(response => userLikes.value = response.data);
  }else {
    showMessage('请先登陆')
  }
  await fetchComments(currentSort.value, currentPage.value, pageSize.value)
};

const isLiked = (commentsId, likeType) => {
  if (land.value){
    return userLikes.value.data.some(like => like.commentsId === commentsId && like.likeType === likeType);
  }
};

</script>

<style scoped>
@import '../../assets/Tailwind.css';
:deep(.el-radio-button__inner ){
  border: none;
}
:deep(.el-radio-button:first-child .el-radio-button__inner ){
  border-left: none;
}

.comment-image {
  width: 100px;
  height: 100px;
  margin: 10px 10px 0 0;
}

.like{
  fill:#9499a0;
}

.like:hover{
  fill: #fe9900;
}

/* 去掉el-radio-button的hover效果 */
:deep(.el-radio-button__inner:hover) {
  color: var(--el-button-text-color,var(--el-text-color-regular));
}
</style>
