<script setup>
import {ref, onMounted,watch,computed,onBeforeUnmount,watchEffect,nextTick,onUpdated  } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { useStore } from 'vuex'
import Login from "@/components/Login.vue";
import axios from "axios";
import {ChatDotSquare, Close, Document, Female, Male} from "@element-plus/icons-vue";
import {HeartOutlined} from "@ant-design/icons-vue";
import ShoppingCart from "@/components/ShoppingCart.vue";
import Star from "@/components/Star.vue";
import { lock, unlock } from 'tua-body-scroll-lock'
import { LogoutOutlined,SearchOutlined } from '@ant-design/icons-vue';

const store = useStore()
const route = useRoute();
const land = computed(() => store.state.userInfo.land)
const refInput =ref()

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
  if (land.value){
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
let Avatar = ref('http://1.14.126.98:5000/login1.jpg'); // 同样，这里也不是一个对象，而是一个字符串
let description = ref('')
let gender = ref('')

const parseTokenAndUserInfo = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await axios.get('http://1.14.126.98:8081/user/token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data) {
        store.commit('setUserInfo', { userId: response.data.userId })
        const userInfoResponse = await axios.get(`http://1.14.126.98:8081/user/all?userId=${response.data.userId}`);
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
  }else if (!token){
    store.commit('setUserInfo', {
      name: userName.value,
      userAvatar: Avatar.value,
      land: false
    });
  }
});

let drawer = ref(false)
const dd = ref(false)
const pj = ref(false)
let sc = ref(false)

const isSidebarVisible = ref(false);

const checkScroll = () => {
  isSidebarVisible.value = window.scrollY > 100;
};

onMounted(() => {
  if (router.currentRoute.value.path === '/PersonalCenter') {
    isSidebarVisible.value = false;
  }else {
    window.addEventListener('scroll', checkScroll);
  }
});

onBeforeUnmount(() => {
  if (router.currentRoute.value.path === '/PersonalCenter') {
    isSidebarVisible.value = false;
  }else {
    window.removeEventListener('scroll', checkScroll);
  }
});

const size=ref('50%')

const loadKey = ref(0);

const reload = () => {
  loadKey.value++;
};

const openDrawer = () => {
  drawer = true;
  lock()
  reload();
};

const openDrawer4 = () => {
  lock()
  sc = true;
  reload();
};

