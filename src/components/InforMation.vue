<script setup>
import {ref, onMounted, computed, reactive} from 'vue';
import store from "@/store";
import {Female, Male,Plus} from "@element-plus/icons-vue";
import axios from 'axios';

const userInfo = ref(null);
const userid = computed(() => store.state.userInfo.userId)
const avatarUrl = ref('');
const imageUrl1 = ref('')

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


const ruleFormRef = ref()
const ruleForm = reactive({
  address: '',
  name: '',
  region: '',
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})


const tableData = [
  {
    consignee: '14863',
    address: '四川省 眉山市 仁寿县 视高街道',
    fullAddress: '四川科技职业学院10号公寓',
    phoneNumber: '17628887613',
  },
]

let open = ref(false)
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

</script>

<template>
  <div class="user-avatar-container">
    <div class="avatar" :style="{'background-image': `url(${avatarUrl})`}"></div>
    <div class="user-avatar" @click="showModal()">
      <div class="avatar-mask">更换头像</div>
      <img :src="avatarUrl" style="margin: -183px 0 0 -45px;position: absolute" class="user-avatar"/>
    </div>
    <div>
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
          <img :src="imageUrl1" class="user-avatar1"/>
          <span style="margin: 120px 0 0 -65px">预览</span>
        </div>
      </a-modal>
    </div>
  </div>
  <div class="user-info-wrapper">
    <div v-if="userInfo" class="user-info-container">
      <div class="user-info-details">
        <h1 style="margin: 30px 0 40px 0">
          {{ userInfo.name }}
          <span>
            <el-icon style="color: rgb(95,212,242);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='男性'"><Male/></el-icon>
            <el-icon style="color: rgb(255,117,143);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='女性'"><Female/></el-icon>
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
        <div style="margin: 20px 0 0 0"><span style="color:#606266;">当前默认收货地址：</span>{{ userInfo.address }}
        </div>
        <div style="text-align: center">
          <el-button style="margin: 15px 0 40px 0;" type="primary" size="large" @click="">修改个人信息</el-button>
        </div>
        <el-alert :closable="false" style="background-color: #e3f2fd;" title=" 已保存4了条地址，还能保存16条地址"
                  type="info" show-icon/>
        <el-table :border="true" :data="tableData" height="400" style="width: 100%;margin: 20px 0 0 0">
          <el-table-column prop="consignee" label="收货人" width="130"/>
          <el-table-column prop="address" label="所在地区" width="175"/>
          <el-table-column prop="fullAddress" label="详细地址" width="175"/>
          <el-table-column prop="phoneNumber" label="手机号" width="175"/>
          <el-table-column label="操作">
            <el-button size="small" @click="">修改</el-button>
            <el-button size="small" type="danger" @click="">删除</el-button>
            <el-button size="small" type="warning" @click="">设为默认</el-button>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--      <el-form-->
    <!--          style="margin: 25px 0 0 -40px"-->
    <!--          ref="ruleFormRef"-->
    <!--          label-width="120px"-->
    <!--          class="demo-ruleForm"-->
    <!--          status-icon-->
    <!--      >-->
    <!--        <el-form-item label="地址信息" :required="true">-->
    <!--          <el-cascader-->
    <!--              placeholder="请选择省 / 市 / 区"-->
    <!--              v-model="selectedRegion"-->
    <!--              :options="regions"-->
    <!--              :props="props"-->
    <!--          ></el-cascader>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="详细地址" :required="true">-->
    <!--          <el-input type="textarea" :resize="'none'" autosize v-model="ruleForm.region" placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单-->
    <!--元等信息"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="收货人姓名" :required="true">-->
    <!--          <el-input v-model="ruleForm.name"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="手机号" :required="true">-->
    <!--          <div>-->
    <!--            <el-input placeholder="请输入手机号">-->
    <!--              <template #prepend>-->
    <!--                <el-select placeholder="中国大陆 +86" style="width: 130px">-->
    <!--                  <el-option label="抱歉，暂时只支持中国大陆手机号"/>-->
    <!--                </el-select>-->
    <!--              </template>-->
    <!--            </el-input>-->
    <!--          </div>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->


  </div>


</template>

<style scoped>
@import '../assets/InforMation.css';
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
