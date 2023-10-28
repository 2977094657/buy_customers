<template>
  <a-modal :footer="null" :maskClosable="false" v-model:open="open" @ok="handleOk">
    <Login></Login>
  </a-modal>
  <Disclosure as="header" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
      <div class="relative flex h-16 justify-between">
        <div class="relative z-10 flex px-2 lg:px-0">
          <div @click="goHome" class="z-10 flex flex-shrink-0 items-center">
            <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          </div>
        </div>
        <div class="relative flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
          <div class="w-full sm:max-w-[600px]">
            <label for="search" class="sr-only">Search</label>
            <div class="relative">
              <Input></Input>
            </div>
          </div>
        </div>
        <div class="relative z-10 flex items-center lg:hidden">
          <!-- 移动菜单按钮 -->
          <img v-if="!land" class="h-8 w-8 rounded-full img" :src="Avatar" alt="头像" @click="showModal();PersonalCenter()" />
              <img class="img" :src="Avatar" alt="头像" @click="showModal();PersonalCenter()">
        </div>
        <div class="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">

          <!-- PC端 -->
          <Menu as="div" class="relative ml-4 flex-shrink-0">
            <div style="display: flex;">
              <img v-if="!land" class="h-8 w-8 rounded-full img" :src="Avatar" alt="头像" @click="showModal();PersonalCenter()" />
              <!--        悬浮到头像时的弹窗-->
              <el-popover v-if="land" :show-arrow="false" :width="300" popper-style="border-radius: 10px; box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                <template #reference>
                  <img class="img" :src="Avatar" alt="头像" @click="showModal();PersonalCenter()">
                </template>
                <template #default>
                  <div v-if="land" class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column">
                    <div style="display: flex">
                      <img class="img" :src="Avatar" style="margin-bottom: 8px" alt="头像"/>
                      <div style="margin: 0 0 0 20px">
                        <b>{{ userName }}</b>
                        <span>
                          <el-icon style="color: rgb(95,212,242);font-size: 15px;margin-left: 50px" v-if="gender==='男性'"><Male/></el-icon>
                          <el-icon style="color: rgb(255,117,143);font-size: 15px;margin-left: 50px" v-if="gender==='女性'"><Female/></el-icon>
                        </span>
                        <el-alert :title="description" type="info" :closable="false"/>
                      </div>
                    </div>
                    <hr/>
                    <div class="tc" @click="schu">
                      <LogoutOutlined style="margin: -7px 0 0 0" />
                      <span style="margin: -10px 0 0 20px">退出登录</span>
                    </div>
                  </div>
                </template>
              </el-popover>
              <div style='margin: 0 0 0 20px; display: flex; flex-direction: column; justify-content: center; align-items: center;'> <!-- 在这里添加 Flexbox 属性 -->
              <span>Hi!</span>
              <p>
                <span @click="showModal();PersonalCenter()"
                      @mouseover="MouseOver"
                      @mouseout="MouseOut"
                >
                  <b v-if="userName" style="cursor: pointer" class="name1">{{ userName }}</b>
                </span>
              </p>
              </div>

            </div>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                  <a :href="item.href" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">{{ item.name }}</a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<script setup>
import { Disclosure, Menu, MenuItem, MenuItems } from '@headlessui/vue'
import Input from "@/components/tailwind/Input.vue";

const goHome = () => {
  // 导航到首页
  router.push({name: 'Home'});
};

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

import {ref, onMounted, watch, computed, onBeforeUnmount, watchEffect, nextTick, onUpdated} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {useStore} from 'vuex'
import Login from "@/components/tailwind/Login.vue";
import axios from "axios";
import {Female, Male} from "@element-plus/icons-vue";
import {LogoutOutlined} from '@ant-design/icons-vue';

const store = useStore()
const route = useRoute();
const land = computed(() => store.state.userInfo.land)

onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  watch(() => route.name, (newName) => {
    if (newName === 'Home') {
      inputValue.value = '';
    }
  });
});

const isSticky = ref(false);
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
const isPlaceholderVisible = ref(false);

const handleScroll = () => {
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
    const searchContainerHeight = searchContainer.offsetHeight;
    isSticky.value = window.pageYOffset > searchContainerHeight;
    isPlaceholderVisible.value = isSticky.value;
  }
};


const inputValue = ref('');

const router = useRouter();
let open = ref(false)

const showModal = () => {
  if (land.value) {
    return
  }
  open.value = true
}

const handleOk = () => {
  open.value = false
}


let title = ref(false);

const MouseOver = () => {
  title.value = true;
};

const MouseOut = () => {
  title.value = false;
};

let userName = ref('请登录'); // 注意这里不再是一个对象，而是一个字符串
let Avatar = ref('http://124.221.7.201:5000/login1.jpg'); // 同样，这里也不是一个对象，而是一个字符串
let description = ref('')
let gender = ref('')

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
        store.commit('setUserInfo', {userId: response.data.userId})
        const userInfoResponse = await axios.get(`http://124.221.7.201:8081/user/all?userId=${response.data.userId}`);
        if (userInfoResponse.data != null) {
          userName.value = userInfoResponse.data.data.name;
          Avatar.value = userInfoResponse.data.data.userAvatar;
          description.value = userInfoResponse.data.data.description;
          gender.value = userInfoResponse.data.data.gender;
          store.commit('setUserInfo', {
            name: userName.value,
            userAvatar: Avatar.value,
            description: description.value,
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
  } else if (!token) {
    store.commit('setUserInfo', {
      name: userName.value,
      userAvatar: Avatar.value,
      land: false
    });
  }
});

const isSidebarVisible = ref(false);

const checkScroll = () => {
  isSidebarVisible.value = window.scrollY > 100;
};

onMounted(() => {
  if (router.currentRoute.value.path === '/PersonalCenter') {
    isSidebarVisible.value = false;
  } else {
    window.addEventListener('scroll', checkScroll);
  }
});

onBeforeUnmount(() => {
  if (router.currentRoute.value.path === '/PersonalCenter') {
    isSidebarVisible.value = false;
  } else {
    window.removeEventListener('scroll', checkScroll);
  }
});

const size = ref('50%')

const PersonalCenter = () => {
  if (land.value) {
    const url = router.resolve({name: 'InforMation'}).href;
    window.open(url, '_blank');
  }
};

const logout = () => {
  // 删除本地存储的token
  localStorage.removeItem('token');

  // 刷新页面
  location.reload();
}

const schu = () => {
  ElMessageBox.confirm(
      '确认退出登录吗?',
      '退出登录',
      {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  )
      .then(() => {
        logout();
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消退出',
        })
      })
}

const searchHistory = ref([]); // 用于保存搜索历史的变量

watchEffect(() => {
  // 从本地存储中获取搜索历史
  const history = localStorage.getItem('searchHistory');
  if (history) {
    searchHistory.value = JSON.parse(history);
  }
});

const hasScrollbar = ref(false);

const checkScrollbar = async () => {
  await nextTick();
  hasScrollbar.value = document.documentElement.scrollHeight > window.innerHeight;
};

onMounted(checkScrollbar);
onUpdated(checkScrollbar);
</script>

<style scoped>
@import '../../assets/Tailwind.css';
@import '../../assets/Top.css';
</style>