const PersonalCenter = () => {
  if (land.value){
    const url = router.resolve({ name: 'PersonalCenter'}).href;
    window.open(url, '_blank');
  }
};
const handleClose = () => {
  // 在这里执行事件
  unlock()
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

const focusInput = ref(false); // 用于保存输入框是否获得焦点的状态
const remove = ref();
const onBlur = () => {
  if (remove.value){
    refInput.value.focus()
    focusInput.value = true;
    remove.value = false
  }else if (!remove.value){
    focusInput.value = false;
  }
};

const removeHistory = (history) => {
  remove.value=true
  const index = searchHistory.value.indexOf(history);
  if (index > -1) {
    searchHistory.value.splice(index, 1);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
  }
};

const clearHistory = () => {
  // 清除所有的历史记录
  searchHistory.value = [];
  localStorage.setItem('searchHistory', JSON.stringify([]));
};

const searchProduct = () => {
  // 检查 inputValue 是否为空或只包含空格
  if (!inputValue.value || inputValue.value.trim() === '') {
    // 如果是，那么导航到首页
    router.push({ name: 'Home' });
  } else {
    const url = router.resolve({name: 'Search', params: { keyword: inputValue.value }}).href;
    window.open(url, '_blank');

    // 先移除旧的记录，然后添加新的记录
    removeHistory(inputValue.value);
    searchHistory.value.unshift(inputValue.value);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
  }
};


const selectHistory = (history) => {
  // 当用户点击历史记录时，取消事件冒泡，防止触发 @mousedown.prevent
  event.stopPropagation();
  inputValue.value = history;
  searchProduct();
  focusInput.value = false; // 隐藏下拉框
};

const hasScrollbar = ref(false);

const checkScrollbar = async () => {
  await nextTick();
  hasScrollbar.value = document.documentElement.scrollHeight > window.innerHeight;
};

onMounted(checkScrollbar);
onUpdated(checkScrollbar);

</script>

<template>
  <a-modal width="820px" :footer="null" :maskClosable="false" v-model:open="open" @ok="handleOk">
    <Login></Login>
  </a-modal>

  <div class="search-placeholder" v-show="isPlaceholderVisible"></div>
    <div class="search-container" :class="{ 'sticky': isSticky }">
      <p class="ip" id="result"></p>
      <!-- 输入框获得焦点时显示下拉栏，失去焦点时隐藏下拉栏 -->
      <input ref="refInput" @focus="focusInput=true" @blur="onBlur" v-model="inputValue" class="search" placeholder="请输入商品名" @keyup.enter="searchProduct" />

      <button @click="searchProduct" class="search-button">
        <SearchOutlined />
      </button>

      <!-- 历史记录下拉栏 -->
      <div v-show="focusInput" :class="hasScrollbar ? 'dropdown' : 'dropdown-no-scrollbar'" ref="dropdownRef">
        <div class="dropdown-title">
          搜索历史
          <div class="clear-history" @mousedown.prevent="clearHistory">清空</div>
        </div>
        <div class="dropdown-item-wrapper" v-for="history in searchHistory">
          <div class="dropdown-item" @mousedown.prevent="selectHistory(history)">
            <div class="history-text">{{ history }}</div>
          </div>
          <el-icon class="remove-button" @mousedown.stop="removeHistory(history)"><Close /></el-icon>
        </div>
      </div>

      <div class="head">
        <img v-if="!land" class="img" :src="Avatar" alt="头像" @click="showModal();PersonalCenter()">
<!--        悬浮到头像时的弹窗-->
        <el-popover v-if="land" :show-arrow="false" :width="300" popper-style="border-radius: 10px; box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
          <template #reference>
            <img class="img" :src="Avatar" alt="头像" @click="showModal();PersonalCenter()">
          </template>
          <template #default>
            <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column">
              <div style="display: flex">
                <img class="img" :src="Avatar" style="margin-bottom: 8px" alt="头像"/>
                <div style="margin: 0 0 0 20px">
                  <b>{{ userName }}</b>
                  <span>
                    <el-icon style="color: rgb(95,212,242);font-size: 15px;margin-left: 50px" v-if="gender==='男性'"><Male/></el-icon>
                    <el-icon style="color: rgb(255,117,143);font-size: 15px;margin-left: 50px" v-if="gender==='女性'"><Female/></el-icon>
                  </span>
                  <el-alert :title="description" type="info" :closable="false" />
                </div>
              </div>
              <el-divider style="margin: 0"/>
              <div class="tc" @click="schu">
                <LogoutOutlined style="margin: 0;"/>
                <span style="margin: -3px 0 0 20px">退出登录</span>
              </div>
            </div>
          </template>
        </el-popover>


        <p class="hi">Hi!</p>
        <p class="name">
          <span @click="showModal();PersonalCenter()"
            :class="{ 'name1': userName }"
            @mouseover="MouseOver"
            @mouseout="MouseOut"
        >
        <b>{{ userName }}</b>
      </span></p>
      </div>
    </div>

  <div class="cbl" v-show="isSidebarVisible">
    <el-button class="sticky-button" type="primary" @click="openDrawer">
      <div class="sticky-button1">
        <div style="margin: 30px 0 0 0;">
          &nbsp购物车
        </div>
      </div>
    </el-button>
    <el-drawer :key="loadKey" :size="size" v-model="drawer" :with-header="false" @close="handleClose">
      <h1>购物车</h1>
        <ShoppingCart></ShoppingCart>
    </el-drawer>
    <br>
    <el-button class="sticky-button" type="primary" @click="dd = true;lock()">
      <div class="sticky-button2">
        <el-icon style="font-size: 20px;">
          <Document/>
        </el-icon>
        <div style="margin: 5px 0 0 0;">
          我的订单
        </div>
      </div>
    </el-button>
    <el-drawer v-model="dd" :size="size" :with-header="false" @close="handleClose">
      <span>我的订单</span>
    </el-drawer>
    <br>
    <el-button class="sticky-button" type="primary" @click="pj = true;lock()">
      <div class="sticky-button2">
        <el-icon style="font-size: 20px;">
          <ChatDotSquare/>
        </el-icon>
        <div style="margin: 5px 0 0 0;">
          我的评价
        </div>
      </div>
    </el-button>
    <el-drawer v-model="pj" :size="size" title="I am the title" :with-header="false" @close="handleClose">
      <span>我的评价</span>
    </el-drawer>
    <br>
    <el-button class="sticky-button" type="primary" @click="openDrawer4">
      <div class="sticky-button2">
        <HeartOutlined style="font-size: 20px"/>
        <div style="margin: 5px 0 0 0;">
          宝贝收藏
        </div>
      </div>
    </el-button>
    <el-drawer :key="loadKey" :size="size" v-model="sc" :with-header="false" @close="handleClose">
      <h1>宝贝收藏</h1>
      <Star></Star>
    </el-drawer>
    <br>
    <el-backtop :bottom="100" style="
    position: absolute;
    right: 0;
    top: 290px;
    height: 60px;
    width: 60px;
    border-radius: 15px 0 0 15px;box-shadow: none" :visibility-height="600">
      <div class="up"><br>&nbsp&nbsp&nbsp▲<br>&nbsp&nbsp&nbsp顶部</div>
    </el-backtop>
  </div>

</template>

<style scoped>
@import '../assets/Top.css';
</style>

