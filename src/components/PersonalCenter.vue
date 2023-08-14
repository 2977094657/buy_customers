<script setup>
import {Document, User,ShoppingCart, ChatDotSquare} from '@element-plus/icons-vue'
import {HeartOutlined} from "@ant-design/icons-vue";
import MyCart from "@/components/ShoppingCart.vue";
import Star from "@/components/Star.vue";
import InforMation from "@/components/InforMation.vue";
import {ref, onMounted} from 'vue';

const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
const showIndex = ref(sessionStorage.getItem('showIndex') || 1);

const updateShowIndex = (key) => {
  sessionStorage.setItem('showIndex', key);
  showIndex.value = key;
};
onMounted(() => {
  updateShowIndex(1);
});
</script>

<template>
  <div class="divider"></div>
  <el-container class="layout-container-demo" style="height: 595px">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu
            :default-active="'1'"
            class="el-menu-vertical-demo"
            :collapse="false"
            @close="handleClose"
        >
          <el-menu-item index="1" @click="updateShowIndex(1)">
            <el-icon><User /></el-icon>
            <template #title>
              <span>个人资料</span>
            </template>
          </el-menu-item>
          <el-menu-item index="2" @click="updateShowIndex(2)">
            <el-icon><HeartOutlined></HeartOutlined></el-icon>
            <template #title>宝贝收藏</template>
          </el-menu-item>
          <el-menu-item index="3" @click="updateShowIndex(3)">
            <el-icon><document /></el-icon>
            <template #title>我的订单</template>
          </el-menu-item>
          <el-menu-item index="4" @click="updateShowIndex(4)">
            <el-icon><ChatDotSquare/></el-icon>
            <template #title>我的评价</template>
          </el-menu-item>
          <el-menu-item index="5" @click.passive="updateShowIndex(5)">
            <el-icon><ShoppingCart /></el-icon>
            <template #title>购物车</template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-main style="padding: 0">
        <el-scrollbar>
          <div v-if="showIndex===1">
            <InforMation></InforMation>
          </div>

          <div v-if="showIndex===5">
            <h1 style="margin: 0 0 50px 60px;">
            购物车
          </h1>
            <div style="position:relative;width: 800px;left: 50px;">
              <MyCart></MyCart>
            </div>
          </div>

          <div v-if="showIndex===2">
            <h1 style="margin: 0 0 50px 60px;">
              宝贝收藏
            </h1>
            <Star  style="position:relative;width: 800px;left: 50px;"></Star>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>

  </el-container>

</template>

<style scoped>
@import '../assets/PersonalCenter.css';
</style>
