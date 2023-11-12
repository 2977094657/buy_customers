<template>
  <div v-if="userInfo">
    <div>
      <img class="h-32 w-full object-cover lg:h-48" :src="imageUrl1" alt="" />
    </div>
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
        <div class="flex">
          <img @click="showModal()" class="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" :src="imageUrl1" alt="" />
        </div>
        <div class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
          <div class="mt-6 min-w-0 flex-1 sm:hidden md:block">
            <h1 class="truncate text-2xl font-bold text-gray-900 z-0">
              {{ userInfo.name }}
              <el-icon style="color: rgb(95,212,242);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='男性'"><Male/></el-icon>
              <el-icon style="color: rgb(255,117,143);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='女性'"><Female/></el-icon>
            </h1>
            <el-alert :title="userInfo.description" type="warning" :closable="false"/>
          </div>
          <div class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <button @click="showModal3" type="button" class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <EditPen class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              <span>修改个人信息</span>
            </button>
            <button @click="schu" type="button" class="inline-flex justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition duration-500 ease select-none hover:bg-red-600">
              <ArrowRightOnRectangleIcon class="-ml-0.5 mr-1.5 h-5 w-5 text-white" aria-hidden="true" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>
      <div class="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
        <h1 class="truncate text-2xl font-bold text-gray-900">
          {{ userInfo.name }}
          <el-icon style="color: rgb(95,212,242);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='男性'"><Male/></el-icon>
          <el-icon style="color: rgb(255,117,143);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='女性'"><Female/></el-icon>
        </h1>
        <el-alert :title="userInfo.description" type="warning" :closable="false"/>
      </div>
    </div>

    <!--      修改头像弹窗-->
    <a-modal style="text-align: center;top: 20%;" title="请选择图片上传：支持JPG、PNG等格式，图片需小于1M"
             v-model:open="open" @ok="handleOk" ok-text="修改" cancel-text="取消">
      <div style="display: flex; align-items: center;margin: 20px 0 0 0">
        <el-upload
            class="avatar-uploader"
            :limit="1"
            :show-file-list="true"
            :before-upload="beforeAvatarUpload"
            :http-request="test"
            :on-remove="remove"
            :on-exceed="exceed"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar1" alt=""/>
          <el-icon v-else style="width: 100px;height: 100px">
            <Plus/>
          </el-icon>
        </el-upload>
        <el-divider direction="vertical" style="height: 180px; margin: 0 80px;"/>
        <img :src="imageUrl1" class="user-avatar1" alt=""/>
        <span style="margin: 120px 0 0 -65px">预览</span>
      </div>
    </a-modal>

    <!--            修改个人信息弹窗-->
    <a-modal style="text-align: center;" v-model:open="open3" :footer="null">
      <el-form style="margin: 25px 0 0 0" label-width="120px" class="demo-ruleForm" status-icon>
        <el-tabs v-model="activeName" class="demo-tabs" stretch>
          <el-tab-pane style="margin: 20px 0 0 -20px" label="修改个人信息" name="first">
            <el-form-item label="用户名" :required="true">
              <el-input v-model="editForm.username" placeholder="不能超过20个字符"/>
            </el-form-item>

            <el-form-item label="选择性别" :required="true">
              <el-radio-group v-model="editForm.gender">
                <el-radio :label="3">男性</el-radio>
                <el-radio :label="6">女性</el-radio>
                <el-radio :label="9">保密</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="个性标签" :required="true">
              <el-input v-model="editForm.description" placeholder="不能超过20个字符"/>
            </el-form-item>
            <button @click="updateUserInfo" type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              修改
            </button>

          </el-tab-pane>

          <el-tab-pane style="margin: 20px 0 0 -20px" label="更换手机号">
            <el-form-item label="旧手机号" :required="true">
              <el-input v-model="phoneNumber" placeholder="请输入手机号">
                <template #prepend>
                  <el-select placeholder="中国大陆 +86">
                    <el-option label="抱歉，暂时只支持中国大陆手机号"/>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="验证码" :required="true">
              <el-row>
                <el-col :span="15">
                  <el-input v-model="code" placeholder="请输入验证码"/>
                </el-col>
                <el-col :span="5">
                  <button type="button" style="border:0;outline:none;background-color: transparent;cursor: pointer;width: 70px;left: 10px;position: relative" @click="sendSMSCode" :disabled="isBtnDisabled">
                <span :class="{ 'countdown-active': getCaptchaBtnText.countdown !== null }">
                    {{ getCaptchaBtnText.countdown }}
                </span>
                    {{ getCaptchaBtnText.text }}
                  </button>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="新手机号" :required="true">
              <el-input v-model="newPhone" placeholder="请输入手机号">
                <template #prepend>
                  <el-select placeholder="中国大陆 +86">
                    <el-option label="抱歉，暂时只支持中国大陆手机号"/>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <button @click="changePhone" type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              修改
            </button>
          </el-tab-pane>

          <el-tab-pane style="margin: 20px 0 0 -20px" label="修改密码" name="third">
            <el-form-item label="旧密码" :required="true">
              <el-input v-model="passwordForm.oldPassword.value" placeholder="请输入旧密码"/>
            </el-form-item>
            <el-form-item label="新密码" :required="true">
              <el-input v-model="passwordForm.newPassword.value" placeholder="请输入新密码"/>
            </el-form-item>
            <el-form-item label="确认密码" :required="true">
              <el-input v-model="passwordForm.confirmPassword.value" placeholder="请确认密码"/>
            </el-form-item>
            <button @click="updatePassword" type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              修改
            </button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </a-modal>
  </div>
