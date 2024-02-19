<template>
    <div>
      <router-view v-if="!product||deviceType==='PC'" name="top"></router-view>
      <div :class="isPersonalCenter ? '' : (home ? 'main lm:p-1 lm:bg-bg mx-auto max-w-7xl sm:px-6 lg:px-8 lm:rounded-none' : (product ? 'main mx-auto max-w-7xl sm:px-6 lg:px-8 lm:rounded-none lm:p-0' : (forgotPassword ? 'bg-white':'main mx-auto max-w-7xl sm:px-6 lg:px-8 lm:-mt-5 lm:rounded-none')))">
        <router-view name="personalCenter"></router-view>
        <router-view name="banner"></router-view>
        <router-view name="main"></router-view>
        <router-view name="description"></router-view>
        <router-view name="search"></router-view>
        <router-view name="productComments"></router-view>
        <router-view name="shoppingCart"></router-view>
        <router-view name="orders"></router-view>
        <router-view name="vendor"></router-view>
        <router-view name="ConfirmPay"></router-view>
        <router-view name="Reviews"></router-view>
        <router-view name="forgotPassword"></router-view>
      </div>
    </div>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router';
import {ref, onMounted, computed} from 'vue'
import { useStore } from '@/store'
import {ElNotification} from "element-plus";
import {getUser, getUserToken} from "@/api/api";
import axios from "axios";

const route = useRoute();
const store = useStore();
const deviceType = ref('');
const isPersonalCenter = computed(() => route.path.startsWith('/PersonalCenter'));
const product = computed(() => route.path.startsWith('/product'));
const forgotPassword = computed(() => route.path.startsWith('/forgotPassword'));
const home = computed(() => route.path === '/'); // 检查当前路由是否是首页

const router = useRouter();
let open = ref(false)
let title = ref(false);
let userName = ref('请登录'); // 注意这里不再是一个对象，而是一个字符串
let Avatar = ref('http://124.221.7.201:5000/login1.jpg'); // 同样，这里也不是一个对象，而是一个字符串
let description = ref('')
let gender = ref('')

const parseTokenAndUserInfo = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await getUserToken(token);
      if (response.data) {
        store.setUserInfo( {userId: response.data.userId})
        const userInfoResponse = await getUser(response.data.userId);
        if (userInfoResponse.data != null) {
          userName.value = userInfoResponse.data.data.user.name;
          Avatar.value = userInfoResponse.data.data.user.userAvatar;
          description.value = userInfoResponse.data.data.user.description;
          gender.value = userInfoResponse.data.data.user.gender;
          // 获取 IP 信息
          const ipResponse = await axios.get('https://www.mxnzp.com/api/ip/self?app_id=uiawjmtjkygeqlif&app_secret=UDBzbzNRd2psc3B1UnZ6RTVBZEFEUT09');
          if (ipResponse.data) {
            store.setUserInfo({
              name: userName.value,
              userAvatar: Avatar.value,
              description: description.value,
              userId: response.data.userId,
              land: true,
              ip: ipResponse.data.data.province // 将省份信息存储到 Vuex 的 ip 属性中
            });
          } else {
            console.log('获取 IP 信息失败');
          }
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

onMounted(async () => {
  const token = localStorage.getItem('token');
  const lastShown = localStorage.getItem('lastShown');

  const today = new Date().toISOString().slice(0,10); // 获取今天的日期

  if (token) {
    await parseTokenAndUserInfo(token);
  } else if (!token && (!lastShown || lastShown !== today)) {
    ElNotification({
      title: '登录失效',
      message: '登录过期，请重新登录',
      type: 'error',
    })
    store.setUserInfo( {
      name: userName.value,
      userAvatar: Avatar.value,
      land: false
    });
    localStorage.setItem('lastShown', today); // 更新日期标记
  }
});

const setDeviceType = async () => {
  const userAgent = navigator.userAgent;
  const isIpad = userAgent.match(/(iPad).*OS\s([\d_]+)/);
  const isIphone = userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
  const isAndroid = userAgent.match(/(Android)\s+([\d.]+)/);

  if (isIpad) {
    deviceType.value = 'iPad';
  } else if (isIphone) {
    deviceType.value = 'iPhone';
  } else if (isAndroid) {
    deviceType.value = 'Android';
  } else {
    deviceType.value = 'PC';
  }
};

onMounted(async () => {
  await setDeviceType();

  const intervalId = setInterval(() => {
    if (deviceType.value !== undefined) {
      setTimeout(() => {
        store.setDeviceType( deviceType.value);
      }, 0);
      clearInterval(intervalId);
    }
  }, 500);
});
</script>

<style scoped>
@import 'assets/Tailwind.css';
.main {
  padding: 20px;
  border-radius: 20px;
  background-color: white;
}
</style>
