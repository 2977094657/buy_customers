<script setup>
import { ref, computed } from 'vue';

let currentForm = ref('login');
let phoneNumber = ref('');
let password = ref('');
let phoneNumberTouched = ref(false);

const switchForm = form => {
  currentForm.value = form;
}

const phoneNumberIsValid = computed(() => /^1[3-9]\d{9}$/.test(phoneNumber.value));

const handleBlur = () => {
  phoneNumberTouched.value = true;
}

const handleFocus = () => {
  phoneNumberTouched.value = false;
}

const login = () => {
  if (!phoneNumberIsValid.value) {
    alert('请输入有效的手机号码');

  }

  // 在这里添加登录逻辑
}
</script>

<template>
  <div class="container">
    <div class="logo">
      <img src="" alt="Logo">
    </div>
    <div class="vertical-line"></div>
    <div class="form-container">
      <div class="wz">
        <span @click="switchForm('login')" :class="{ active: currentForm === 'login' }" class="form-switcher">登录</span>
        <div class="line"></div>
        <span @click="switchForm('register')" :class="{ active: currentForm === 'register' }" class="form-switcher">注册</span>
      </div>

      <form v-if="currentForm === 'login'" @submit.prevent="login" class="login">
        <div class="input-phone">
          <div class="sjh">
            手机号
          </div>
          <input placeholder="请输入手机号" class="phone" id="phone-number" type="tel" v-model="phoneNumber" @blur="handleBlur" @focus="handleFocus" required/>
            <hr style="margin-top: 45px;border: none;height: 0.5px;background-color: #e3e5e7;">
          <div style="left: 37px;top: 57px;position: absolute">
            密码
          </div>
          <div class="input-group">
          <input placeholder="请输入密码" class="password" id="password" type="password" v-model="password" required/>
        </div>
        </div>
        <button class="dl">登录</button>
      </form>

    <form v-else-if="currentForm === 'register'">
      <!-- 注册表单的内容 -->222
    </form>
  </div>
  </div>
</template>

<style scoped>
@import '../assets/Login.css';
</style>
