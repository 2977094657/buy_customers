<script setup>
import {ref, onMounted} from 'vue';
import {Location} from "@element-plus/icons-vue";

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


const images = [
  { url: 'https://img.alicdn.com/imgextra/i2/6000000006120/O1CN017UCQi11v50mRrliBX_!!6000000006120-0-octopus.jpg', alt: 'image 1' },
  { url: 'https://img.alicdn.com/imgextra/i1/6000000002018/O1CN01YRcqHN1QmI7UPZ0rr_!!6000000002018-0-octopus.jpg', alt: 'image 2' },
  { url: 'https://img.alicdn.com/imgextra/i4/6000000003879/O1CN01e0c4Eq1eWdC24ncT5_!!6000000003879-0-octopus.jpg', alt: 'image 3' },
  { url: 'https://img.alicdn.com/imgextra/i1/6000000007229/O1CN01GgcsqS23Gw0zjsuxA_!!6000000007229-0-octopus.jpg', alt: 'image 4' },
  { url: 'https://img.alicdn.com/imgextra/i3/6000000004438/O1CN01QnfX2c1ieeaw2DY5Y_!!6000000004438-0-octopus.jpg', alt: 'image 5' }
]
</script>

<template>
  <el-backtop :bottom="100">
    <div class="up">▲<br>顶部</div>
  </el-backtop>
  <div>
    <div class="search-container" :class="{ 'sticky': isSticky }">
      <el-icon :size="30" class="location"><Location /></el-icon>
      <p class="ip" id="result"></p>
      <input class="search" placeholder="请输入商品名"/>
      <button class="search-button">搜索</button>
      <div class="head">
        <img class="img" src="https://th.bing.com/th?id=OIP.DPgFyuPIZ-sjtbWtVLWaxgAAAA&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" alt="头像">
        <p class="hi">Hi!</p>
        <p class="name"><b>tdd2977094657</b></p>
      </div>
    </div>
    <div class="main">
      <div class="banner">
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="(image, index) in images" :key="index">
            <img  :src="image.url" :alt="image.alt">
          </el-carousel-item>
        </el-carousel>
      </div>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  margin: 40px 0 0 0;
  position: relative;
  text-align: center;
}

.sticky {
  padding: 10px 0 0 0;
  position: fixed;
  top: -40px; /* 修改这里的值 */
  left: 0;
  width: 100%;
  height: 60px;
  background-color: white;
  z-index: 1;
}

.search {
  width: 30%;
  height: 30px;
  border-radius: 100px 0 0 100px;
  border: 2px solid #ffffff;
  padding: 5px 15px;
  color: black;
}

.sticky .search {
  border-color: #FF5000;
}

.search:focus {
  outline: none;
  border-color: #FF5000;
}

.search-button {
  width: 70px;
  height: 44px;
  border-radius: 0 100px 100px 0;
  background-color: rgb(255, 83, 0);
  color: #fff;
  border: none;
  font-size: 14px;
  line-height: 30px;
  z-index: 1;
}

.main {
  margin: 70px 10% 0 10%;
  padding: 20px 20px 0 20px;
  border-radius: 20px;
  background-color: white;
}

.up{
  height: 100%;
  width: 100%;
  background-color: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-lighter);
  text-align: center;
  color: #8b8c8d;
  border-radius: 10px;
  font-size: 10px;
}

.img{
  border: 1px #FF5000 solid;
  border-radius: 100px;
  height: 50px;
  width: 50px;
}

.head{
  position: absolute;
  margin: -47px 0 0 75%;
}

.hi{
  position: absolute;
  top: -12px;
  right: -40px;
}

.name{
  position: absolute;
  top: 10px;
  right: -145px;
}

.name:hover {
  color: #FF5000;
  cursor: pointer;
}

.ip{
  top: -5px;
  left: 20%;
  position: absolute;
  font-weight: bold;
}

.location{
  top: 5px;
  left: 18%;
  position: absolute;
}

.sticky .location{
  top: 10px;
}

.sticky .ip{
  top: 5px;
}

.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.banner{
  overflow: hidden;
  border-radius: 10px;
  margin: 10px 0 0 25%;
  width: 48%;
}

img{
  width: 100%;
  height: 100%;
}

.el-carousel__item{
  border-radius: 10px;
}
</style>

