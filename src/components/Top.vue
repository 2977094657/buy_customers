<script setup>
import {ref, onMounted,watch,computed,onBeforeUnmount } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { useStore } from 'vuex'
import Login from "@/components/Login.vue";
import axios from "axios";
import {ChatDotSquare, Document} from "@element-plus/icons-vue";
import {HeartOutlined} from "@ant-design/icons-vue";
import ShoppingCart from "@/components/ShoppingCart.vue";
import Star from "@/components/Star.vue";

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

// // 高德地图IP定位
// const xhr = new XMLHttpRequest();
//
// // 设置请求方法和请求地址
// xhr.open('GET', 'https://restapi.amap.com/v3/ip?key=60e8251375335c948c8aed72f3d53824', true);
//
// // 发送HTTP请求
// xhr.send();
//
// // 处理响应
// xhr.onreadystatechange = function() {
//   // 如果响应已经完成
//   if (xhr.readyState === 4) {
//     // 如果HTTP状态码是200，表示请求成功
//     if (xhr.status === 200) {
//       // 解析响应体
//       const response = JSON.parse(xhr.responseText);
//
//       // 获取城市名
//       const city = response.city;
//
//       // 将城市名展示在页面上
//       const resultElem = document.getElementById('result');
//       resultElem.innerHTML = city;
//     } else {
//       // 如果HTTP状态码不是200，表示请求失败
//       console.error('请求失败，HTTP状态码：' + xhr.status);
//     }
//   }
// };


const inputValue = ref('');

const router = useRouter();

const searchProduct = () => {
  // 检查 inputValue 是否为空或只包含空格
  if (!inputValue.value || inputValue.value.trim() === '') {
    // 如果是，那么导航到首页
    router.push({ name: 'Home' });
  } else {
    // 否则，执行搜索
    router.push({ name: 'Search', params: { keyword: inputValue.value } });
  }
};

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

const closeModal = () => {
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
let Avatar = ref('http://1.14.126.98:5000/add/Afterclap-4_20230721_200107225.png'); // 同样，这里也不是一个对象，而是一个字符串

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
  window.addEventListener('scroll', checkScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkScroll);
});

const size=ref('50%')

const loadKey = ref(0);

const reload = () => {
  loadKey.value++;
};

const openDrawer = () => {
  drawer = true;
  reload();
};

const reload4 = () => {
  loadKey.value++;
};

const openDrawer4 = () => {
  sc = true;
  reload4();
};
</script>

<template>
  <a-modal width="820px" :footer="null" :maskClosable="false" v-model:open="open" @ok="handleOk">
    <Login @close-modal="closeModal"></Login>
  </a-modal>

  <div class="search-placeholder" v-show="isPlaceholderVisible"></div>
    <div class="search-container" :class="{ 'sticky': isSticky }">
<!--      <el-icon :size="30" class="location"><Location /></el-icon>--><!-- 由于高德在小地方请求不稳定,暂时禁掉定位图标及程序-->
      <p class="ip" id="result"></p>
      <input v-model="inputValue" class="search" placeholder="请输入商品名" @keyup.enter="searchProduct"/>
      <button @click="searchProduct" class="search-button"><b>搜索</b></button>
      <div class="head">
        <img class="img" :src="Avatar" alt="头像" @click="showModal">
        <p class="hi">Hi!</p>
        <p class="name">
          <span @click="showModal"
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
    <el-drawer :key="loadKey" :size="size" class="el-drawer__container" v-model="drawer" :with-header="false">
      <h1>购物车</h1>
        <ShoppingCart></ShoppingCart>
    </el-drawer>
    <br>
    <el-button class="sticky-button" type="primary" @click="dd = true">
      <div class="sticky-button2">
        <el-icon style="font-size: 20px;">
          <Document/>
        </el-icon>
        <div style="margin: 5px 0 0 0;">
          我的订单
        </div>
      </div>
    </el-button>
    <el-drawer v-model="dd" title="I am the title" :with-header="false">
      <span>我的订单</span>
    </el-drawer>
    <br>
    <el-button class="sticky-button" type="primary" @click="pj = true">
      <div class="sticky-button2">
        <el-icon style="font-size: 20px;">
          <ChatDotSquare/>
        </el-icon>
        <div style="margin: 5px 0 0 0;">
          我的评价
        </div>
      </div>
    </el-button>
    <el-drawer v-model="pj" title="I am the title" :with-header="false">
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
    <el-drawer :key="loadKey" :size="size" class="el-drawer__container" v-model="sc" :with-header="false">
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

