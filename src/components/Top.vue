<script setup>
import {ref, onMounted,watch} from 'vue';
import {Location} from "@element-plus/icons-vue";
import { useRouter,useRoute } from 'vue-router';
import { useStore } from 'vuex'
import Login from "@/components/Login.vue";
import axios from "axios";

const store = useStore()
const route = useRoute();

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

// 创建XMLHttpRequest对象
const xhr = new XMLHttpRequest();

// 设置请求方法和请求地址
xhr.open('GET', 'https://restapi.amap.com/v3/ip?key=60e8251375335c948c8aed72f3d53824', true);

// 发送HTTP请求
xhr.send();

// 处理响应
xhr.onreadystatechange = function() {
  // 如果响应已经完成
  if (xhr.readyState === 4) {
    // 如果HTTP状态码是200，表示请求成功
    if (xhr.status === 200) {
      // 解析响应体
      const response = JSON.parse(xhr.responseText);

      // 获取城市名
      const city = response.city;

      // 将城市名展示在页面上
      const resultElem = document.getElementById('result');
      resultElem.innerHTML = city;
    } else {
      // 如果HTTP状态码不是200，表示请求失败
      console.error('请求失败，HTTP状态码：' + xhr.status);
    }
  }
};


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
        const userInfoResponse = await axios.get(`http://1.14.126.98:8081/user/all?userId=${response.data.userId}`);
        if (userInfoResponse.data != null) {
          userName.value = userInfoResponse.data.data.name;
          Avatar.value = userInfoResponse.data.data.userAvatar;
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
  }
});
</script>

<template>
  <a-modal width="820px" :footer="null" :maskClosable="false" v-model:open="open" @ok="handleOk">
    <Login @close-modal="closeModal"></Login>
  </a-modal>

  <div class="search-placeholder" v-show="isPlaceholderVisible"></div>
  <el-backtop :bottom="100">
    <div class="up">▲<br>顶部</div>
  </el-backtop>
    <div class="search-container" :class="{ 'sticky': isSticky }">
      <el-icon :size="30" class="location"><Location /></el-icon>
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
</template>

<style scoped>
@import '../assets/Top.css';
</style>

