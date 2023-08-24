<script setup>
import {ref, computed} from 'vue';
import login from "@/components/Login.vue";
import axios from 'axios';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {onMounted} from 'vue';


const router = useRouter();
const store = useStore()

let currentForm = ref('login');
let phoneNumber = ref('');
let phoneNumber1 = ref('');
let password = ref('');
let password1 = ref('');
let verifyCode = ref('') // 存储从 API 获取的验证码
let userInputVerifyCode = ref('') // 存储用户输入的验证码
let getCaptchaBtnText = ref({countdown: null, text: '点击获取验证码'})
let countdownTimer = null // 存储计时器
let currentMessageInstance = null
let isBtnDisabled = ref(false)
let userName = ref('');
let name = ref('');
let userAvatar = ref('');
let isSending = ref(false);
let confirmPassword = ref('');
let phoneCode = ref('')

let isPasswordConfirmed = computed(() => {
  return password.value === confirmPassword.value;
});


let isLoginButtonDisabled = computed(() => {
  // 当手机号和密码都不为空时，返回 false，否则返回 true
  return phoneNumber1.value === '' || password1.value === '';
});

const showMessage = (message) => {
  // 如果当前有消息正在显示，先关闭它
  if (currentMessageInstance) {
    currentMessageInstance.close()
  }

  // 显示新的消息并保存该消息实例
  currentMessageInstance = ElMessage({message, type: 'error'})
}

const showSuccessMessage = (message) => {
  // 如果当前有消息正在显示，先关闭它
  if (currentMessageInstance) {
    currentMessageInstance.close()
  }

  // 显示新的消息并保存该消息实例，消息类型设置为 'success'
  currentMessageInstance = ElMessage({message, type: 'success'})
}

const switchForm = form => {
  currentForm.value = form;
}

// 创建一个 ref 来存储验证码图片的 URL
let captchaImgUrl = ref('')

// 修改 getCaptcha 函数，以获取验证码的值
const getCaptcha = async () => {
  let response = await fetch('https://www.mxnzp.com/api/verifycode/code?len=5&type=0&app_id=uiawjmtjkygeqlif&app_secret=UDBzbzNRd2psc3B1UnZ6RTVBZEFEUT09')
  let data = await response.json()
  if (data.code === 1) {
    captchaImgUrl.value = data.data.verifyCodeImgUrl
    verifyCode.value = data.data.verifyCode
  } else {
    console.error('获取验证码失败：' + data.msg)
  }
}

// 在组件初始化时获取验证码
getCaptcha()
const loginUser = async () => {
  try {
    const response = await axios.post(`http://1.14.126.98:8081/user/login?phone=${phoneNumber1.value}&pwd=${password1.value}`);
    if (response.data.token) {
      showSuccessMessage('登陆成功');
      // 延迟一段时间后刷新页面
      setTimeout(() => {
        location.reload();
      }, 500); // 1秒延迟
      localStorage.setItem('token', response.data.token);
      // 更新 userInfo 的值，触发 name.value 的变化
      store.commit('setUserInfo', {
        name: userName.value,
        userAvatar: userAvatar.value,
        land: true
      });
    } else {
      // 登录失败，显示默认的错误消息
      showMessage('登录失败');
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // 服务器返回了一个 400 错误
      // 可以从 error.response.data 中获取服务器返回的错误信息
      showMessage('手机号或密码错误');
    } else {
      // 其他类型的错误
      console.error(error);
    }
  }
};

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
        if (userInfoResponse.data && userInfoResponse.data.code === 0) {
          userName.value = userInfoResponse.data.data.name;
          userAvatar.value = userInfoResponse.data.data.userAvatar;
          store.commit('setUserInfo', {
            name: userName.value,
            userAvatar: userAvatar.value,
            land: true
          });
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
  } else if (!token) {
    store.commit('setUserInfo', {
      name: userName.value,
      land: false
    });
  }
});


const sendSMSCode = async () => {
  if (userInputVerifyCode.value === '') {
    // 提示用户输入验证码
    showMessage('请输入图形验证码')
    return;
  } else if (userInputVerifyCode.value !== verifyCode.value) {
    // 验证码输入错误，提供错误提示
    showMessage('图形验证码输入错误')
    return;
  }
  // 清除验证码输入框的值并获取新的验证码
  userInputVerifyCode.value = '';
  await getCaptcha();
  // 如果正在发送或倒计时未结束，直接返回
  if (isSending.value || getCaptchaBtnText.value.countdown !== null) {
    return;
  }

  // 使用正则表达式验证手机号码
  const phoneNumberReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (!phoneNumberReg.test(phoneNumber.value)) {
    // 如果电话号码不符合正则表达式，显示错误信息并返回，不继续发送请求
    showMessage('请输入正确的手机号码');
    return;
  }
  isSending.value = true;
  try {
    const response = await axios.post(`http://1.14.126.98:8081/user/message?phoneNumber=${phoneNumber.value}`);
    isSending.value = false;
    if (response.data === '手机号已被注册') {
      // 如果手机号已被注册，显示特定的错误信息
      showMessage('手机号已被注册');
    } else if (typeof response.data === 'object' && response.data.SendStatusSet && response.data.SendStatusSet.length > 0) {
      // 检查返回的数据中的 "Code" 属性
      if (response.data.SendStatusSet[0].Code === 'Ok') {
        // 短信验证码发送成功
        showSuccessMessage('验证码已发送，请注意查收！');
        // 禁用获取验证码按钮
        isBtnDisabled.value = true;
        // 开始倒计时
        let countdown = 60;
        getCaptchaBtnText.value = {countdown, text: '秒后重新发送'};
        countdownTimer = () => {
          countdown--;
          if (countdown <= 0) {
            clearInterval(countdownTimer);
            countdownTimer = null; // 清理倒计时
            getCaptchaBtnText.value = {countdown: null, text: '获取验证码'};
            // 启用获取验证码按钮
            isBtnDisabled.value = false;
          } else {
            getCaptchaBtnText.value = {countdown, text: '秒后重新发送'};
          }
        }
      } else {
        // 短信验证码发送失败，显示错误信息
        showMessage(response.data.SendStatusSet[0].Message || '验证码发送失败');
      }
    } else {
      // 服务器没有返回预期的数据格式，显示错误信息
      showMessage('验证码发送失败，请稍后再试');
    }
  } catch (error) {
    isSending.value = false;
    console.error(error);
    showMessage('验证码发送失败，请稍后再试');
  }
};

