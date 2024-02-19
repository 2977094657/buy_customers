<script setup>
import {ref, computed} from 'vue';
import { useStore } from '../../store/index'
import {useRouter} from 'vue-router';
import {forgotPassword, messageUser} from "@/api/api";


const router = useRouter();
const store = useStore()

let phoneNumber = ref('');
let phoneNumber1 = ref('');
let password = ref('');
let password1 = ref('');
let getCaptchaBtnText = ref({countdown: null, text: '获取验证码'})
let countdownTimer = null // 存储计时器
let currentMessageInstance = null
let isBtnDisabled = ref(false)
let name = ref('');
let isSending = ref(false);
let confirmPassword = ref('');
let phoneCode = ref('')
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

const sendSMSCode = async () => {
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
    console.log(phoneNumber.value)
    const response = await messageUser(phoneNumber.value);
    isSending.value = false;
    if (typeof response.data === 'object' && response.data.SendStatusSet && response.data.SendStatusSet.length > 0) {
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

const handleSubmit = async () => {
  // 验证输入
  if (!phoneNumber.value || !phoneCode.value || !password.value || !confirmPassword.value) {
    showMessage('请填写所有字段');
    return;
  }

  if (password.value !== confirmPassword.value) {
    showMessage('密码和确认密码不匹配');
    return;
  }

  try {
    // 调用后端API
    const response = await forgotPassword(phoneNumber.value,password.value,phoneCode.value);

    if (response.data.success) {
      showSuccessMessage(response.data.success);
      // 延迟一段时间后刷新页面
      setTimeout(() => {
        location.reload();
      }, 500); // 1秒延迟
      // 密码修改成功，跳转页面
      await router.push('/');
    } else {
      // 显示错误信息
      showMessage(response.data.error);
    }
  } catch (error) {
    showMessage('请求失败，请稍后再试');
  }
};

</script>

<template>
  <div class="flex min-h-full flex-1">
    <div class="relative hidden w-0 flex-1 lg:block">
      <img class="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80" alt="" />
    </div>

    <div class="flex flex-1 flex-col justify-center px-4 py-24 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img class="h-10 w-auto" src="http://124.221.7.201:5000/logo.png" alt="Your Company" />
          <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">忘记密码</h2>
        </div>

        <div class="mt-5">
          <div>
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900">输入绑定的手机号</label>
                <div class="mt-2 flex justify-between items-center">
                  <input v-model="phoneNumber" type="number" autocomplete="email" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  <button type="button" style="width: 40%;margin-left: 10px;border:0;outline:none;background-color: transparent;cursor: pointer;" @click="sendSMSCode" :disabled="isBtnDisabled">
                      <span :class="{ 'countdown-active': getCaptchaBtnText.countdown !== null }">
                        {{ getCaptchaBtnText.countdown }}
                      </span>
                    {{ getCaptchaBtnText.text }}
                  </button>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium leading-6 text-gray-900">请输入短信验证码</label>
                </div>
                <div class="mt-2">
                  <input v-model="phoneCode" type="number" autocomplete="current-password" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium leading-6 text-gray-900">新密码</label>
                </div>
                <div class="mt-2">
                  <input v-model="password" type="password" autocomplete="current-password" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium leading-6 text-gray-900">确认密码</label>
                </div>
                <div class="mt-2">
                  <input v-model="confirmPassword" type="password" autocomplete="current-password" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <button @click="handleSubmit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">确认修改</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../../assets/Tailwind.css';
.countdown-active {
  color: #ff915e;
}
</style>
