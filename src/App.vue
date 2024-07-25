<template>
  <a-modal :footer="null" :maskClosable="false" v-model:open="open" @ok="handleOk">
    <Login></Login>
  </a-modal>

  <div class="ld:mb-[50px]">
    <Top v-if="deviceType==='PC'&& !isPersonalCenter && !forgotPassword"></Top>
    <div style="min-height: 100vh"
        :class="isPersonalCenter ? '' : (home ? 'main lm:px-2 lm:pt-0 lm:bg-bg mx-auto max-w-7xl sm:px-6 lg:px-5 lm:rounded-none' : (product ? 'main mx-auto max-w-7xl sm:px-6 lg:px-8 lm:rounded-none lm:p-0' : (forgotPassword ? 'bg-white':'main mx-auto max-w-7xl sm:px-6 lg:px-8 lm:-mt-5 lm:rounded-none')))">
      <router-view v-slot="{ Component }">
        <transition :name="transitionName">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>

  <nut-tabbar v-if="!product" class="md:hidden" v-model="active" bottom safe-area-inset-bottom active-color="#FF5000"
              @tab-switch="PersonalCenter">
    <nut-tabbar-item v-for="(item, index) in List" :key="index" :tab-title="item.title" :icon="item.icon">
    </nut-tabbar-item>
  </nut-tabbar>

</template>

<script setup>
import {ref, onMounted, computed,watch} from 'vue'
import {useRoute} from 'vue-router';
import {useStore} from '@/store'
import {getUser, getUserToken} from "@/api/api";
import axios from "axios";
import {showToast} from "vant";
import {h} from 'vue'
import {Home, Cart, My} from '@nutui/icons-vue'
import Login from "@/components/tailwind/Login.vue";
import Top from "@/components/tailwind/Top.vue";
import {router, routes} from "@/router/router";

const route = useRoute();
const store = useStore();
const transitionName = ref('go')

const deviceType = ref('');
const isPersonalCenter = computed(() => route.path.startsWith('/PersonalCenter'));
const product = computed(() => route.path.startsWith('/product'));
const forgotPassword = computed(() => route.path.startsWith('/forgotPassword'));
const home = computed(() => route.path === '/'); // 检查当前路由是否是首页
const land = computed(() => store.userInfo.land)

let userName = ref('请登录'); // 注意这里不再是一个对象，而是一个字符串
let Avatar = ref('http://124.221.7.201:5000/login1.jpg'); // 同样，这里也不是一个对象，而是一个字符串
let description = ref('')
let gender = ref('')

// watch $route 决定使用哪种过渡
watch(
    () => route.path,
    (to, from) => {
      store.setMaskDialog({ state: false, mode: store.maskDialogMode });

      if (deviceType.value !== 'PC') {
        const toDepth = routes.findIndex((v) => v.path === to);
        const fromDepth = routes.findIndex((v) => v.path === from);
        transitionName.value = toDepth > fromDepth ? 'back' : 'go';
      } else {
        transitionName.value = ''; // 不执行任何动画
      }
    }
);

const parseTokenAndUserInfo = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const axiosResponse = await getUserToken(token);
      const response = axiosResponse.data;
      if (response.data) {
        store.setUserInfo({userId: response.data})
        const userInfoResponse = await getUser(response.data);
        if (userInfoResponse.data != null) {
          userName.value = userInfoResponse.data.data.name;
          Avatar.value = userInfoResponse.data.data.userAvatar;
          description.value = userInfoResponse.data.data.description;
          gender.value = userInfoResponse.data.data.gender;
          // 获取 IP 信息
          const ipResponse = await axios.get('https://www.mxnzp.com/api/ip/self?app_id=uiawjmtjkygeqlif&app_secret=UDBzbzNRd2psc3B1UnZ6RTVBZEFEUT09');
          if (ipResponse.data) {
            store.setUserInfo({
              name: userName.value,
              userAvatar: Avatar.value,
              description: description.value,
              userId: response.data,
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

  const today = new Date().toISOString().slice(0, 10); // 获取今天的日期

  if (token) {
    await parseTokenAndUserInfo(token);
  } else if (!token && (!lastShown || lastShown !== today)) {
    showToast("登录过期，请重新登录");

    store.setUserInfo({
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
        store.setDeviceType(deviceType.value);
      }, 0);
      clearInterval(intervalId);
    }
  }, 500);
});

const List = [
  {
    title: '首页',
    icon: h(Home),
    name: 0
  },
  {
    title: '购物车',
    icon: h(Cart),
    name: 1
  },
  {
    title: '我的',
    icon: h(My),
    name: 2
  }
]
const active = ref(0)

const PersonalCenter = (item, index) => {
  if (index === 2) {
    showModal()
  }
  if (land.value && index === 2) {
    router.push({name: 'InforMation'})
  }
  if (index === 0) {
    router.push({name: 'Home'})
  }
};

let open = ref(false)

const handleOk = () => {
  open.value = false
}

const showModal = () => {
  if (land.value) {
    return
  }
  open.value = true
}
</script>

<style scoped>
@import 'assets/Tailwind.css';
.main {
  padding: 20px;
  border-radius: 20px;
  background-color: white;
}

.go-enter-from {
  transform: translate3d(100%, 0, 0);
}

.back-enter-to,
.back-enter-from,
.go-enter-to,
.go-leave-from {
  transform: translate3d(0, 0, 0);
}

.go-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.go-enter-active,
.go-leave-active,
.back-enter-active,
.back-leave-active {
  transition: all 0.3s;
}

.back-enter-from {
  transform: translate3d(-100%, 0, 0);
}

.back-leave-to {
  transform: translate3d(100%, 0, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
