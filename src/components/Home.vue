<script setup> import {ref, onMounted} from 'vue';

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
}; </script>
<template>
  <div>
    <div class="search-container" :class="{ 'sticky': isSticky }">
      <input class="search" placeholder="请输入商品名"/>
      <button class="search-button">搜索</button>
    </div>
    <div class="main">
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </div>
  </div>
</template>
<style scoped> .search-container {
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
  padding: 0 0 0 10px;
  border-radius: 20px;
  background-color: white;
} </style>
