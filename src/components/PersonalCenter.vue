<script setup>
import { ref } from 'vue'
import {Document, User,ShoppingCart, ChatDotSquare} from '@element-plus/icons-vue'
import {HeartOutlined} from "@ant-design/icons-vue";
import MyCart from "@/components/ShoppingCart.vue";
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

const showIndex = ref(1)
</script>

<template>
  <el-container class="layout-container-demo" style="height: 595px">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            :collapse="false"
            @open="handleOpen"
            @close="handleClose"
        >
          <el-menu-item index="1" @click="showIndex = 1">
            <el-icon><User /></el-icon>
            <template #title>
              <span>个人资料</span>
            </template>
          </el-menu-item>
          <el-menu-item index="2" @click="showIndex = 2">
            <el-icon><HeartOutlined></HeartOutlined></el-icon>
            <template #title>宝贝收藏</template>
          </el-menu-item>
          <el-menu-item index="3" @click="showIndex = 3">
            <el-icon><document /></el-icon>
            <template #title>我的订单</template>
          </el-menu-item>
          <el-menu-item index="4" @click="showIndex = 4">
            <el-icon><ChatDotSquare/></el-icon>
            <template #title>我的评价</template>
          </el-menu-item>
          <el-menu-item index="5" @click="showIndex = 5">
            <el-icon><ShoppingCart /></el-icon>
            <template #title>购物车</template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>


      <el-main style="padding: 0">
        <el-scrollbar>
          <div v-if="showIndex===5">
            <h1 style="margin: 0 0 50px 60px;">
            购物车
          </h1>
          <MyCart  style="position:relative;width: 800px;left: 50px;"></MyCart>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>

</template>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 580px;
}

.el-menu-item.is-active {
  color: #F40; /* 这里可以替换成你想要的颜色值 */
}

.el-menu-item:hover{
  background-color: #f5f5f5; /* 这里可以替换成你想要的背景色值 */
}

/deep/.checkout-bar {
  margin: -100px 0 0 0;
  z-index: 100;
  position: sticky;
  left: 10px;
  width: 95%;
  height: 40px;
  background: #fff;
  border-top: 1px solid #e6e6e6;
  align-items: center;
  padding: 20px;
}

/deep/.cz{
  margin: -40px 0 20px 760px;
}

/deep/.db{
  width: 850px;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
  height: 30px;
  margin: 0 0 10px -20px;
}

/deep/.btn{
  margin: 0 0 0 680px
}

/deep/.zj{
  z-index: 100;
  color: rgb(255,80,0);
  width: 100px;
  position: relative;
  top: -75px;
  left: 100px;
}
</style>