const registerUser = async () => {
  if (!isPasswordConfirmed.value) {
    showMessage('密码和确认密码不一致');
    return;
  }
  try {
    const response = await axios.post(`http://1.14.126.98:8081/user/register?phone=${phoneNumber.value}&name=${name.value}&pwd=${password.value}&code=${phoneCode.value}`);
    if (response.data === '注册成功') {
      showSuccessMessage('注册成功');
    } else {
      showMessage(response.data);
    }
  } catch (error) {
    console.error(error);
  }
};
defineExpose({
  switchForm
});

</script>

<template>
  <div class="container">
    <div class="logo">
      <img src="" alt="Logo">
    </div>
    <div class="vertical-line"></div>
    <div class="form-container">
      <div class="wz">
        <span @click="switchForm('login')" :class="{ active: currentForm === 'login' }"
              class="form-switcher">登录</span>
        <div class="line"></div>
        <span @click="switchForm('register')" :class="{ active: currentForm === 'register' }"
              class="form-switcher">注册</span>
      </div>

      <form v-if="currentForm === 'login'" @submit.prevent="login" class="login">
        <div class="input-phone">
          <div class="sjh">
            手机号
          </div>
          <input autocomplete="tel" v-model="phoneNumber1" placeholder="请输入手机号" class="phone" id="phone-number"
                 type="tel" required/>
          <hr style="margin-top: 45px;border: none;height: 0.5px;background-color: #e3e5e7;">
          <div style="left: 37px;top: 57px;position: absolute">
            密码
          </div>
          <div class="input-group">
            <input autocomplete="current-password" v-model="password1" placeholder="请输入密码" class="password"
                   id="password" type="password" required/>
          </div>
        </div>
        <button class="dl" @click="loginUser" :disabled="isLoginButtonDisabled">登录</button>
      </form>

      <form v-else-if="currentForm === 'register'" @submit.prevent="registerUser" class="register">
        <div class="account">
          <div class="zh">
            昵称
          </div>
          <input autocomplete="nickname" v-model="name" placeholder="请输入昵称" class="phone" id="phone-number"
                 type="tel" required/>
          <hr style="margin-top: 45px;border: none;height: 0.5px;background-color: #e3e5e7;">
          <div style="left: 37px;top: 57px;position: absolute">
            密码
          </div>
          <div class="input-group">
            <input autocomplete="current-password" v-model="password" placeholder="请输入密码" class="password"
                   id="password"
                   type="password" required/>
          </div>
          <hr style="margin-top: 45px;border: none;height: 0.5px;background-color: #e3e5e7;">
          <div style="left: 22px;top: 102px;position: absolute">
            确认密码
          </div>
          <div>
            <input autocomplete="new-password" v-model="confirmPassword" placeholder="确认密码" type="password"
                   class="ConfirmPassword">
          </div>
          <hr style="margin-top: 45px;border: none;height: 0.5px;background-color: #e3e5e7;">
          <div style="position: absolute;left: 29px;top: 147px;">
            手机号
          </div>
          <button type="button"
                  style="border:0;outline:none;background-color: transparent;cursor: pointer;position:absolute;left: 295px;top: 140px"
                  @click="sendSMSCode" :disabled="isBtnDisabled">
  <span :class="{ 'countdown-active': getCaptchaBtnText.countdown !== null }">
    {{ getCaptchaBtnText.countdown }}
  </span>
            {{ getCaptchaBtnText.text }}
          </button>
          <input class="phone1" v-model="phoneNumber" placeholder="请输入手机号" type="number">
          <hr style="margin-top: 45px;border: none;height: 0.5px;background-color: #e3e5e7;">
          <input class="code" v-model="phoneCode" placeholder="请输入验证码" type="number">
          <div style="position:absolute;left: 29px;top: 193px;">
            <div class="line1"></div>
            验证码
          </div>
          <hr style="margin-top: 45px;border: none;height: 0.5px;background-color: #e3e5e7;">
          <input placeholder="请输入图形验证码，区分大小写" class="imgCode" v-model="userInputVerifyCode">
          <img style="left: 3px;width: 90px;top: 232px;position: absolute" :src="captchaImgUrl" alt="验证码"
               @click="getCaptcha">
        </div>
        <button class="zc">注册</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/Login.css';
</style>
