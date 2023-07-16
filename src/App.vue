<template>
  <div>
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
</script>

<style scoped>
.main {
  margin: 70px 10% 0 10%;
  padding: 20px 0 20px 50px;
  border-radius: 20px;
  background-color: white;
}
</style>