</template>

<script setup>
import {ArrowRightOnRectangleIcon} from "@heroicons/vue/24/outline";

const profile = {
  name: 'Ricardo Cooper',
  email: 'ricardo.cooper@example.com',
  avatar:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
  backgroundImage:
      'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  fields: [
    ['Phone', '(555) 123-4567'],
    ['Email', 'ricardocooper@example.com'],
    ['Title', 'Senior Front-End Developer'],
    ['Team', 'Product Development'],
    ['Location', 'San Francisco'],
    ['Sits', 'Oasis, 4th floor'],
    ['Salary', '$145,000'],
    ['Birthday', 'June 8, 1990'],
  ],
}

import {ref, onMounted, computed, reactive, watch} from 'vue';
import store from "@/store";
import {EditPen, Female, Male, Plus} from "@element-plus/icons-vue";
import axios from 'axios';
import router from "@/router/router";
import {changePassword, changePhones, getAddress, getUser, messageUser, updateAvatar, updateUser} from "@/api/api";

const userInfo = ref(null);
const userid = computed(() => store.state.userInfo.userId)
const avatarUrl = ref('');
const imageUrl1 = ref('')
const empty = ref(false)
const number = ref()


const fetchUserInfo = async () => {
  const userId = userid.value;
  if (userId) {
    const response = await getUser(userId);
    const data = response.data;
    if (data.code === 0) {
      userInfo.value = data.data;
      avatarUrl.value = data.data.userAvatar; // 获取头像图片URL
      imageUrl1.value = data.data.userAvatar;
    } else {
      console.error('获取用户信息失败');
    }
  } else {
    setTimeout(fetchUserInfo, 1);
  }
};

