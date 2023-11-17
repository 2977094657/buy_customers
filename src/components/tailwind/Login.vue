<script setup>
import {ref, computed} from 'vue';
import login from "@/components/tailwind/Login.vue";
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {onMounted} from 'vue';
import {getUser, getUserToken, log, messageUser, registers} from "@/api/api";


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
let rememberMe = ref(false);

computed(() => {
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
    if (phoneNumber1.value === '' || password1.value === ''){
      showMessage('请输入手机号或密码');
      return
    }
    const response = await log(phoneNumber1.value, password1.value, rememberMe.value ? 1 : "");
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
      const response = await getUserToken(token);
      if (response.data) {
        const userInfoResponse = await getUser(response.data.userId);
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
    const response = await messageUser(phoneNumber.value);
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
        countdownTimer = setInterval(() => {
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
        }, 1000);
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
    showMessage('验证码发送失败，请稍后再试');
  }
};

const registerUser = async () => {
  if (!name.value || !password.value || !confirmPassword.value || password.value !== confirmPassword.value || !phoneNumber.value || !phoneCode.value) {
    showMessage(
        !name.value ? '用户名不能为空' :
            !password.value ? '密码不能为空' :
                !confirmPassword.value ? '确认密码不能为空' :
                    password.value !== confirmPassword.value ? '密码和确认密码不一致' :
                        !phoneNumber.value ? '手机号不能为空' :
                            '短信验证码不能为空'
    );
    return;
  }
  try {
    const response = await registers(phoneNumber.value, name.value, password.value, phoneCode.value);
    if (response.data === '注册成功') {
      showSuccessMessage('注册成功');
      switchForm('login')
      name.value = null
      password.value = null
      confirmPassword.value = null
      phoneNumber.value = null
      phoneCode.value = null
      userInputVerifyCode.value = null

    } else {
      showMessage(response.data);
    }
  } catch (error) {
    console.error(error);
  }
};

</script>

<template>
    <div>
      <div class="wz">
        <span @click="switchForm('login')" :class="{ active: currentForm === 'login' }"
              class="form-switcher">登录</span>
        <div class="line"></div>
        <span @click="switchForm('register')" :class="{ active: currentForm === 'register' }"
              class="form-switcher">注册</span>
      </div>

      <form v-if="currentForm === 'login'" @submit.prevent="login" class="login">
        <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img class="mx-auto h-10 w-auto" src="http://124.221.7.201:5000/logo.png" alt="Your Company" />
          </div>

          <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <div class="space-y-6">
                <div>
                  <label for="email" class="block text-sm font-medium leading-6 text-gray-900">手机号</label>
                  <div class="mt-2">
                    <input id="email" v-model="phoneNumber1" placeholder="请输入手机号" name="email" type="number" autocomplete="email" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div>
                  <label for="password" class="block text-sm font-medium leading-6 text-gray-900">密码</label>
                  <div class="mt-2">
                    <input id="password" v-model="password1" placeholder="请输入密码" name="password" type="password" autocomplete="current-password" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                    <label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-900">7天免登录</label>
                  </div>

                  <div class="text-sm leading-6">
                    <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">忘记密码？</a>
                  </div>
                </div>

                <div>
                  <button @click="loginUser" style="background-image: linear-gradient(to right,#ff5000 0,#ff6000 100%);" type="button" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    登&nbsp;&nbsp;&nbsp;&nbsp;录
                  </button>
                </div>
              </div>

              <div>
                <div class="relative mt-10">
                  <div class="absolute inset-0 flex items-center" aria-hidden="true">
                    <div class="w-full border-t border-gray-200" />
                  </div>
                  <div class="relative flex justify-center text-sm font-medium leading-6">
                    <span class="bg-white px-6 text-gray-900">或者使用以下方式登录</span>
                  </div>
                </div>

                <div class="mt-6 grid grid-cols-2 gap-4">
                  <a href="#" class="flex w-full items-center justify-center gap-3 rounded-md bg-[#1D9BF0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]">
                    <svg class="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    <span class="text-sm font-semibold leading-6">Twitter</span>
                  </a>

                  <a href="#" class="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]">
                    <svg class="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-semibold leading-6">GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>



      <form v-else-if="currentForm === 'register'" @submit.prevent="register">
        <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img class="mx-auto h-10 w-auto" src="http://124.221.7.201:5000/logo.png" alt="Your Company" />
          </div>

          <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <div class="space-y-6">
                <div>
                  <label for="email" class="block text-sm font-medium leading-6 text-gray-900">用户名</label>
                  <div class="mt-2">
                    <input v-model="name" name="email" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div>
                  <label for="password" class="block text-sm font-medium leading-6 text-gray-900">密码</label>
                  <div class="mt-2">
                    <input v-model="password" type="password" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium leading-6 text-gray-900">确认密码</label>
                  <div class="mt-2">
                    <input v-model="confirmPassword" type="password" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium leading-6 text-gray-900">请输入图形验证码，<span style="color: #e15f00">区分大小写</span></label>
                  <div class="mt-2">
                    <input v-model="userInputVerifyCode" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    <img style="width: 90px; margin-top: 10px;" :src="captchaImgUrl" alt="验证码" @click="getCaptcha">
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium leading-6 text-gray-900">请输入手机号</label>
                  <div class="mt-2 flex">
                    <input v-model="phoneNumber" required="" class="flex-grow block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    <button type="button" style="border:0;outline:none;background-color: transparent;cursor: pointer;margin-left: 10px" @click="sendSMSCode" :disabled="isBtnDisabled">
                      <span :class="{ 'countdown-active': getCaptchaBtnText.countdown !== null }">
                        {{ getCaptchaBtnText.countdown }}
                      </span>
                      {{ getCaptchaBtnText.text }}
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium leading-6 text-gray-900">请输入短信验证码</label>
                  <div class="mt-2 flex">
                    <input v-model="phoneCode" type="number" required="" class="flex-grow block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>


                <div>
                  <button @click="registerUser" style="background-image: linear-gradient(to right,#ff9000 0,#ff7000 100%);" type="button" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    注&nbsp;&nbsp;&nbsp;&nbsp;册
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
</template>

<style scoped>
@import '../../assets/Tailwind.css';
.form-switcher {
  cursor: pointer;
}

.form-switcher.active {
  color: #ff915e;
}

.line{
  width: 1px;
  height: 20px;
  background: #e3e5e7;
  border-radius: 8px;
  margin: 0 21px; /* 增加左右间距以分离文字 */
}

.wz{
  display: flex;
  justify-content: center;
  color: #505050;
  font-size: 18px;
}

.countdown-active {
  color: #ff915e;
}

</style>
