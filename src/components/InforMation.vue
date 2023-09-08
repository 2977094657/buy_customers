<script setup>
import {ref, onMounted, computed, reactive, watch} from 'vue';
import store from "@/store";
import {Edit, Female, Male, Plus} from "@element-plus/icons-vue";
import axios from 'axios';

const userInfo = ref(null);
const userid = computed(() => store.state.userInfo.userId)
const avatarUrl = ref('');
const imageUrl1 = ref('')
const empty = ref(false)
const number = ref()


const fetchUserInfo = async () => {
  const userId = userid.value;
  if (userId) {
    const response = await fetch(`http://1.14.126.98:8081/user/all?userId=${userId}`);
    const data = await response.json();
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
let open1 = ref(false)
let open2 = ref(false)
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


const showModal1 = () => {
  if (land.value) {
    open1.value = true
  } else {
    showMessage('请先登录')
  }
}

const showModal2 = () => {
  if (land.value) {
    open2.value = true
  } else {
    showMessage('请先登录')
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
    const response = await axios.put('http://1.14.126.98:8081/user/updateAvatar', data)
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
    const response = await fetch(`http://1.14.126.98:8081/address/all?userId=${userId}`);
    const data = await response.json();
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

const addAddress = async () => {
  // 验证表单字段是否都已填写
  if (!ruleForm.consignee || selectedRegion.value.length === 0 || !ruleForm.fullAddress || !ruleForm.phone) {
    showMessage('请填写所有字段');
    return;
  } else {
    // 使用正则表达式验证手机号码
    const phoneNumberReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!phoneNumberReg.test(ruleForm.phone)) {
      // 如果电话号码不符合正则表达式，显示错误信息并返回，不继续发送请求
      showMessage('请输入正确的手机号码');
      return;
    }
  }

  try {
    const response = await axios.post('http://1.14.126.98:8081/address/add', null, {
      params: {
        userId: userid.value,
        consignee: ruleForm.consignee,
        area: selectedRegion.value.join('/'),
        fullAddress: ruleForm.fullAddress,
        phone: ruleForm.phone,
      }
    });

    if (response.data.code === 200) {
      showSuccessMessage(response.data.msg);
      open2.value = false
      // 通过更新表格值来刷新收货地址
      tableData.version++;
    } else {
      showMessage(response.data.msg)
    }
  } catch (error) {
    if (error.response) {
      // 请求已经发送，服务器也已响应，但是状态码超出了 2xx 的范围
      showMessage(error.response.data.msg);
    } else if (error.request) {
      // 请求已经发送，但没有收到任何服务器响应
      showMessage('服务器没有响应');
    }
  }
};

const currentAddress = ref(null);
const currentAddressId = ref(null);
const editAddress = (row) => {
  currentAddressId.value = row.id;
  // 拆分地址字符串为数组
  const addressArray = row.address.split('/');
  currentAddress.value = {
    ...row,
    address: addressArray, // 将拆分后的数组赋值给 address 属性
  };
  showModal1();
};

const handleOk1 = async () => {
  // 验证表单字段是否都已填写
  if (!currentAddress.value.consignee || currentAddress.value.address.join('/') === null || !currentAddress.value.fullAddress || !currentAddress.value.phoneNumber) {
    showMessage('请填写所有字段');
    return;
  } else {
    // 使用正则表达式验证手机号码
    const phoneNumberReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!phoneNumberReg.test(currentAddress.value.phoneNumber)) {
      // 如果电话号码不符合正则表达式，显示错误信息并返回，不继续发送请求
      showMessage('请输入正确的手机号码');
      return;
    }
  }
  try {
    const params = {
      id: currentAddressId.value,
      consignee: currentAddress.value.consignee,
      area: currentAddress.value.address.join('/'), // 将数组组合成字符串
      fullAddress: currentAddress.value.fullAddress,
      phone: currentAddress.value.phoneNumber,
    };
    const response = await axios.put('http://1.14.126.98:8081/address/update', null, {params});
    if (response.data.code === 200) {
      open1.value = false
      tableData.version++;
      showSuccessMessage(response.data.msg)
    } else {
      showMessage(response.data.msg)
    }
  } catch (error) {
    showMessage('请求接口出错：' + error.message);
  }
};

const schu = (row) => {
  ElMessageBox.confirm(
      '确认要删除该地址吗?',
      '删除地址',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  )
      .then(() => {
        removeAddress(row.id);
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

const removeAddress = async (id) => {
  try {
    const response = await axios.delete(`http://1.14.126.98:8081/address/delete`, {
      params: {
        id: id
      }
    });
    if (response.data.code === 200) {
      showSuccessMessage(response.data.msg);
    } else {
      showMessage(response.data.msg);
    }
    tableData.version++
  } catch (error) {
    showSuccessMessage('删除失败');
  }
}

const setDefaultAddress = async (row) => {
  try {
    // 找到当前的默认地址
    const currentDefault = tableData.value.find(item => item.defaultOperate === 1);
    if (currentDefault) {
      // 取消当前的默认地址
      await axios.put('http://1.14.126.98:8081/address/updateDefault', null, {
        params: {
          id: currentDefault.id,
          defaultOperate: 0,
        },
      });
    }
    // 设置新的默认地址
    const response = await axios.put('http://1.14.126.98:8081/address/updateDefault', null, {
      params: {
        id: row.id,
        defaultOperate: 1,
      },
    });
    if (response.data.code === 200) {
      // 如果成功更新了默认地址，重新获取地址列表
      await fetchUserAddresses();
      showSuccessMessage(response.data.msg)
    } else {
      showMessage('设置默认地址失败：' + response.data.msg);
    }
  } catch (error) {
    showMessage('请求接口出错：' + error.message);
  }
};

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
    const response = await axios.put('http://1.14.126.98:8081/user/updateUser', null, {
      params: {
        userId: userid.value,
        name: editForm.username,
        description: editForm.description,
        gender: editForm.gender === 3 ? '男性' : (editForm.gender === 6 ? '女性' : '保密')
      }
    });

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
    const response = await axios.post(`http://1.14.126.98:8081/user/password?userId=${userid.value}&oldPassword=${passwordForm.oldPassword.value}&newPassword=${passwordForm.newPassword.value}&confirmPassword=${passwordForm.confirmPassword.value}`)

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
let getCaptchaBtnText = ref({countdown: null, text: '点击获取验证码'})
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
    const response = await axios.post(`http://1.14.126.98:8081/user/message?phoneNumber=${phoneNumber.value}`);
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
    const response = await axios.put(`http://1.14.126.98:8081/user/changePhone?userid=${userid.value}&oldPhone=${phoneNumber.value}&code=${code.value}&phone=${newPhone.value}`);

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
</script>

<template>
  <div class="user-avatar-container">
    <div class="avatar" :style="{'background-image': `url(${avatarUrl})`}"></div>
    <div class="user-avatar" @click="showModal()">
      <div class="avatar-mask">更换头像</div>
      <img :src="avatarUrl" style="margin: -183px 0 0 -45px;position: absolute" class="user-avatar" alt=""/>
    </div>
    <div>

      <!--      修改头像弹窗-->
      <a-modal width="40%" style="text-align: center;top: 20%;" title="请选择图片上传：支持JPG、PNG等格式，图片需小于1M"
               v-model:open="open" @ok="handleOk" ok-text="修改" cancel-text="取消">
        <div style="display: flex; align-items: center;margin: 30px 0 0 40px">
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
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
          <el-divider direction="vertical" style="height: 180px; margin: 0 80px;"/>
          <img :src="imageUrl1" class="user-avatar1" alt=""/>
          <span style="margin: 120px 0 0 -65px">预览</span>
        </div>
      </a-modal>

    </div>
  </div>
  <div class="user-info-wrapper">
    <div v-if="userInfo" class="user-info-container">
      <div style="margin: 0 40px 20px 20px">
        <h1 style="margin: 30px 0 40px 0">
          {{ userInfo.name }}
          <span>
            <el-icon style="color: rgb(95,212,242);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='男性'"><Male/></el-icon>
            <el-icon style="color: rgb(255,117,143);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='女性'"><Female/></el-icon>

            <el-button @click="showModal3" style="margin: 0 0 0 80%" type="warning" :icon="Edit"/>

<!--            修改个人信息弹窗-->
            <a-modal style="text-align: center;" v-model:open="open3" :footer="null">
              <el-form style="margin: 25px 0 0 -40px" label-width="120px" class="demo-ruleForm" status-icon>
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
                    <el-button style="margin: 20px 0 0 5px" type="primary" @click="updateUserInfo">修改</el-button>

                  </el-tab-pane>

                  <el-tab-pane style="margin: 20px 0 0 -20px" label="修改手机号">
                    <el-form-item label="旧手机号" :required="true">
                        <el-input v-model="phoneNumber" placeholder="请输入手机号">
                          <template #prepend>
                            <el-select placeholder="中国大陆 +86" style="width: 130px">
                              <el-option label="抱歉，暂时只支持中国大陆手机号"/>
                            </el-select>
                          </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="验证码" :required="true">
                      <el-input v-model="code" style="width: 200px;" placeholder="请输入验证码"/>
                      <button type="button" style="border:0;outline:none;background-color: transparent;cursor: pointer;position:absolute;left: 230px;width: 120px" @click="sendSMSCode" :disabled="isBtnDisabled">
                        <span :class="{ 'countdown-active': getCaptchaBtnText.countdown !== null }">
                          {{ getCaptchaBtnText.countdown }}
                        </span>
                        {{ getCaptchaBtnText.text }}
                      </button>
                    </el-form-item>
                    <el-form-item label="新手机号" :required="true">
                        <el-input v-model="newPhone" placeholder="请输入手机号">
                          <template #prepend>
                            <el-select placeholder="中国大陆 +86" style="width: 130px">
                              <el-option label="抱歉，暂时只支持中国大陆手机号"/>
                            </el-select>
                          </template>
                        </el-input>
                    </el-form-item>
                    <el-button style="margin: 20px 0 0 5px" type="primary" @click="changePhone">修改</el-button>
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
                    <el-button style="margin: 20px 0 0 5px" type="primary" @click="updatePassword">修改</el-button>
                  </el-tab-pane>
                </el-tabs>
              </el-form>
            </a-modal>

          </span>
        </h1>
        <span>
          <span style="color:#606266;">个性标签：</span>{{ userInfo.description }}
        </span>
        <span style="margin: 0 0 0 100px">
          <span style="color:#606266;">绑定手机：</span>{{ formatPhoneNumber(userInfo.phone) }}
        </span>
        <span style="margin: 0 0 0 100px">
          <span style="color:#606266;">注册时间：</span>{{ formatTime(userInfo.signupTime) }}
        </span>
        <el-alert :closable="false" style="background-color: #e3f2fd;margin: 20px 0 0 0"
                  :title="'已保存了'+(number)+'条地址，还能保存'+(20-number)" type="info" show-icon/>
        <el-button style="margin: 20px 0 0 0;" type="primary" size="large" @click="showModal2()">添加收货地址
        </el-button>

        <!--        添加收货地址弹窗-->
        <a-modal style="text-align: center;" title="添加收货地址"
                 v-model:open="open2" @ok="addAddress()" ok-text="添加" cancel-text="取消">
          <el-form
              style="margin: 25px 0 0 -40px"
              ref="ruleFormRef"
              label-width="120px"
              class="demo-ruleForm"
              status-icon
          >
            <el-form-item label="收货人" :required="true">
              <el-input v-model="ruleForm.consignee" placeholder="不能超过20个字符"/>
            </el-form-item>
            <el-form-item label="所在地区" :required="true">
              <el-cascader style="width: 100%"
                           placeholder="请选择省 / 市 / 区"
                           v-model="selectedRegion"
                           :options="regions"
                           :props="props"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" :required="true">
              <el-input type="textarea" :resize="'none'" autosize v-model="ruleForm.fullAddress"
                        placeholder="请输入详细地址信息，如乡镇、道路、门牌号、小区、楼栋号、单元等信息"/>
            </el-form-item>
            <el-form-item label="手机号" :required="true">
              <div style="width: 100%">
                <el-input v-model="ruleForm.phone" placeholder="请输入手机号">
                  <template #prepend>
                    <el-select placeholder="中国大陆 +86" style="width: 130px">
                      <el-option label="抱歉，暂时只支持中国大陆手机号"/>
                    </el-select>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </el-form>
        </a-modal>


        <!--        收货地址表格-->
        <el-table empty-text="你的包裹在问：请问去哪儿？快填写收货地址吧！" :stripe="true" :border="true"
                  :data="tableData.value" height="400" style="width: 100%;margin: 20px 0 0 0">
          <el-table-column prop="consignee" label="收货人" width="130"/>
          <el-table-column prop="address" label="所在地区" width="175"/>
          <el-table-column prop="fullAddress" label="详细地址" width="150"/>
          <el-table-column prop="phoneNumber" label="手机号" width="150"/>
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button size="small" type="primary" @click="editAddress(row)">修改</el-button>
              <el-button size="small" type="danger" @click="schu(row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column label="默认地址">
            <template v-slot="{row}">
              <el-button size="small" type="warning" plain v-if="row.defaultOperate === 0"
                         @click="setDefaultAddress(row)">设为默认
              </el-button>
              <button v-else class="default">已为默认</button>
            </template>
          </el-table-column>
        </el-table>


        <!--        修改收货地址弹窗-->
        <a-modal style="text-align: center;" title="修改收货地址"
                 v-model:open="open1" @ok="handleOk1" ok-text="修改" cancel-text="取消">
          <el-form
              style="margin: 25px 0 0 -40px"
              ref="ruleFormRef"
              label-width="120px"
              class="demo-ruleForm"
              status-icon
          >
            <el-form-item label="收货人" :required="true">
              <el-input v-model="currentAddress.consignee" placeholder="不能超过20个字符"/>
            </el-form-item>
            <el-form-item label="所在地区" :required="true">
              <el-cascader
                  style="width: 100%"
                  placeholder="请选择省 / 市 / 区"
                  v-model="currentAddress.address"
                  :options="regions"
                  :props="props"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" :required="true">
              <el-input type="textarea" :resize="'none'" autosize v-model="currentAddress.fullAddress"
                        placeholder="请输入详细地址信息，如乡镇、道路、门牌号、小区、楼栋号、单元等信息"/>
            </el-form-item>
            <el-form-item label="手机号" :required="true">
              <div style="width: 100%">
                <el-input placeholder="请输入手机号" v-model="currentAddress.phoneNumber">
                  <template #prepend>
                    <el-select placeholder="中国大陆 +86" style="width: 130px">
                      <el-option label="抱歉，暂时只支持中国大陆手机号"/>
                    </el-select>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </el-form>
        </a-modal>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/InforMation.css';

.demo-tabs {
  margin: 20px 0 20px 40px;
}

.countdown-active {
  color: #ff915e;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  background-color: rgb(250, 250, 250);
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

:where(.css-dev-only-do-not-override-eq3tly).ant-modal .ant-modal-footer {
  text-align: center;
  background: transparent;
  padding: 30px 0 20px 0;
}

:where(.css-dev-only-do-not-override-eq3tly).ant-btn {
  left: 28px;
  font-size: 14px;
  height: 32px;
  padding: 4px 15px;
  border-radius: 6px;
  margin: 0 30px 0 0;
}
</style>
