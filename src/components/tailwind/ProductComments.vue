<template>
  <div class="bg-white">
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
                    <div v-for="count in reviews.counts" :key="count.rating" class="flex items-center text-sm">
                      <dt class="flex flex-1 items-center">
                        <div aria-hidden="true" class="ml-1 flex flex-1 items-center">
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
          <el-empty v-else :image-size="300"
                    image="http://124.221.7.201:5000/state/Comment-empty.png"
                    description="这个商品如此神秘，连评论都默默无闻。你可以给它一点关注吗？它会感激不尽的！"/>

          <div>
            <div class="flex justify-end mr-7 mb-5">
              <el-radio-group text-color="#FE9900" fill="white" v-model="radio1" size="large">
                <el-radio-button @click="sortComments('hottest')" label="最新" />
                <el-radio-button @click="sortComments('newest')" label="最热" />
                <el-radio-button @click="sortComments('withImage')" label="有图" />
              </el-radio-group>
            </div>
            <div v-for="(comment) in comments" :key="comment.id" class="w-full text-sm text-gray-500">
              <div class=" space-x-12">
                <!-- 添加了justify-between -->
                <div class="flex items-center mr-5">
                  <img :src="comment.userAvatar" alt="用户头像" class="h-10 w-10 rounded-full bg-gray-100"/>
                  <h3 style="margin-bottom: 20px; margin-left: 10px" class="font-medium text-gray-900 flex-grow">
                    {{ comment.userName }}</h3>
                  <el-rate
                      v-model="comment.score"
                      disabled
                      :colors="colors"
                  />
                </div>

                <div style="margin-top: -15px">
                  <time>{{ comment.time }}</time>
                </div>
                <!--  评论内容-->
                <div class="prose prose-sm mt-4 max-w-none text-gray-500 mb-4" v-html="comment.comments"/>

              </div>

              <hr class="mb-4">
            </div>
            <div v-if="pageInfo.total!==0">
              <el-pagination
                  @next-click="nextPage"
                  @prev-click="previousPage"
                  :page-sizes="[10, 20, 50, 1000]"
                  layout="sizes, prev, pager, next"
                  :total="total"
                  @size-change="handleSizeChange"
                  @current-change="goToPage"
              />
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


import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {useStore} from 'vuex';


const route = useRoute()
const httpError = ref(false)
const show = ref(true)
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])

const store = useStore();
const userId = computed(() => store.state.userInfo.userId)
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
const fetchComments = async (sortOption, page,pageSize) => {
  if (!isNaN(route.params.productId)) {
    const sortByTime = sortOption === 'newest'
    const response = await fetch(`http://124.221.7.201:8081/product/comments?productId=${route.params.productId}&pageNum=${page}&sortByTime=${sortByTime}&pageSize=${pageSize}`)
    const data = await response.json()

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
}

console.log(totalPages.value)

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
      const response = await fetch(`http://124.221.7.201:8081/product/selectById?productId=${route.params.productId}`);
      const data = await response.json();
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

onMounted(async () => {
  await star()
})

const previousPage = () => {
  if (currentPage.value > 1) {
    fetchComments(currentSort.value, currentPage.value - 1,pageSize.value)
    window.scrollTo(0, 0)
  }
}

const nextPage = async () => {
  console.log(totalPages.value,currentPage.value)
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
const sortComments = async (sortOption) => {
  if (sortOption === 'withImage') {
    await filterCommentsWithImage();
  } else {
    // 更新 currentSort 并重新获取评论
    currentSort.value = sortOption
    await fetchComments(sortOption, currentPage.value,pageSize.value)
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
</script>

<style scoped>
@import '../../assets/Tailwind.css';
/deep/.el-radio-button__inner {
  border: none;
}
/deep/.el-radio-button:first-child .el-radio-button__inner {
  border-left: none;
}
</style>
