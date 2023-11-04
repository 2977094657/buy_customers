<script setup>
import {ref, onMounted, computed } from 'vue'
import router from "@/router/router";
import {useStore} from 'vuex';
import axios from "axios";


const store = useStore();
const land = computed(() => store.state.userInfo.land)


let title = ref(false);

const currentPage = ref(1)
const Banner = ref([])

const banner = async () => {
  const response = await fetch(`http://124.221.7.201:8081/product/all?current=${currentPage.value}&size=5&sortField=score&isAsc=false`)
  const data = await response.json()
  Banner.value = data.records
  currentPage.value = data.current
}

const goToProduct = (productId) => {
  // 本页面打开
  router.push({ name: 'Product', params: { productId } });
  // 新页面打开
  // const url = router.resolve({ name: 'Product', params: { productId } }).href;
  // window.open(url, '_blank');
}

let open = ref(false)
let userName = ref('请登录'); // 注意这里不再是一个对象，而是一个字符串
let Avatar = ref('http://124.221.7.201:5000/login1.jpg'); // 同样，这里也不是一个对象，而是一个字符串
let currentMessageInstance = null
const parseTokenAndUserInfo = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await axios.get('http://124.221.7.201:8081/user/token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data) {
        const userInfoResponse = await axios.get(`http://124.221.7.201:8081/user/all?userId=${response.data.userId}`);
        if (userInfoResponse.data != null) {
          userName.value = userInfoResponse.data.data.name;
          Avatar.value = userInfoResponse.data.data.userAvatar;
          store.commit('setUserInfo', {
            name: userName.value,
            userAvatar: Avatar.value,
            userId: response.data.userId,
            land: true
          });
        } else {
          console.log('获取用户信息失败');
        }
      } else {
        console.log('Token 解析失败');
      }
    }
  } catch (error) {
    console.error('请求失败：', error);
  }
};

// 在解析 token 的函数组件中调用解析函数并获取用户信息
onMounted(async () => {
  const token = localStorage.getItem('token');
  if (token) {
    await parseTokenAndUserInfo(token);
  }else if (token==null){
    store.commit('setUserInfo', {
      name: userName.value,
      userAvatar: Avatar.value,
      land: false
    });
  }
});

const PersonalCenter = () => {
  if (land.value){
    const url = router.resolve({ name: 'PersonalCenter'}).href;
    window.open(url, '_blank');
  }
};
onMounted(banner)
</script>

<template>
  <div>
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto grid max-w-2xl max-h-70 grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <!-- 第一个位置 -->
        <article class="flex flex-col items-start justify-between">
          <!-- 内容 -->
        </article>

        <!-- 轮播图 -->
        <article class="flex flex-col items-start justify-between">
          <div class="relative w-full">
            <el-carousel indicator-position="none" style="overflow: hidden;border-radius: 17px;">
              <el-carousel-item v-for="Banner in Banner" :key="Banner.productId">
                <img style="max-width: 100%;height: 100%;" @click="goToProduct(Banner.productId)" :src="Banner.img.slice(1, -1).split(',')[0]" alt=""
                     class="aspect-[16/9] w-full rounded-2xl sm:aspect-[2/1] lg:aspect-[3/2]"/>
              </el-carousel-item>
            </el-carousel>
          </div>
        </article>

        <!-- 第三个位置 -->
        <article class="flex flex-col items-start justify-between">
          <!-- 内容 -->
        </article>
      </div>
    </div>
  </div>


</template>

<style scoped>
@import '../../assets/Tailwind.css';
</style>
