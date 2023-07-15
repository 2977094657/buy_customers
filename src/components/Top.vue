<script setup>
import {ref, onMounted,watch} from 'vue';
import {Location} from "@element-plus/icons-vue";
import { useRouter,useRoute } from 'vue-router';


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
const handleScroll = () => {
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
    const searchContainerHeight = searchContainer.offsetHeight;
    isSticky.value = window.pageYOffset > searchContainerHeight;
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

</script>

<template>
  <el-backtop :bottom="100">
    <div class="up">▲<br>顶部</div>
  </el-backtop>
  <div>
    <div class="search-container" :class="{ 'sticky': isSticky }">
      <el-icon :size="30" class="location"><Location /></el-icon>
      <p class="ip" id="result"></p>
      <input v-model="inputValue" class="search" placeholder="请输入商品名" @keyup.enter="searchProduct"/>
      <button @click="searchProduct" class="search-button">搜索</button>
      <div class="head">
        <img class="img" src="http://1.14.126.98:5000/R.jpg" alt="头像">
        <p class="hi">Hi!</p>
        <p class="name"><b>tdd2977094657</b></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/Top.css';
</style>