onMounted(fetchUserInfo);
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
        value: region.name,
        label: region.name,
        children: region.pchilds.map(city => ({
          value: city.name,
          label: city.name,
          children: city.cchilds.map(district => ({
            value: district.name,
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


const ruleFormRef = ref()
const ruleForm = reactive({
  consignee: '',
  fullAddress: '',
  phone: '',
})


const tableData = reactive({
  data: [
    {
      consignee: '',
      address: '',
      fullAddress: '',
      phoneNumber: '',
    },
  ],
  version: 0,
});

let open = ref(false)
let open3 = ref(false)
const land = computed(() => store.state.userInfo.land)

let currentMessageInstance = null
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


const showModal = () => {
  if (land.value) {
    open.value = true
  } else {
    showMessage('请先登录')
  }
}
const handleOk = async () => {
  const result = await uploadAvatar(file);
  if (result) {
    open.value = false
    // 延迟一段时间后刷新页面
    setTimeout(() => {
      location.reload();
    }, 500);
  } else {
    showMessage('请选择图片！')
  }
}
const showModal3 = () => {
  if (land.value) {
    // 将用户的信息复制到 editForm 对象中
    editForm.username = userInfo.value.name;
    editForm.gender = userInfo.value.gender === '男性' ? 3 : (userInfo.value.gender === '女性' ? 6 : 9);
    editForm.description = userInfo.value.description;
    open3.value = true;
  } else {
    showMessage('请先登录');
  }
};

const imageUrl = ref('')
const file = ref()

const beforeAvatarUpload = (rawFile) => {
  if (!rawFile.type.startsWith('image/')) {
    showMessage('只能上传图片文件！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1) {
    showMessage('头像图片大小不能超过 1MB！')
    return false
  } else if (rawFile.name.length > 20) {
    showMessage('文件名不能超过20个字符');
    return false
  }
  imageUrl.value = URL.createObjectURL(rawFile)
  imageUrl1.value = URL.createObjectURL(rawFile)
  file.value = rawFile
}

const uploadAvatar = async (uploadFile) => {
  if (uploadFile.value === undefined) {
    return false
  } else if (uploadFile.value.size > 0) {
    const data = new FormData()
    data.append('image', uploadFile.value)
    data.append('userid', userid.value)
    const response = await updateAvatar(data);
    if (response.status === 200) {
      showSuccessMessage('头像修改成功')
      return true
    } else if (response.status === 400) {
      showMessage(response.data.message)
      return true
    }
  }
}

const test = () => {

}

const remove = () => {
  imageUrl.value = false
  imageUrl1.value = avatarUrl.value
  file.value = undefined
}

const exceed = () => {
  showMessage('最多只能上传一张图片')
}

const fetchUserAddresses = async () => {
  const userId = userid.value;
  if (userId) {
    const response = await getAddress(userId);
    const data = response.data;
    if (data.code === 200) {
      if (data.data.length === 0) {
        empty.value = true
      } else {
        empty.value = false
        number.value = data.data.length
        let addresses = data.data.map(item => ({
          id: item.id,
          consignee: item.consignee,
          address: item.area,
          fullAddress: item.fullAddress,
          phoneNumber: item.phone,
          defaultOperate: item.defaultOperate,
        }));
        // 按照默认地址排序，将默认地址放在第一位
        addresses.sort((a, b) => b.defaultOperate - a.defaultOperate);
        tableData.value = addresses;
      }
    } else {
      console.error('获取用户收货地址失败');
    }
  } else {
    setTimeout(fetchUserAddresses, 1);
  }
};

onMounted(fetchUserAddresses);
watch(() => tableData.version, fetchUserAddresses);
const activeName = ref('first')
const editForm = reactive({
  username: '',
  gender: '',
  description: '',
});

const updateUserInfo = async () => {
  // 非空校验
  if (!editForm.username || !editForm.description) {
    showMessage('用户名或个性标签不能为空');
    return;
  }
  try {
    const response = await updateUser(userid.value, editForm.username, editForm.description, editForm.gender === 3 ? '男性' : (editForm.gender === 6 ? '女性' : '保密'));

    if (response.data.code === 200) {
      // 如果更新成功，关闭模态框并显示成功消息
      open3.value = false;
      showSuccessMessage('用户信息更新成功');
      // 重新获取用户信息以更新页面
      await fetchUserInfo();
    } else {
      // 如果更新失败，显示错误信息
      showMessage(response.data.msg);
    }
  } catch (error) {
    showMessage('请求接口出错：' + error.message);
  }
};

const passwordForm = {
  oldPassword: ref(''),
  newPassword: ref(''),
  confirmPassword: ref('')
}
const updatePassword = async () => {
  if (!passwordForm.oldPassword.value || !passwordForm.newPassword.value || !passwordForm.confirmPassword.value) {
    showMessage('所有字段都必须填写')
    return
  }

  if (passwordForm.newPassword.value !== passwordForm.confirmPassword.value) {
    showMessage('新密码和确认密码不匹配')
    return
  }

  try {
    const response = await changePassword(userid.value, passwordForm.oldPassword.value, passwordForm.newPassword.value, passwordForm.confirmPassword.value);

    if (response.data.code === 200) {
      // 如果更新成功，关闭模态框并显示成功消息
      open3.value = false;
      showSuccessMessage('密码更新成功')
    } else {
      showMessage(response.data.msg)
    }
  } catch (error) {
    showMessage('请求接口出错：' + error.message)
  }
}

let countdownTimer = null // 存储计时器
let phoneNumber = ref('');
let isSending = ref(false);
let getCaptchaBtnText = ref({countdown: null, text: '获取验证码'})
let isBtnDisabled = ref(false)
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

let code = ref('');
let newPhone = ref('');

const changePhone = async () => {
  if (!phoneNumber.value || !code.value || !newPhone.value) {
    showMessage('所有字段都必须填写')
    return
  }
  // 使用正则表达式验证手机号码
  const phoneNumberReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (!phoneNumberReg.test(phoneNumber.value)) {
    // 如果电话号码不符合正则表达式，显示错误信息并返回，不继续发送请求
    showMessage('请输入正确的手机号码');
    return;
  }
  try {
    const response = await changePhones(userid.value, phoneNumber.value, code.value, newPhone.value);

    if (response.data.code === 200) {
      // 如果更新成功，关闭模态框并显示成功消息
      open3.value = false;
      // 修改成功，做一些事情，比如显示一条消息
      showSuccessMessage('手机号修改成功')
    } else {
      // 修改失败，显示错误消息
      showMessage('手机号修改失败: ', response.data.msg);
    }
  } catch (error) {
    // 请求失败，显示错误消息
    console.log('请求失败: ', error);
  }
};

const logout = () => {
  // 删除本地存储的token
  localStorage.removeItem('token');

  // 导航到首页
  router.push({name: 'Home'});

  showSuccessMessage('退出成功')
}

const schu = () => {
  ElMessageBox.confirm(
      '确认退出登录吗?',
      '退出登录',
      {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  )
      .then(() => {
        logout();
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消退出',
        })
      })
}
</script>

<style scoped>
@import '../../assets/Tailwind.css';
@import '../../assets/InforMation.css';
.countdown-active {
  color: #ff915e;
}
</style>
