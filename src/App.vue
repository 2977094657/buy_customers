<template>
  <div>
    <div v-if="isMobile" class="mobile-warning">
      "你知道蒂姆·伯纳斯-李，万维网的发明者，是怎么看待互联网的吗？他说，'这就是关于空间。你在现实世界中是如何处理空间的'。为了在我们的网站上获得更大的'空间'，请切换到电脑端。"
    </div>
    <router-view name="top"></router-view>
    <div class="main">
      <router-view name="banner"></router-view>
      <router-view name="main"></router-view>
      <router-view name="search"></router-view>
      <router-view name="description"></router-view>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';
useRouter();
import { ref, onMounted } from 'vue'

const isMobile = ref(false)

onMounted(() => {
  const str = navigator.userAgent;
  const ipad = str.match(/(iPad).*OS\s([\d_]+)/);
  const isIphone = !!( !ipad && str.match(/(iPhone\sOS)\s([\d_]+)/) );
  const isAndroid = !!( str.match(/(Android)\s+([\d.]+)/) );
  isMobile.value = isIphone || isAndroid;
});
</script>

<style scoped>
.main {
  margin: 70px 10% 0 10%;
  padding: 20px 0 20px 50px;
  border-radius: 20px;
  background-color: white;
}
.mobile-warning {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  text-align: center;
}
</style>
