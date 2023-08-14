<script setup>
import {ref, onMounted, computed} from 'vue';
import store from "@/store";
import {Female, Male} from "@element-plus/icons-vue";
import axios from 'axios';

const userInfo = ref(null);
const userid = computed(() => store.state.userInfo.userId)
const avatarUrl = ref('');

const fetchUserInfo = async () => {
  const userId = userid.value;
  if (userId) {
    const response = await fetch(`http://1.14.126.98:8081/user/all?userId=${userId}`);
    const data = await response.json();
    if (data.code === 0) {
      userInfo.value = data.data;
      avatarUrl.value = data.data.userAvatar; // 获取头像图片URL
    } else {
      console.error('获取用户信息失败');
    }
  } else {
    setTimeout(fetchUserInfo, 1);
  }
};

onMounted(fetchUserInfo);

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function formatPhoneNumber(phoneNumber) {
  if (phoneNumber && phoneNumber.length === 11) {
    const firstThreeDigits = phoneNumber.substr(0, 3);
    const lastFourDigits = phoneNumber.substr(7, 4);
    return `${firstThreeDigits}****${lastFourDigits}`;
  }
  return phoneNumber;
}


const selectedRegion = ref([]);
const regions = ref([]);
const props = {
  value: 'value',
  label: 'label',
  children: 'children'
};

onMounted(async () => {
  try {
    const response = await axios.get('https://www.mxnzp.com/api/address/list?app_id=uiawjmtjkygeqlif&app_secret=UDBzbzNRd2psc3B1UnZ6RTVBZEFEUT09');
    const data = response.data;
    if (data.code === 1) {
      regions.value = data.data.map(region => ({
        value: region.code,
        label: region.name,
        children: region.pchilds.map(city => ({
          value: city.code,
          label: city.name,
          children: city.cchilds.map(district => ({
            value: district.code,
            label: district.name
          }))
        }))
      }));
    } else {
      console.error('接口返回错误:', data.msg);
    }
  } catch (error) {
    console.error('请求接口出错:', error);
  }
});

const showEditLabel = ref(false);
</script>

<template>
  <div class="user-avatar-container">
    <div class="avatar" :style="{'background-image': `url(${avatarUrl})`}"></div>
  </div>
    <div v-if="userInfo" class="user-info-container">
      <img :src="userInfo.userAvatar" alt="用户头像" class="user-avatar" />
      <div class="user-info-details">
        <h1 class="user-info-title">
          {{ userInfo.name }}
          <span>
          <el-icon style="color: rgb(95,212,242);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='男性'"><Male /></el-icon>
          <el-icon style="color: rgb(255,117,143);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='保密'"><Female /></el-icon>
        </span>
        </h1>
        <div class="user-info-item" @mouseover="showEditLabel=true" @mouseleave="showEditLabel=false">
          <span v-if="showEditLabel" class="edit-label">点击修改个性标签</span>
          {{ userInfo.description }}
        </div>
        <div>
          <p>绑定手机：{{ formatPhoneNumber(userInfo.phone) }}</p>
        </div>
        <div>
          <p>注册时间：{{ formatTime(userInfo.signupTime) }}</p>
        </div>
        <div>
          <p>收货地址：{{ userInfo.address }}</p>
        </div>
      </div>
      <div>
        <el-cascader
            placeholder="请选择收货地址"
            v-model="selectedRegion"
            :options="regions"
            :props="props"
        ></el-cascader>
      </div>
    </div>
</template>

<style scoped>
@import '../assets/InforMation.css';
.user-avatar-container {
  width: 100%; /* 设置容器宽度 */
  height: 250px; /* 设置容器高度 */
  overflow: hidden; /* 超出容器部分隐藏 */
}
.user-avatar-container:after {
  position: absolute;
  content: '';
  width: 100%;
  height: 250px;
  top: 0;
  left: 0;
  box-shadow:0 0 80px 30px #ffffff inset;
}
.avatar {
  background-size: cover; /* 背景图片按比例缩放，保持填充容器 */
  background-repeat: no-repeat; /* 不重复平铺背景图片 */
  width: 100%; /* 图片宽度占满容器 */
  height: 100%; /* 图片高度占满容器 */
  background-position: center; /* 背景图片居中对齐 */
  filter: blur(25px); /* 高斯模糊效果，值可根据需要调整 */
}
</style>
